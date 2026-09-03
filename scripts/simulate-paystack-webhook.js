import crypto from 'crypto';

// Note: Run this script with node --env-file=.env scripts/simulate-paystack-webhook.js <reference>

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;
const PAYSTACK_WEBHOOK_SECRET = process.env.PAYSTACK_WEBHOOK_SECRET || PAYSTACK_SECRET_KEY;
const LOCAL_WEBHOOK_URL = 'http://localhost:3000/api/paystack/webhook';

async function simulateWebhook(reference) {
  if (!reference) {
    console.error('❌ Please provide a Paystack transaction reference.');
    console.log('Usage: node scripts/simulate-paystack-webhook.js <reference>');
    process.exit(1);
  }

  if (!PAYSTACK_SECRET_KEY) {
    console.error('❌ PAYSTACK_SECRET_KEY is not defined in .env');
    process.exit(1);
  }

  try {
    console.log(`🔍 Fetching transaction ${reference} from Paystack...`);
    const response = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`
      }
    });

    const paystackData = await response.json();

    if (!paystackData.status) {
      console.error('❌ Transaction not found on Paystack.');
      process.exit(1);
    }

    // Construct the payload exactly as Paystack would send it
    const payload = {
      event: 'charge.success',
      data: paystackData.data
    };

    const payloadString = JSON.stringify(payload);

    // Generate the HMAC SHA512 signature
    const hash = crypto.createHmac('sha512', PAYSTACK_WEBHOOK_SECRET).update(payloadString).digest('hex');

    console.log(`🚀 Sending simulated webhook to ${LOCAL_WEBHOOK_URL}...`);
    
    const webhookResponse = await fetch(LOCAL_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-paystack-signature': hash
      },
      body: payloadString
    });

    const result = await webhookResponse.json();
    
    if (webhookResponse.ok) {
      console.log('✅ Webhook executed successfully!');
      console.log('Response:', result);
    } else {
      console.error(`❌ Webhook failed with status ${webhookResponse.status}`);
      console.error('Response:', result);
    }

  } catch (error) {
    console.error('❌ Error simulating webhook:', error);
  }
}

const args = process.argv.slice(2);
simulateWebhook(args[0]);
