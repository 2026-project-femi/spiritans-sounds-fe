// app/api/paystack/webhook/route.ts
import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import crypto from "crypto";
import nodemailer from "nodemailer";
import { sendAdminNotification, sendThankYouEmail } from "@/lib/emails/sendEmail";

// In-memory store to prevent duplicate processing (replace with Redis/database in production)
const processedTransactions = new Set<string>();

// Clean up processed transactions every hour
setInterval(
	() => {
		processedTransactions.clear();
		console.log("🧹 Cleared processed transactions cache");
	},
	60 * 60 * 1000,
);

// Verify Paystack signature
function verifyPaystackSignature(payload: string, signature: string, secret: string): boolean {
	try {
		const hash = crypto.createHmac("sha512", secret).update(payload).digest("hex");
		return crypto.timingSafeEqual(Buffer.from(hash), Buffer.from(signature));
	} catch (error) {
		console.error("Signature verification error:", error);
		return false;
	}
}

export async function POST(request: NextRequest) {
	try {
		// ✅ FIX: Await headers()
		const headersList = await headers();
		const signature = headersList.get("x-paystack-signature");

		// Get raw body
		const rawBody = await request.text();

		// Verify signature exists
		if (!signature) {
			console.error("❌ No signature header");
			return NextResponse.json({ error: "No signature provided" }, { status: 401 });
		}

		// Verify signature validity
		const isValid = verifyPaystackSignature(rawBody, signature, process.env.PAYSTACK_WEBHOOK_SECRET!);

		if (!isValid) {
			console.error("❌ Invalid signature");
			return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
		}

		// Parse payload
		const payload = JSON.parse(rawBody);

		console.log("📬 Webhook received:", {
			event: payload.event,
			reference: payload.data?.reference,
		});

		// Handle different events
		switch (payload.event) {
			case "charge.success":
				await handleSuccessfulCharge(payload.data);
				break;
			case "charge.failed":
				await handleFailedCharge(payload.data);
				break;
			default:
				console.log(`ℹ️ Unhandled event: ${payload.event}`);
		}

		// Always return 200 to acknowledge receipt
		return NextResponse.json({ received: true }, { status: 200 });
	} catch (error) {
		console.error("❌ Webhook error:", error);
		// IMPORTANT: Return 200 even on error to prevent Paystack from retrying
		// if we've already logged the error
		return NextResponse.json({ received: true }, { status: 200 });
	}
}

async function handleSuccessfulCharge(data: any) {
	// Prevent duplicate processing
	if (processedTransactions.has(data.reference)) {
		console.log(`⏭️ Transaction ${data.reference} already processed, skipping`);
		return;
	}

	try {
		const { reference, amount, currency, paid_at, customer, metadata } = data;

		const email = customer.email;
		const donorName = metadata?.name || customer.first_name || customer.last_name || email.split("@")[0] || "Beloved Donor";

		const formattedAmount = amount / 100;
		const formattedDate = new Date(paid_at).toLocaleDateString("en-US", {
			year: "numeric",
			month: "long",
			day: "numeric",
			hour: "2-digit",
			minute: "2-digit",
		});

		console.log("💵 Processing donation:", {
			reference,
			amount: formattedAmount,
			currency,
			donor: email,
		});

		// TODO: Save to database here
		// await prisma.donation.create({ ... })

		// Send thank you email with retry logic
		let emailSent = false;
		let retries = 3;

		while (!emailSent && retries > 0) {
			try {
				emailSent = await sendThankYouEmail({
					to: email,
					subject: `🙏 Thank You for Your Generous Gift of ${currency} ${formattedAmount.toLocaleString()}`,
					donorName,
					amount: formattedAmount,
					currency,
					transactionReference: reference,
					date: formattedDate,
					message: metadata?.message,
				});

				if (emailSent) break;
			} catch (emailError) {
				console.error(`Email attempt failed:`, emailError);
			}

			retries--;
			if (retries > 0) {
				console.log(`⏳ Retrying email... (${retries} attempts left)`);
				await new Promise((resolve) => setTimeout(resolve, 2000));
			}
		}

		// Send admin notification for large donations (> ₦50,000)
		if (formattedAmount >= 50000) {
			try {
				await sendAdminNotification({
					...data,
					formattedAmount,
					donorName,
				});
			} catch (adminError) {
				console.error("Failed to send admin notification:", adminError);
			}
		}

		// Mark as processed
		processedTransactions.add(reference);

		// Log result
		if (emailSent) {
			console.log(`✅ Successfully processed donation ${reference}`);
		} else {
			console.error(`❌ Failed to send email for donation ${reference} after 3 retries`);
		}
	} catch (error) {
		console.error("❌ Error in handleSuccessfulCharge:", error);
		// Don't throw - we want to return 200 to Paystack
		// But transaction won't be marked as processed, so webhook will retry
	}
}

async function handleFailedCharge(data: any) {
	console.log("⚠️ Failed charge:", {
		reference: data.reference,
		email: data.customer?.email,
		amount: data.amount / 100,
		currency: data.currency,
	});

	// Notify admin about failed payment if configured
	if (process.env.ADMIN_EMAIL) {
		try {
			const transporter = nodemailer.createTransport({
				host: process.env.SMTP_HOST,
				port: Number(process.env.SMTP_PORT),
				secure: process.env.SMTP_SECURE === "true",
				auth: {
					user: process.env.SMTP_USER,
					pass: process.env.SMTP_PASS,
				},
			});

			await transporter.sendMail({
				from: `"${process.env.SMTP_FROM_NAME}" <${process.env.SMTP_FROM_EMAIL}>`,
				to: process.env.ADMIN_EMAIL,
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

			console.log("✅ Admin notified of failed charge");
		} catch (error) {
			console.error("❌ Failed to send admin notification:", error);
		}
	}
}

// Optional: GET endpoint for testing
export async function GET() {
	return NextResponse.json({
		message: "Paystack webhook endpoint is active",
		emailProvider: "Gmail via Nodemailer",
		status: "ready",
		processedTransactions: processedTransactions.size,
	});
}
