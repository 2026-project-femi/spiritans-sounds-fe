// lib/emails/sendEmail.ts
import * as React from "react";
import { Resend } from "resend";
import { render } from "@react-email/render";
import { ThankYouEmailTemplate } from "./ThankYouEmailPops";

const resend = new Resend(process.env.RESEND_API_KEY);

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
		const emailHtml = await render(
			React.createElement(ThankYouEmailTemplate, {
				donorName: data.donorName,
				amount: data.amount,
				currency: data.currency,
				transactionReference: data.transactionReference,
				date: data.date,
				message: data.message,
			}),
		);

		const { error } = await resend.emails.send({
			from: `${process.env.SMTP_FROM_NAME || "Spiritans Sounds"} <${process.env.SMTP_FROM_EMAIL}>`,
			to: data.to,
			subject: data.subject,
			html: emailHtml,
		});

		if (error) {
			console.error("❌ Failed to send thank you email:", error);
			return false;
		}

		console.log(`✅ Thank you email sent to ${data.to}`);
		return true;
	} catch (error) {
		console.error("❌ Failed to send email:", error);
		return false;
	}
}

export async function sendAdminNotification(donation: any) {
	try {
		const { error } = await resend.emails.send({
			from: `${process.env.SMTP_FROM_NAME || "Spiritans Sounds"} <${process.env.SMTP_FROM_EMAIL}>`,
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
			console.error("❌ Failed to send admin notification:", error);
		} else {
			console.log("✅ Admin notification sent");
		}
	} catch (error) {
		console.error("❌ Failed to send admin notification:", error);
	}
}
