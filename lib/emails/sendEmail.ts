// lib/email/sendEmail.ts
import * as React from "react";
import nodemailer from "nodemailer";
import { render } from "@react-email/render";
import { ThankYouEmailTemplate } from "./ThankYouEmailPops";

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

// Create reusable transporter
let transporter: nodemailer.Transporter | null = null;

function getTransporter(): nodemailer.Transporter {
	if (transporter) return transporter;

	transporter = nodemailer.createTransport({
		host: process.env.SMTP_HOST,
		port: Number(process.env.SMTP_PORT),
		secure: process.env.SMTP_SECURE === "true", // false for 587, true for 465
		auth: {
			user: process.env.SMTP_USER,
			pass: process.env.SMTP_PASS,
		},
		// Gmail specific options
		pool: true, // Use pooled connections
		maxConnections: 5,
		maxMessages: 100,
		rateDelta: 1000, // Rate limiting to avoid Gmail flags
		rateLimit: 5, // Max 5 emails per second
	});

	// Verify connection configuration
	transporter.verify((error, success) => {
		if (error) {
			console.error("❌ SMTP connection error:", error);
		} else {
			console.log("✅ SMTP server is ready to send emails");
		}
	});

	return transporter;
}

export async function sendThankYouEmail(data: EmailData): Promise<boolean> {
	try {
		const startTime = Date.now();

		// Render the React email template to HTML
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

		const mailOptions = {
			from: `"${process.env.SMTP_FROM_NAME}" <${process.env.SMTP_FROM_EMAIL}>`,
			to: data.to,
			subject: data.subject,
			html: emailHtml,
			// Optional: Add plain text version
			text: `
        Dear ${data.donorName},
        
        Thank you for your generous gift of ${data.currency} ${data.amount.toLocaleString()}!
        
        Transaction Reference: ${data.transactionReference}
        Date: ${data.date}
        
        "Each one must give as he has decided in his heart, not reluctantly or under compulsion, 
        for God loves a cheerful giver." — 2 Corinthians 9:7
        
        Your generosity helps us spread the Gospel to thousands worldwide.
        
        May God bless you abundantly,
        ${process.env.SMTP_FROM_NAME}
      `,
			// Add important headers for better deliverability
			headers: {
				"X-Priority": "1", // High priority
				"X-MSMail-Priority": "High",
				Importance: "high",
				"List-Unsubscribe": `<${process.env.APP_URL}/unsubscribe?email=${encodeURIComponent(data.to)}>`,
			},
		};

		const transporter = getTransporter();
		const info = await transporter.sendMail(mailOptions);

		const duration = Date.now() - startTime;
		console.log(`✅ Thank you email sent to ${data.to} in ${duration}ms`);
		console.log("📧 Message ID:", info.messageId);

		return true;
	} catch (error) {
		console.error("❌ Failed to send email:", error);

		// Log detailed error for debugging
		if (error instanceof Error) {
			console.error("Error name:", error.name);
			console.error("Error message:", error.message);
			console.error("Error stack:", error.stack);
		}

		return false;
	}
}

// Optional: Send admin notification for large donations
export async function sendAdminNotification(donation: any) {
	try {
		const transporter = getTransporter();

		const mailOptions = {
			from: `"${process.env.SMTP_FROM_NAME}" <${process.env.SMTP_FROM_EMAIL}>`,
			to: process.env.ADMIN_EMAIL,
			subject: `🎉 New Donation Received: ${donation.currency} ${donation.amount / 100}`,
			html: `
        <h2>New Donation Received</h2>
        <p><strong>Donor:</strong> ${donation.metadata?.name || donation.customer.email}</p>
        <p><strong>Email:</strong> ${donation.customer.email}</p>
        <p><strong>Amount:</strong> ${donation.currency} ${donation.amount / 100}</p>
        <p><strong>Reference:</strong> ${donation.reference}</p>
        <p><strong>Date:</strong> ${new Date(donation.paid_at).toLocaleString()}</p>
        <p><a href="https://dashboard.paystack.com/#/transactions/${donation.id}">View in Dashboard</a></p>
      `,
		};

		await transporter.sendMail(mailOptions);
		console.log("✅ Admin notification sent");
	} catch (error) {
		console.error("❌ Failed to send admin notification:", error);
	}
}
