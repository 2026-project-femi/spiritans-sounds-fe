// app/api/paystack/webhook/route.ts
import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import crypto from "crypto";
import { 
  sendAdminNotification, 
  sendThankYouEmail, 
  sendFailedChargeNotification
} from "@/lib/emails/sendEmail";
import { completePurchase } from "@/lib/payments/completePurchase";
import { getPayload } from 'payload';
import configPromise from '@/payload.config';


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
        const headersList = await headers();
        const signature = headersList.get("x-paystack-signature");
        const rawBody = await request.text();

        if (!signature) {
            console.error("❌ No signature header");
            return NextResponse.json({ error: "No signature provided" }, { status: 401 });
        }

        const isValid = verifyPaystackSignature(rawBody, signature, process.env.PAYSTACK_WEBHOOK_SECRET!);
        if (!isValid) {
            console.error("❌ Invalid signature");
            return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
        }

        const payload = JSON.parse(rawBody);

        console.log("📬 Webhook received:", {
            event: payload.event,
            reference: payload.data?.reference,
        });

        // Initialize Payload CMS instance inside the handler
        const payloadCms = await getPayload({ config: configPromise });

        switch (payload.event) {
            case "charge.success":
                if ((payload.data?.reference as string)?.startsWith("PUR-")) {
                    await handleSuccessfulPurchase(payload.data, payloadCms);
                } else {
                    await handleSuccessfulCharge(payload.data, payloadCms);
                }
                break;
            case "charge.failed":
                await handleFailedCharge(payload.data);
                break;
            default:
                console.log(`ℹ️ Unhandled event: ${payload.event}`);
        }

        return NextResponse.json({ received: true }, { status: 200 });
    } catch (error) {
        console.error("❌ Webhook error:", error);
        return NextResponse.json({ received: true }, { status: 200 });
    }
}

async function handleSuccessfulCharge(data: any, payloadCms: any) {
    try {
        const { reference, amount, currency, paid_at, customer, metadata } = data;

        // Deduplication using Payload CMS
        const existingDonation = await payloadCms.find({
            collection: 'donations',
            where: { reference: { equals: reference } },
            limit: 1,
        });

        if (existingDonation.totalDocs > 0) {
            console.log(`⏭️ Donation ${reference} already processed, skipping`);
            return;
        }
        const email = customer.email;
        const donorName = metadata?.name || customer.first_name || customer.last_name || email.split("@")[0] || "Beloved Donor";

        const formattedAmount = amount / 100;
        const formattedDate = new Date(paid_at).toLocaleDateString("en-US", {
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
                message: metadata?.message,
                paidAt: new Date(paid_at).toISOString(),
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
                    message: metadata?.message,
                });
                if (emailSent) break;
            } catch (emailError) {
                console.error(`Email attempt failed:`, emailError);
            }
            retries--;
            if (retries > 0) await new Promise((resolve) => setTimeout(resolve, 2000));
        }

        if (formattedAmount >= 50000) {
            try {
                await sendAdminNotification({ ...data, formattedAmount, donorName });
            } catch (adminError) {
                console.error("Failed to send admin notification:", adminError);
            }
        }

        if (emailSent) {
            console.log(`✅ Successfully processed donation ${reference}`);
        } else {
            console.error(`❌ Failed to send email for donation ${reference} after 3 retries`);
        }
    } catch (error) {
        console.error("❌ Error in handleSuccessfulCharge:", error);
    }
}

async function handleSuccessfulPurchase(data: any, payloadCms: any) {
    const { reference, amount, currency, paid_at, customer, metadata } = data;
    const email = customer.email;
    const buyerName = metadata?.name || metadata?.buyer_name || customer.first_name || email.split("@")[0] || "Valued Customer";

    const orderId = metadata?.orderId;
    if (!orderId) {
        console.error(`❌ No orderId in metadata for purchase ${reference}`);
        return;
    }

    const formattedAmount = amount / 100;
    const formattedDate = new Date(paid_at).toLocaleDateString("en-NG", {
        year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit",
    });
    const paymentProcessingFee = (data.fees || 0) / 100;

    await completePurchase({
        payloadCms,
        orderId,
        reference,
        formattedAmount,
        currency,
        paymentProcessingFee,
        formattedDate,
        buyerName,
        fallbackEmail: email,
    });
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

export async function GET() {
    return NextResponse.json({
        message: "Paystack webhook endpoint is active",
        emailProvider: "Resend",
        status: "ready",
    });
}
