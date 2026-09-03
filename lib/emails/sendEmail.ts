import * as React from "react";
import { Resend } from "resend";
import { render } from "@react-email/render";
import { ThankYouEmailTemplate } from "./ThankYouEmailPops";
import { PurchaseConfirmationEmailTemplate } from "./PurchaseConfirmationEmail";

function getResend() {
	return new Resend(process.env.RESEND_API_KEY);
}
function getFrom() {
	return `${process.env.SMTP_FROM_NAME || "Spiritans Sounds"} <${process.env.SMTP_FROM_EMAIL}>`;
}

// ── Donation thank-you ────────────────────────────────────────────────────────

interface EmailData {
	to: string;
	subject: string;
	donorName: string;
	amount: number;
	currency: string;
	transactionReference: string;
	date: string;
	message?: string;
}

export async function sendThankYouEmail(data: EmailData): Promise<boolean> {
	try {
		const html = await render(
			React.createElement(ThankYouEmailTemplate, {
				donorName: data.donorName,
				amount: data.amount,
				currency: data.currency,
				transactionReference: data.transactionReference,
				date: data.date,
				message: data.message,
			}),
		);

		const { error } = await getResend().emails.send({
			from: getFrom(),
			to: data.to,
			subject: data.subject,
			html,
		});

		if (error) {
			console.error("❌ Failed to send thank you email:", error.message || error);
			return false;
		}

		console.log(`✅ Thank you email sent to ${data.to}`);
		return true;
	} catch (error) {
		console.error("❌ Failed to send thank you email:", error);
		return false;
	}
}

// ── Purchase confirmation + download link ─────────────────────────────────────

interface PurchaseEmailData {
	to: string;
	subject: string;
	buyerName: string;
	itemTitle: string;
	downloadUrl: string;
	amount: number;
	currency: string;
	transactionReference: string;
	date: string;
}

export async function sendPurchaseConfirmationEmail(data: PurchaseEmailData): Promise<boolean> {
	try {
		const html = await render(
			React.createElement(PurchaseConfirmationEmailTemplate, {
				buyerName: data.buyerName,
				itemTitle: data.itemTitle,
				downloadUrl: data.downloadUrl,
				amount: data.amount,
				currency: data.currency,
				transactionReference: data.transactionReference,
				date: data.date,
			}),
		);

		const { error } = await getResend().emails.send({
			from: getFrom(),
			to: data.to,
			subject: data.subject,
			html,
		});

		if (error) {
			console.error("❌ Failed to send purchase confirmation email:", error.message || error);
			return false;
		}

		console.log(`✅ Purchase confirmation email sent to ${data.to}`);
		return true;
	} catch (error) {
		console.error("❌ Failed to send purchase confirmation email:", error);
		return false;
	}
}

// ── Admin notification (large donations) ─────────────────────────────────────

export async function sendFailedChargeNotification(data: any) {
	try {
		const { error } = await getResend().emails.send({
			from: getFrom(),
			to: process.env.ADMIN_EMAIL!,
			subject: "⚠️ Failed Donation Attempt",
			html: `
        <div style="font-family: 'Montserrat', sans-serif; color: #2d3436; max-width: 600px; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden;">
          <div style="background-color: #ee0303; padding: 20px; text-align: center;">
            <h2 style="color: #ffffff; margin: 0; font-family: 'Playfair Display', serif;">⚠️ Failed Donation Attempt</h2>
          </div>
          <div style="padding: 30px; background-color: #ffffff;">
            <p style="margin-bottom: 20px;">A donation attempt has failed on Spiritans Sound.</p>
            <div style="background-color: #fffcf8; padding: 20px; border-radius: 6px; border-left: 4px solid #ee0303;">
              <p><strong>Email:</strong> ${data.customer?.email || "N/A"}</p>
              <p><strong>Amount:</strong> ${data.currency || "NGN"} ${(data.amount / 100).toLocaleString()}</p>
              <p><strong>Reference:</strong> ${data.reference}</p>
              <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
            </div>
          </div>
          <div style="background-color: #f9fafb; padding: 20px; text-align: center; font-size: 12px; color: #9ca3af; border-top: 1px solid #e5e7eb;">
            &copy; ${new Date().getFullYear()} Spiritans Sound
          </div>
        </div>
      `,
		});

		if (error) {
			console.error("❌ Failed to send failed charge notification:", error.message || error);
		} else {
			console.log("✅ Admin notified of failed charge");
		}
	} catch (error) {
		console.error("❌ Failed to send failed charge notification:", error);
	}
}

