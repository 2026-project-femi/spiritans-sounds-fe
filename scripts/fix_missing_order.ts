import fs from 'fs';
import path from 'path';
try {
  const envPath = path.join(process.cwd(), '.env');
  if (fs.existsSync(envPath)) {
    const envFile = fs.readFileSync(envPath, 'utf8');
    for (const line of envFile.split('\n')) {
      if (line.includes('=')) {
        const [key, ...values] = line.split('=');
        if (!process.env[key]) process.env[key] = values.join('=').trim().replace(/['"]/g, '');
      }
    }
  }
} catch(e) {
  // Silent fallback if .env doesn't exist (e.g. server env vars)
}
import Stripe from 'stripe';
import { getPayload } from 'payload';
import configPromise from '../payload.config';
import { sendPurchaseConfirmationEmail } from '../lib/emails/sendEmail';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, { apiVersion: '2026-06-24.dahlia' as any });

async function fixOrder() {
  const chargeId = 'ch_3U5yHXLvANyw72eW1abDitw7';
  
  console.log(`🔍 Looking up charge ${chargeId}...`);
  const charge = await stripe.charges.retrieve(chargeId);
  const paymentIntentId = charge.payment_intent as string;
  
  if (!paymentIntentId) {
    console.error("❌ Charge does not have a payment intent.");
    process.exit(1);
  }
  
  console.log(`🔍 Looking up checkout session for payment intent ${paymentIntentId}...`);
  const sessions = await stripe.checkout.sessions.list({ payment_intent: paymentIntentId });
  const session = sessions.data[0];
  
  if (!session) {
    console.error("❌ No checkout session found for this charge.");
    process.exit(1);
  }
  
  console.log(`✅ Found session: ${session.id}`);
  
  const payloadCms = await getPayload({ config: configPromise });
  const orderId = session.metadata?.orderId;
  
  if (!orderId) {
    console.error("❌ No orderId found in session metadata.");
    process.exit(1);
  }
  
  const order = await payloadCms.findByID({ collection: 'orders', id: orderId, depth: 2 });
  console.log(`📦 Found order: ${order.id} | Current status: ${order.status}`);
  
  if (order.status === 'completed') {
    console.log("⏭️ Order is already marked as completed. Skipping update.");
  } else {
    await payloadCms.update({
      collection: 'orders',
      id: orderId,
      data: { status: 'completed' },
    });
    console.log("✅ Order marked as completed in database!");
  }
  
  // Send email
  console.log("📧 Preparing to send email...");
  const firstItem = order.items?.[0];
  const item = (firstItem?.value || firstItem) as any;
  const fileDoc = item?.file; 
  
  if (!fileDoc || !fileDoc.url) {
    console.error(`❌ Item or file URL not found for order ${orderId}`);
    process.exit(1);
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
  
  if (emailSent) {
    console.log("✅ Email sent successfully to", order.customerEmail);
  } else {
    console.error("❌ Failed to send email.");
  }
  process.exit(0);
}

fixOrder().catch((e) => {
    console.error(e);
    process.exit(1);
});
