// app/api/paystack/webhook/route.ts
import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import crypto from "crypto";
import { sendAdminNotification, sendThankYouEmail, sendPurchaseConfirmationEmail, sendFailedChargeNotification } from "@/lib/emails/sendEmail";
import { createClient } from "next-sanity";
import { apiVersion, dataset, projectId } from "@/sanity/env";
import { Redis } from "@upstash/redis";

const sanityClient = createClient({ projectId, dataset, apiVersion, useCdn: false, token: process.env.SANITY_API_TOKEN });

// Redis-backed deduplication (falls back to in-memory if Upstash is not configured)
const redis = process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
	? new Redis({ url: process.env.UPSTASH_REDIS_REST_URL, token: process.env.UPSTASH_REDIS_REST_TOKEN })
	: null;

const localProcessedTransactions = new Set<string>();

async function isAlreadyProcessed(reference: string): Promise<boolean> {
	if (redis) return (await redis.exists(`txn:${reference}`)) === 1;
	return localProcessedTransactions.has(reference);
}

async function markAsProcessed(reference: string): Promise<void> {
	if (redis) {
		await redis.set(`txn:${reference}`, "1", { ex: 86400 }); // 24h TTL
	} else {
		localProcessedTransactions.add(reference);
	}
}

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
				if ((payload.data?.reference as string)?.startsWith("PUR-")) {
					await handleSuccessfulPurchase(payload.data);
				} else {
					await handleSuccessfulCharge(payload.data);
				}
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
	if (await isAlreadyProcessed(data.reference)) {
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

		if (emailSent) {
			await markAsProcessed(reference);
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

async function handleSuccessfulPurchase(data: any) {
	if (await isAlreadyProcessed(data.reference)) {
		console.log(`⏭️ Purchase ${data.reference} already processed, skipping`);
		return;
	}

	try {
		const { reference, amount, currency, paid_at, customer, metadata } = data;

		const email = customer.email;
		const buyerName =
			metadata?.name || metadata?.buyer_name || customer.first_name || email.split("@")[0] || "Valued Customer";

		const orderId: string | undefined = metadata?.orderId;
		if (!orderId) {
			console.error(`❌ No orderId in metadata for purchase ${reference}`);
			return;
		}

		// 1. Fetch order to get itemType + item reference
		const order = await sanityClient.fetch(
			`*[_type == "order" && _id == $orderId][0]{ _id, itemType, buyerEmail, "itemRef": item._ref }`,
			{ orderId },
		);

		if (!order) {
			console.error(`❌ Order not found: ${orderId}`);
			return;
		}

		// 2. Fetch the purchased item to get file URL + title
		const item = await sanityClient.fetch(
			`*[_type == $itemType && _id == $itemRef][0]{ title, "fileUrl": file.asset->url }`,
			{ itemType: order.itemType, itemRef: order.itemRef },
		);

		if (!item?.fileUrl) {
			console.error(`❌ Item or file not found for order ${orderId}`);
			return;
		}

		// 3. Mark order as completed
		await sanityClient.patch(orderId).set({ status: "completed", completedAt: new Date().toISOString() }).commit();
		console.log(`✅ Order ${orderId} marked completed`);

		// 4. Send download email with retry logic
		const formattedAmount = amount / 100;
		const formattedDate = new Date(paid_at).toLocaleDateString("en-NG", {
			year: "numeric",
			month: "long",
			day: "numeric",
			hour: "2-digit",
			minute: "2-digit",
		});
		const downloadUrl = item?.fileUrl
			? `${item.fileUrl}?dl=${encodeURIComponent((item.title ?? "download") + ".pdf")}`
			: "";

		let emailSent = false;
		let retries = 3;

		while (!emailSent && retries > 0) {
			try {
				emailSent = await sendPurchaseConfirmationEmail({
					to: order.buyerEmail || email,
					subject: `Your Download is Ready — ${item?.title ?? "Purchase Confirmed"}`,
					buyerName,
					itemTitle: item?.title ?? "Your purchased item",
					downloadUrl,
					amount: formattedAmount,
					currency,
					transactionReference: reference,
					date: formattedDate,
				});
				if (emailSent) break;
			} catch (emailError) {
				console.error("Email attempt failed:", emailError);
			}

			retries--;
			if (retries > 0) {
				await new Promise((resolve) => setTimeout(resolve, 2000));
			}
		}

		if (emailSent) {
			await markAsProcessed(reference);
			console.log(`✅ Purchase confirmation + download link sent for ${reference}`);
		} else {
			console.error(`❌ Failed to send purchase email for ${reference} after 3 retries`);
		}
	} catch (error) {
		console.error("❌ Error in handleSuccessfulPurchase:", error);
	}
}

async function handleFailedCharge(data: any) {
	console.log("⚠️ Failed charge:", {
		reference: data.reference,
		email: data.customer?.email,
		amount: data.amount / 100,
		currency: data.currency,
	});

	if (process.env.ADMIN_EMAIL) {
		await sendFailedChargeNotification(data);
	}
}

// Optional: GET endpoint for testing
export async function GET() {
	return NextResponse.json({
		message: "Paystack webhook endpoint is active",
		emailProvider: "Resend",
		status: "ready",
		processedTransactions: localProcessedTransactions.size,
	});
}
