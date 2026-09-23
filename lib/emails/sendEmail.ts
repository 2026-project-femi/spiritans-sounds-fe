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

// ── Book Launch Registration Confirmation ────────────────────────────────────

export interface BookLaunchEmailData {
	to: string;
	fullName: string;
	bookTitle: string;
	meetingLink?: string;
	meetingPlatform?: string;
	meetingPasscode?: string;
	eventDate?: string;
	customNote?: string;
}

export async function sendBookLaunchConfirmationEmail(data: BookLaunchEmailData): Promise<boolean> {
	try {
		const hasMeetingLink = Boolean(data.meetingLink && data.meetingLink.trim());
		const platform = data.meetingPlatform || "Online";
		const eventDate = data.eventDate || "Saturday, 21 November 2026 at 5:00 PM (WAT) / 4:00 PM (GMT)";

		const html = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1f2937; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden; background-color: #ffffff;">
        <!-- Header Banner -->
        <div style="background: linear-gradient(135deg, #18181b 0%, #09090b 100%); padding: 32px 24px; text-align: center; border-bottom: 3px solid #ee0303;">
          <p style="color: #ee0303; text-transform: uppercase; font-size: 11px; font-weight: 800; letter-spacing: 0.15em; margin: 0 0 8px 0;">Spiritans Sound · Online Event</p>
          <h1 style="color: #ffffff; font-size: 24px; font-weight: 700; margin: 0; line-height: 1.3;">Launch Registration Confirmed 🎉</h1>
          <p style="color: #a1a1aa; font-size: 14px; margin: 8px 0 0 0;">You're officially on the guest list for <strong>${data.bookTitle}</strong></p>
        </div>

        <!-- Body Content -->
        <div style="padding: 32px 24px; background-color: #ffffff;">
          <p style="font-size: 16px; line-height: 1.6; margin: 0 0 16px 0;">Dear <strong>${data.fullName}</strong>,</p>
          <p style="font-size: 15px; line-height: 1.6; color: #4b5563; margin: 0 0 24px 0;">
            Thank you for registering to attend the official online launch of <em>${data.bookTitle}</em>. We are delighted to have you join us for this special unveiling.
          </p>

          <!-- Event Details Card -->
          <div style="background-color: #fafafa; border: 1px solid #e5e7eb; border-radius: 10px; padding: 20px; margin-bottom: 28px;">
            <h3 style="font-size: 13px; text-transform: uppercase; letter-spacing: 0.1em; color: #9ca3af; margin: 0 0 16px 0; font-weight: 700;">Event Details</h3>
            
            <div style="margin-bottom: 12px; display: flex; align-items: baseline;">
              <span style="font-weight: 600; color: #374151; min-width: 110px; font-size: 14px;">📖 Book:</span>
              <span style="color: #111827; font-size: 14px; font-weight: 600;">${data.bookTitle}</span>
            </div>

            <div style="margin-bottom: 12px; display: flex; align-items: baseline;">
              <span style="font-weight: 600; color: #374151; min-width: 110px; font-size: 14px;">📅 Date & Time:</span>
              <span style="color: #111827; font-size: 14px;">${eventDate}</span>
            </div>

            <div style="margin-bottom: 12px; display: flex; align-items: baseline;">
              <span style="font-weight: 600; color: #374151; min-width: 110px; font-size: 14px;">💻 Platform:</span>
              <span style="color: #111827; font-size: 14px;">${platform}</span>
            </div>

            ${data.meetingPasscode ? `
            <div style="margin-bottom: 4px; display: flex; align-items: baseline;">
              <span style="font-weight: 600; color: #374151; min-width: 110px; font-size: 14px;">🔑 Passcode:</span>
              <span style="color: #111827; font-size: 14px; font-family: monospace; font-weight: 700;">${data.meetingPasscode}</span>
            </div>
            ` : ""}
          </div>

          <!-- Meeting Link Section -->
          ${hasMeetingLink ? `
            <div style="text-align: center; margin: 32px 0; padding: 24px; background: #fff5f5; border: 1px solid #fed7d7; border-radius: 12px;">
              <h4 style="margin: 0 0 8px 0; color: #991b1b; font-size: 16px; font-weight: 700;">Your Online Meeting Link is Ready</h4>
              <p style="margin: 0 0 20px 0; color: #4b5563; font-size: 14px;">Click the button below at event time to access the broadcast directly:</p>
              <a href="${data.meetingLink}" target="_blank" rel="noopener noreferrer"
                 style="display: inline-block; background-color: #ee0303; color: #ffffff; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: 700; font-size: 15px; box-shadow: 0 4px 12px rgba(238, 3, 3, 0.25);">
                Join Online Launch Meeting →
              </a>
              <p style="margin: 16px 0 0 0; font-size: 12px; color: #6b7280; word-break: break-all;">
                Or open URL: <a href="${data.meetingLink}" style="color: #ee0303;">${data.meetingLink}</a>
              </p>
            </div>
          ` : `
            <div style="background-color: #eff6ff; border: 1px solid #bfdbfe; border-left: 4px solid #3b82f6; border-radius: 8px; padding: 16px; margin: 24px 0;">
              <p style="margin: 0 0 6px 0; font-weight: 700; color: #1e40af; font-size: 14px;">📍 Link Access Notice</p>
              <p style="margin: 0; color: #1e3a8a; font-size: 13px; line-height: 1.5;">
                The official stream link is currently being finalized. Your place is securely reserved, and we will email you the direct joining link prior to the event.
              </p>
            </div>
          `}

          ${data.customNote ? `
            <div style="background-color: #f9fafb; border-left: 3px solid #6b7280; padding: 14px 18px; margin: 24px 0; font-size: 13px; color: #4b5563; font-style: italic;">
              ${data.customNote}
            </div>
          ` : ""}

          <p style="font-size: 14px; line-height: 1.6; color: #6b7280; margin: 24px 0 0 0;">
            We look forward to sharing this momentous launch with you. Please feel free to invite friends, colleagues, and family!
          </p>

          <p style="font-size: 14px; line-height: 1.6; color: #111827; margin: 16px 0 0 0;">
            Warm regards,<br />
            <strong>Spiritans Sound Editorial & Events Team</strong>
          </p>
        </div>

        <!-- Footer -->
        <div style="background-color: #f9fafb; padding: 20px; text-align: center; font-size: 12px; color: #9ca3af; border-top: 1px solid #e5e7eb;">
          &copy; ${new Date().getFullYear()} Spiritans Sound · Congregation of the Holy Spirit (Spiritans)<br />
          Treasures Unveiler Publishing
        </div>
      </div>
    `;

		const { error } = await getResend().emails.send({
			from: getFrom(),
			to: data.to,
			subject: `🎉 Registration Confirmed: ${data.bookTitle} Online Launch`,
			html,
		});

		if (error) {
			console.error("❌ Failed to send book launch confirmation email:", error.message || error);
			return false;
		}

		console.log(`✅ Book launch confirmation email sent to ${data.to}`);
		return true;
	} catch (error) {
		console.error("❌ Failed to send book launch confirmation email:", error);
		return false;
	}
}

// ── Paperback Physical Order Emails ─────────────────────────────────────────

export interface PaperbackEmailData {
	to: string;
	buyerName: string;
	itemTitle: string;
	amount: number;
	currency: string;
	transactionReference: string;
	shippingAddress: string;
	shippingCity?: string;
	shippingCountry?: string;
	shippingPhone?: string;
	date: string;
	isPreorder?: boolean;
}

export async function sendPaperbackConfirmationEmail(data: PaperbackEmailData): Promise<boolean> {
	try {
		const symbol = data.currency === "NGN" ? "₦" : data.currency === "GBP" ? "£" : "$";
		const html = `
      <div style="font-family: 'Montserrat', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #2d3436; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden; background: #ffffff;">
        <div style="background-color: #ee0303; padding: 28px 24px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-family: 'Playfair Display', serif; font-size: 24px; font-weight: 700;">
            📚 Paperback Order Confirmed!
          </h1>
          <p style="color: rgba(255,255,255,0.9); margin: 6px 0 0 0; font-size: 14px;">
            ${data.isPreorder ? "Pre-order reservation received" : "Your physical copy is being prepared"}
          </p>
        </div>

        <div style="padding: 32px 24px; background-color: #ffffff;">
          <p style="font-size: 15px; line-height: 1.6; margin: 0 0 16px 0;">
            Dear <strong>${data.buyerName}</strong>,
          </p>
          <p style="font-size: 15px; line-height: 1.6; margin: 0 0 24px 0; color: #4b5563;">
            Thank you for purchasing the paperback edition of <strong>${data.itemTitle}</strong>. We have received your payment and registered your delivery details.
          </p>

          <div style="background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; margin: 24px 0;">
            <h3 style="margin: 0 0 14px 0; font-size: 15px; color: #111827; border-bottom: 1px solid #e5e7eb; padding-bottom: 8px;">Order Details</h3>
            <p style="margin: 4px 0; font-size: 14px;"><strong>Book:</strong> ${data.itemTitle} (Paperback Edition)</p>
            <p style="margin: 4px 0; font-size: 14px;"><strong>Amount Paid:</strong> ${symbol}${data.amount.toLocaleString()} ${data.currency}</p>
            <p style="margin: 4px 0; font-size: 14px;"><strong>Reference:</strong> <span style="font-family: monospace;">${data.transactionReference}</span></p>
            <p style="margin: 4px 0; font-size: 14px;"><strong>Date:</strong> ${data.date}</p>
          </div>

          <div style="background-color: #fff9f5; border: 1px solid #fed7aa; border-left: 4px solid #f97316; border-radius: 8px; padding: 20px; margin: 24px 0;">
            <h3 style="margin: 0 0 10px 0; font-size: 15px; color: #9a3412;">📦 Delivery Address</h3>
            <p style="margin: 4px 0; font-size: 14px; color: #374151; white-space: pre-line;">${data.shippingAddress}</p>
            ${data.shippingCity ? `<p style="margin: 4px 0; font-size: 14px; color: #374151;"><strong>City/State:</strong> ${data.shippingCity}</p>` : ""}
            ${data.shippingCountry ? `<p style="margin: 4px 0; font-size: 14px; color: #374151;"><strong>Country:</strong> ${data.shippingCountry}</p>` : ""}
            ${data.shippingPhone ? `<p style="margin: 4px 0; font-size: 14px; color: #374151;"><strong>Phone:</strong> ${data.shippingPhone}</p>` : ""}
          </div>

          <p style="font-size: 14px; line-height: 1.6; color: #6b7280; margin: 24px 0 0 0;">
            ${data.isPreorder 
              ? "As a pre-order customer, your copy will be posted as soon as the book officially launches. We will send you dispatch updates." 
              : "Your book will be packaged and dispatched to the address above. If you need to make any changes to your delivery address, please reply directly to this email."}
          </p>

          <p style="font-size: 14px; line-height: 1.6; color: #111827; margin: 24px 0 0 0;">
            Warm regards,<br />
            <strong>Spiritans Sound Publishing Team</strong>
          </p>
        </div>

        <div style="background-color: #f9fafb; padding: 20px; text-align: center; font-size: 12px; color: #9ca3af; border-top: 1px solid #e5e7eb;">
          &copy; ${new Date().getFullYear()} Spiritans Sound · Congregation of the Holy Spirit (Spiritans)
        </div>
      </div>
    `;

		const { error } = await getResend().emails.send({
			from: getFrom(),
			to: data.to,
			subject: `📦 Paperback Order Confirmed: ${data.itemTitle}`,
			html,
		});

		if (error) {
			console.error("❌ Failed to send paperback confirmation email:", error.message || error);
			return false;
		}

		console.log(`✅ Paperback confirmation email sent to ${data.to}`);
		return true;
	} catch (error) {
		console.error("❌ Failed to send paperback confirmation email:", error);
		return false;
	}
}

export async function sendPaperbackAdminNotification(data: PaperbackEmailData): Promise<boolean> {
	try {
		const adminEmail = process.env.ADMIN_EMAIL || "info@spiritanssound.com";
		const symbol = data.currency === "NGN" ? "₦" : data.currency === "GBP" ? "£" : "$";
		const html = `
      <div style="font-family: 'Montserrat', sans-serif; color: #2d3436; max-width: 600px; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden;">
        <div style="background-color: #111827; padding: 20px; text-align: center;">
          <h2 style="color: #ffffff; margin: 0; font-size: 20px;">📦 New Paperback Order Requiring Dispatch</h2>
        </div>
        <div style="padding: 24px; background-color: #ffffff;">
          <p>A customer has successfully purchased a physical paperback copy on Spiritans Sound.</p>
          <div style="background-color: #f9fafb; padding: 16px; border-radius: 6px; border-left: 4px solid #ee0303; margin: 16px 0;">
            <p style="margin: 4px 0;"><strong>Customer Name:</strong> ${data.buyerName}</p>
            <p style="margin: 4px 0;"><strong>Customer Email:</strong> ${data.to}</p>
            <p style="margin: 4px 0;"><strong>Customer Phone:</strong> ${data.shippingPhone || "N/A"}</p>
            <p style="margin: 4px 0;"><strong>Book Title:</strong> ${data.itemTitle}</p>
            <p style="margin: 4px 0;"><strong>Amount Paid:</strong> ${symbol}${data.amount.toLocaleString()} ${data.currency}</p>
            <p style="margin: 4px 0;"><strong>Reference:</strong> ${data.transactionReference}</p>
            <p style="margin: 4px 0;"><strong>Date:</strong> ${data.date}</p>
          </div>
          <div style="background-color: #fff8f8; padding: 16px; border-radius: 6px; border: 1px solid #fee2e2;">
            <h4 style="margin: 0 0 8px 0; color: #991b1b;">Shipping Destination</h4>
            <p style="margin: 4px 0; white-space: pre-line;">${data.shippingAddress}</p>
            ${data.shippingCity ? `<p style="margin: 4px 0;">City: ${data.shippingCity}</p>` : ""}
            ${data.shippingCountry ? `<p style="margin: 4px 0;">Country: ${data.shippingCountry}</p>` : ""}
          </div>
        </div>
        <div style="background-color: #f9fafb; padding: 16px; text-align: center; font-size: 12px; color: #9ca3af;">
          Spiritans Sound Admin Alert
        </div>
      </div>
    `;

		await getResend().emails.send({
			from: getFrom(),
			to: adminEmail,
			subject: `🚨 New Paperback Order: ${data.itemTitle} (${data.buyerName})`,
			html,
		});

		console.log(`✅ Admin notified of paperback order ${data.transactionReference}`);
		return true;
	} catch (error) {
		console.error("❌ Failed to notify admin of paperback order:", error);
		return false;
	}
}