export async function sendAdminNotification(donation: any) {
	try {
		const { error } = await getResend().emails.send({
			from: getFrom(),
			to: process.env.ADMIN_EMAIL!,
			subject: `🎉 New Donation Received: ${donation.currency} ${donation.amount / 100}`,
			html: `
        <div style="font-family: 'Montserrat', sans-serif; color: #2d3436; max-width: 600px; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden;">
          <div style="background-color: #ee0303; padding: 20px; text-align: center;">
            <h2 style="color: #ffffff; margin: 0; font-family: 'Playfair Display', serif;">New Donation Received 🎉</h2>
          </div>
          <div style="padding: 30px; background-color: #ffffff;">
            <p style="margin-bottom: 20px;">A new donation has been successfully processed through Spiritans Sound.</p>
            <div style="background-color: #fffcf8; padding: 20px; border-radius: 6px; border-left: 4px solid #ee0303;">
              <p><strong>Donor:</strong> ${donation.metadata?.name || donation.customer.email}</p>
              <p><strong>Email:</strong> ${donation.customer.email}</p>
              <p><strong>Amount:</strong> ${donation.currency} ${donation.amount / 100}</p>
              <p><strong>Reference:</strong> ${donation.reference}</p>
              <p><strong>Date:</strong> ${new Date(donation.paid_at).toLocaleString()}</p>
            </div>
            <p style="margin-top: 30px; text-align: center;">
              <a href="https://dashboard.paystack.com/#/transactions/${donation.id}"
                 style="background-color: #ee0303; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600;">
                View in Paystack Dashboard
              </a>
            </p>
          </div>
          <div style="background-color: #f9fafb; padding: 20px; text-align: center; font-size: 12px; color: #9ca3af; border-top: 1px solid #e5e7eb;">
            &copy; ${new Date().getFullYear()} Spiritans Sound
          </div>
        </div>
      `,
		});

		if (error) {
			console.error("❌ Failed to send admin notification:", error.message || error);
		} else {
			console.log("✅ Admin notification sent");
		}
	} catch (error) {
		console.error("❌ Failed to send admin notification:", error);
	}
}

export async function sendBookSubmissionEmail(data: { email: string; fullName: string; bookTitle: string }) {
	try {
		const { error } = await getResend().emails.send({
			from: getFrom(),
			to: data.email,
			subject: `📚 Book Submission Received: ${data.bookTitle}`,
			html: `
        <div style="font-family: 'Montserrat', sans-serif; color: #2d3436; max-width: 600px; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden;">
          <div style="background-color: #ee0303; padding: 20px; text-align: center;">
            <h2 style="color: #ffffff; margin: 0; font-family: 'Playfair Display', serif;">Submission Received</h2>
          </div>
          <div style="padding: 30px; background-color: #ffffff;">
            <p>Dear ${data.fullName},</p>
            <p>Thank you for submitting your manuscript, <strong>${data.bookTitle}</strong>, to Treasures Unveiler!</p>
            <p>Our editorial team will review your submission and get back to you soon. We appreciate your patience.</p>
          </div>
          <div style="background-color: #f9fafb; padding: 20px; text-align: center; font-size: 12px; color: #9ca3af; border-top: 1px solid #e5e7eb;">
            &copy; ${new Date().getFullYear()} Spiritans Sound
          </div>
        </div>
      `,
		});
		if (error) console.error("❌ Failed to send book submission email:", error.message);
	} catch (error) {
		console.error("❌ Failed to send book submission email:", error);
	}
}

export async function sendBookApprovalEmail(data: { email: string; fullName: string; bookTitle: string; loginUrl: string; tempPassword?: string }) {
	try {
		const { error } = await getResend().emails.send({
			from: getFrom(),
			to: data.email,
			subject: `🎉 Congratulations! Your book "${data.bookTitle}" is Approved`,
			html: `
        <div style="font-family: 'Montserrat', sans-serif; color: #2d3436; max-width: 600px; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden;">
          <div style="background-color: #ee0303; padding: 20px; text-align: center;">
            <h2 style="color: #ffffff; margin: 0; font-family: 'Playfair Display', serif;">Book Approved!</h2>
          </div>
          <div style="padding: 30px; background-color: #ffffff;">
            <p>Dear ${data.fullName},</p>
            <p>Great news! Your book <strong>${data.bookTitle}</strong> has been approved and published on Treasures Unveiler.</p>
            ${data.tempPassword ? `
            <div style="background-color: #fffcf8; padding: 20px; border-radius: 6px; border-left: 4px solid #ee0303; margin: 20px 0;">
              <p style="margin-top:0;"><strong>Your Author Account has been created:</strong></p>
              <p>Email: ${data.email}</p>
              <p>Password: ${data.tempPassword}</p>
              <p><em>Please log in and change your password as soon as possible.</em></p>
            </div>
            ` : `<p>You can now log in to your Author Dashboard to view your book and track your sales.</p>`}
            <p style="text-align: center; margin-top: 30px;">
              <a href="${data.loginUrl}" style="background-color: #ee0303; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600;">Log in to Author Dashboard</a>
            </p>
          </div>
          <div style="background-color: #f9fafb; padding: 20px; text-align: center; font-size: 12px; color: #9ca3af; border-top: 1px solid #e5e7eb;">
            &copy; ${new Date().getFullYear()} Spiritans Sound
          </div>
        </div>
      `,
		});
		if (error) console.error("❌ Failed to send book approval email:", error.message);
	} catch (error) {
		console.error("❌ Failed to send book approval email:", error);
	}
}

