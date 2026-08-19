import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getPayload } from 'payload';
import configPromise from '@/payload.config';
import { sendPurchaseConfirmationEmail } from '@/lib/emails/sendEmail';

export async function GET(request: Request) {
  // Simple security check so random people don't run this
  const url = new URL(request.url);
  if (url.searchParams.get("secret") !== "fix123") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, { apiVersion: '2026-06-24.dahlia' as any });
    const chargeId = 'ch_3U5yHXLvANyw72eW1abDitw7';
    
    const charge = await stripe.charges.retrieve(chargeId);
    const paymentIntentId = charge.payment_intent as string;
    
    if (!paymentIntentId) {
      return NextResponse.json({ error: "Charge does not have a payment intent." }, { status: 400 });
    }
    
    const sessions = await stripe.checkout.sessions.list({ payment_intent: paymentIntentId });
    const session = sessions.data[0];
    
    if (!session) {
      return NextResponse.json({ error: "No checkout session found for this charge." }, { status: 404 });
    }
    
    const payloadCms = await getPayload({ config: configPromise });
    const orderId = session.metadata?.orderId;
    
    if (!orderId) {
      return NextResponse.json({ error: "No orderId found in session metadata." }, { status: 400 });
    }
    
    const order = await payloadCms.findByID({ collection: 'orders', id: orderId, depth: 2 });
    
    if (order.status === 'completed') {
      return NextResponse.json({ message: "Order is already marked as completed. Skipping update." });
    }
    
    await payloadCms.update({
      collection: 'orders',
      id: orderId,
      data: { status: 'completed' },
    });
    
    const firstItem = order.items?.[0];
    const item = (firstItem?.value || firstItem) as any;
    const fileDoc = item?.file; 
    
    if (!fileDoc || !fileDoc.url) {
      return NextResponse.json({ error: `Item or file URL not found for order ${orderId}` }, { status: 400 });
    }
  
    const downloadUrl = `${fileDoc.url}?dl=${encodeURIComponent((item?.title ?? "download") + ".pdf")}`;
    const buyerName = session.metadata?.buyer_name || session.customer_details?.name || "Valued Customer";
    const currency = (session.currency || "USD").toUpperCase();
    const formattedAmount = (session.amount_total || 0) / 100;
    const paid_at = new Date();
    const formattedDate = paid_at.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" });
    
    const emailSent = await sendPurchaseConfirmationEmail({
      to: order.customerEmail,
      subject: `Your Download is Ready — ${item?.title ?? "Purchase Confirmed"}`,
      buyerName,
      itemTitle: item?.title ?? "Your purchased item",
      downloadUrl,
      amount: formattedAmount,
      currency,
      transactionReference: session.id,
      date: formattedDate,
    });
    
    return NextResponse.json({ 
      success: true, 
      message: "Order fixed and email sent!", 
      email: order.customerEmail,
      emailSent 
    });

  } catch (error: any) {
    console.error("Fix script error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
