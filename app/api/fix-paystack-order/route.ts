import { NextResponse } from "next/server";
import { getPayload } from 'payload';
import configPromise from '@/payload.config';
import { sendPurchaseConfirmationEmail } from '@/lib/emails/sendEmail';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const secret = url.searchParams.get("secret");
  const reference = url.searchParams.get("reference");

  // Simple security check so random people don't run this
  if (secret !== "fix123") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!reference) {
    return NextResponse.json({ error: "Missing reference parameter in URL" }, { status: 400 });
  }

  try {
    // 1. Verify transaction on Paystack
    const response = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`
      }
    });
    
    const paystackData = await response.json();
    
    if (!paystackData.status || paystackData.data.status !== "success") {
      return NextResponse.json({ error: "Transaction not found or not successful on Paystack" }, { status: 400 });
    }

    const data = paystackData.data;
    const { amount, currency, paid_at, customer, metadata } = data;

    const email = customer.email;
    const buyerName = metadata?.name || metadata?.buyer_name || customer.first_name || email.split("@")[0] || "Valued Customer";

    const orderId = metadata?.orderId;
    if (!orderId) {
       return NextResponse.json({ error: `No orderId in metadata for purchase ${reference}` }, { status: 400 });
    }

    const payloadCms = await getPayload({ config: configPromise });

    // 2. Fetch Order and populate the item relation fields inside Payload
    const order = await payloadCms.findByID({
        collection: 'orders',
        id: orderId,
        depth: 2,
    });

    if (!order) {
        return NextResponse.json({ error: `Order not found: ${orderId}` }, { status: 404 });
    }

    if (order.status === 'completed') {
        return NextResponse.json({ message: "Order is already marked as completed. Skipping update." });
    }

    // 3. Safely parse file URL from populated media document
    const firstItem = order.items?.[0];
    const item = (firstItem?.value || firstItem) as any; 
    const fileDoc = item?.file; 
    
    if (!fileDoc || !fileDoc.url) {
        return NextResponse.json({ error: `Item or file URL not found for order ${orderId}` }, { status: 400 });
    }

    // 4. Mark order as completed
    await payloadCms.update({
        collection: 'orders',
        id: orderId,
        data: {
            status: 'completed',
        },
    });

    // 5. Send download email
    const formattedAmount = amount / 100;
    const formattedDate = new Date(paid_at).toLocaleDateString("en-NG", {
        year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit",
    });
    
    const downloadUrl = `${fileDoc.url}?dl=${encodeURIComponent((item.title ?? "download") + ".pdf")}`;

    const emailSent = await sendPurchaseConfirmationEmail({
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

    return NextResponse.json({ 
      success: true, 
      message: "Order fixed and email sent!", 
      email: order.customerEmail || email,
      emailSent 
    });

  } catch (error: any) {
    console.error("Fix script error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
