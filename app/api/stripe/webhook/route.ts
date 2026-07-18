// app/api/stripe/webhook/route.ts
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { 
  sendAdminNotification, 
  sendThankYouEmail, 
  sendPurchaseConfirmationEmail, 
  sendFailedChargeNotification 
} from "@/lib/emails/sendEmail";
import { getPayload } from 'payload';
import configPromise from '@/payload.config';
import { Redis } from "@upstash/redis";

const stripe = process.env.STRIPE_SECRET_KEY 
  ? new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: "2026-06-24.dahlia" }) 
  : null;

// Redis-backed deduplication
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

export async function POST(request: NextRequest) {
    if (!stripe) {
        console.error("❌ Stripe is not configured.");
        return NextResponse.json({ error: "Stripe not configured" }, { status: 500 });
    }

    try {
        const signature = request.headers.get("stripe-signature");
        const rawBody = await request.text();

        if (!signature || !process.env.STRIPE_WEBHOOK_SECRET) {
            console.error("❌ No signature or webhook secret");
            return NextResponse.json({ error: "Missing configuration or signature" }, { status: 400 });
        }

        let event: Stripe.Event;

        try {
            event = stripe.webhooks.constructEvent(rawBody, signature, process.env.STRIPE_WEBHOOK_SECRET);
        } catch (err: any) {
            console.error(`❌ Webhook signature verification failed: ${err.message}`);
            return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
        }

        console.log("📬 Stripe Webhook received:", {
            event: event.type,
            id: event.id,
        });

        // Initialize Payload CMS instance inside the handler
        const payloadCms = await getPayload({ config: configPromise });

        switch (event.type) {
            case "checkout.session.completed": {
                const session = event.data.object as Stripe.Checkout.Session;
                
                // Route based on metadata type
                if (session.metadata?.type === "purchase") {
                    await handleSuccessfulPurchase(session, payloadCms);
                } else if (session.metadata?.type === "donation") {
                    await handleSuccessfulCharge(session, payloadCms);
                }
                break;
            }
            case "checkout.session.async_payment_failed":
            case "payment_intent.payment_failed": {
                const session = event.data.object as Stripe.Checkout.Session | Stripe.PaymentIntent;
                await handleFailedCharge(session);
                break;
            }
            default:
                console.log(`ℹ️ Unhandled event type: ${event.type}`);
        }

        return NextResponse.json({ received: true }, { status: 200 });
    } catch (error) {
        console.error("❌ Webhook processing error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

async function handleSuccessfulCharge(session: Stripe.Checkout.Session, payloadCms: any) {
    const reference = session.id;

    if (await isAlreadyProcessed(reference)) {
        console.log(`⏭️ Transaction ${reference} already processed, skipping`);
        return;
    }

    try {
        const metadata = session.metadata || {};
        const email = session.customer_details?.email || session.customer_email || "unknown@donor.com";
        const donorName = metadata.donor_name || session.customer_details?.name || email.split("@")[0] || "Beloved Donor";
        const currency = (session.currency || "USD").toUpperCase();
        const amountSubunits = session.amount_total || 0;
        const formattedAmount = amountSubunits / 100;
        
        const paid_at = new Date();
        const formattedDate = paid_at.toLocaleDateString("en-US", {
            year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit",
        });

        console.log("💵 Processing donation:", { reference, amount: formattedAmount, currency, donor: email });

        // Save donation directly into a Payload 'donations' collection
        await payloadCms.create({
            collection: 'donations',
            data: {
                reference,
                amount: formattedAmount,
                currency,
                donorEmail: email,
                donorName,
                paidAt: paid_at.toISOString(),
            },
        });

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
                });
                if (emailSent) break;
            } catch (emailError) {
                console.error(`Email attempt failed:`, emailError);
            }
            retries--;
            if (retries > 0) await new Promise((resolve) => setTimeout(resolve, 2000));
        }

        if (formattedAmount >= 500) { // e.g. 500 USD/GBP
            try {
                await sendAdminNotification({ 
                  event: "checkout.session.completed", 
                  data: session, 
                  formattedAmount, 
                  donorName 
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
    }
}

async function handleSuccessfulPurchase(session: Stripe.Checkout.Session, payloadCms: any) {
    const reference = session.id;

    if (await isAlreadyProcessed(reference)) {
        console.log(`⏭️ Purchase ${reference} already processed, skipping`);
        return;
    }

    try {
        const metadata = session.metadata || {};
        const email = session.customer_details?.email || session.customer_email || "unknown@customer.com";
        const buyerName = metadata.buyer_name || session.customer_details?.name || email.split("@")[0] || "Valued Customer";
        
        const currency = (session.currency || "USD").toUpperCase();
        const amountSubunits = session.amount_total || 0;
        const formattedAmount = amountSubunits / 100;
        const paid_at = new Date();

        const orderId = metadata.orderId;
        if (!orderId) {
            console.error(`❌ No orderId in metadata for purchase ${reference}`);
            return;
        }

        // 1. Fetch Order and populate the item relation fields inside Payload
        const order = await payloadCms.findByID({
            collection: 'orders',
            id: orderId,
            depth: 2,
        });

        if (!order) {
            console.error(`❌ Order not found: ${orderId}`);
            return;
        }

        // 2. Safely parse file URL from populated media document
        const firstItem = order.items?.[0];
        const item = firstItem?.value || firstItem;
        const fileDoc = item?.file; 

        if (!fileDoc || !fileDoc.url) {
            console.error(`❌ Item or file URL not found for order ${orderId}`);
            return;
        }

        // 3. Mark order as completed via local API update method
        await payloadCms.update({
            collection: 'orders',
            id: orderId,
            data: {
                status: 'completed',
            },
        });
        console.log(`✅ Order ${orderId} marked completed`);

        // 4. Send download email
        const formattedDate = paid_at.toLocaleDateString("en-US", {
            year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit",
        });
        
        const downloadUrl = `${fileDoc.url}?dl=${encodeURIComponent((item.title ?? "download") + ".pdf")}`;

        let emailSent = false;
        let retries = 3;

        while (!emailSent && retries > 0) {
            try {
                emailSent = await sendPurchaseConfirmationEmail({
                    to: order.customerEmail || email,
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
            if (retries > 0) await new Promise((resolve) => setTimeout(resolve, 2000));
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

async function handleFailedCharge(sessionOrIntent: any) {
    console.log("⚠️ Failed Stripe charge:", {
        id: sessionOrIntent.id,
        email: sessionOrIntent.customer_email || sessionOrIntent.customer_details?.email,
    });

    if (process.env.ADMIN_EMAIL) {
        await sendFailedChargeNotification({ reference: sessionOrIntent.id, ...sessionOrIntent });
    }
}

export async function GET() {
    return NextResponse.json({
        message: "Stripe webhook endpoint is active",
        status: "ready",
        processedTransactions: localProcessedTransactions.size,
    });
}