export async function sendPreorderConfirmationEmail(data: PurchaseEmailData): Promise<boolean> {
	try {
		const html = `
        <div style="font-family: 'Montserrat', sans-serif; color: #2d3436; max-width: 600px; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden;">
          <div style="background-color: #f59e0b; padding: 20px; text-align: center;">
            <h2 style="color: #ffffff; margin: 0; font-family: 'Playfair Display', serif;">Pre-order Confirmed!</h2>
          </div>
          <div style="padding: 30px; background-color: #ffffff;">
            <p>Dear ${data.buyerName},</p>
            <p>Thank you for pre-ordering <strong>${data.itemTitle}</strong> from Spiritans Sound.</p>
            <p>Your payment of <strong>${data.currency} ${data.amount}</strong> was successfully received.</p>
            
            <div style="background-color: #fffcf8; padding: 20px; border-radius: 6px; border-left: 4px solid #f59e0b; margin: 20px 0;">
              <p style="margin-top:0;"><strong>What happens next?</strong></p>
              <p>Your copy is now reserved. As soon as the book is officially released, you will receive another email containing your secure download link.</p>
            </div>
            
            <p style="text-align: center; margin-top: 30px; font-size: 14px; color: #6b7280;">
              Reference: ${data.transactionReference} <br/> Date: ${data.date}
            </p>
          </div>
          <div style="background-color: #f9fafb; padding: 20px; text-align: center; font-size: 12px; color: #9ca3af; border-top: 1px solid #e5e7eb;">
            &copy; ${new Date().getFullYear()} Spiritans Sound
          </div>
        </div>
      `;

		const { error } = await getResend().emails.send({
			from: getFrom(),
			to: data.to,
			subject: `Pre-order Confirmed: ${data.itemTitle}`,
			html,
		});

		if (error) {
			console.error("❌ Failed to send pre-order confirmation email:", error.message || error);
			return false;
		}

		console.log(`✅ Pre-order confirmation email sent to ${data.to}`);
		return true;
	} catch (error) {
		console.error("❌ Failed to send pre-order confirmation email:", error);
		return false;
	}
}


export async function sendPayoutRequestAdminNotification(data: { authorName: string; amount: number; authorEmail: string }) {
	try {
		const { error } = await getResend().emails.send({
			from: getFrom(),
			to: process.env.ADMIN_EMAIL || process.env.SMTP_FROM_EMAIL || "admin@example.com",
			subject: `💰 New Payout Request: ₦${data.amount.toLocaleString()} from ${data.authorName}`,
			html: `
        <div style="font-family: 'Montserrat', sans-serif; color: #2d3436; max-width: 600px; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden;">
          <div style="background-color: #ee0303; padding: 20px; text-align: center;">
            <h2 style="color: #ffffff; margin: 0; font-family: 'Playfair Display', serif;">New Payout Request</h2>
          </div>
          <div style="padding: 30px; background-color: #ffffff;">
            <p style="margin-bottom: 20px;">An author has requested a payout.</p>
            <div style="background-color: #fffcf8; padding: 20px; border-radius: 6px; border-left: 4px solid #ee0303;">
              <p><strong>Author:</strong> ${data.authorName}</p>
              <p><strong>Email:</strong> ${data.authorEmail}</p>
              <p><strong>Requested Amount:</strong> ₦${data.amount.toLocaleString()}</p>
              <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
            </div>
            <p style="margin-top: 20px;">Please log in to the admin dashboard to review and process this payout.</p>
          </div>
          <div style="background-color: #f9fafb; padding: 20px; text-align: center; font-size: 12px; color: #9ca3af; border-top: 1px solid #e5e7eb;">
            &copy; ${new Date().getFullYear()} Spiritans Sound
          </div>
        </div>
      `,
		});

		if (error) {
			console.error("❌ Failed to send payout request admin notification:", error.message || error);
		} else {
			console.log("✅ Admin notified of payout request");
		}
	} catch (error) {
		console.error("❌ Failed to send payout request admin notification:", error);
	}
}
