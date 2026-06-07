// app/api/paystack/purchase/init/route.ts
import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { getPayload } from 'payload';
import configPromise from '@/payload.config';

interface PurchaseInitRequest {
  email: string;
  name: string;
  itemId: string;
  itemType: "publications" | "magazineIssues"; // 1. Updated to match your plural collection slugs
}

interface PaystackResponse {
  status: boolean;
  message: string;
  data: {
    authorization_url: string;
    access_code: string;
    reference: string;
  };
}

interface PurchasableItem {
  id: string;
  price?: string | null;
  priceAmount?: number | null;
  title?: string;
}

export async function POST(request: Request) {
  try {
    const headersList = await headers();
    const origin = headersList.get("origin");
    const allowedOrigins = [process.env.APP_URL, "http://localhost:3000"].filter(Boolean) as string[];
    const cleanOrigin = origin?.replace(/\/$/, "");

    if (!cleanOrigin || !allowedOrigins.includes(cleanOrigin)) {
      return NextResponse.json({ error: "Unauthorized origin" }, { status: 403 });
    }

    const body = (await request.json()) as PurchaseInitRequest;
    const { email, name, itemId, itemType } = body;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      return NextResponse.json({ error: "Valid email is required" }, { status: 400 });
    }
    if (!name?.trim()) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }
    if (!itemId || !["publications", "magazineIssues"].includes(itemType)) {
      return NextResponse.json({ error: "Valid item type is required" }, { status: 400 });
    }

    const sanitizedName = name.replace(/[<>]/g, "").trim().slice(0, 100);
    const payloadCms = await getPayload({ config: configPromise });

    // Cast the dynamic collection to satisfy internal Payload definitions cleanly
    const item = (await payloadCms.findByID({
      collection: itemType as any, 
      id: itemId,
    })) as unknown as PurchasableItem;

    if (!item) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }
    
    if (item.price !== "Paid" || !item.priceAmount || item.priceAmount <= 0) {
      return NextResponse.json({ error: "Item is not available for purchase" }, { status: 400 });
    }

    const amountKobo = Math.round(item.priceAmount * 100); 
    const reference = `PUR-${Date.now()}-${Math.floor(Math.random() * 10000)}`;

    // 2. Exact match mapping to your 'Orders' schema fields
    const order = await payloadCms.create({
      collection: 'orders',
      data: {
        customerName: sanitizedName,    // Matches schema
        customerEmail: email,           // Matches schema
        amount: item.priceAmount,       // Matches schema
        status: 'pending',              // Matches schema
        paystackReference: reference,   // Matches schema
        items: [                        // Matches relationship array setup
          {
            relationTo: itemType as any, 
            value: itemId,
          }
        ],
      },
    });

    // Initialize Paystack transaction
    const paystackResponse = await fetch("https://api.paystack.co/transaction/initialize", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        amount: amountKobo,
        currency: "NGN",
        reference,
        metadata: {
          name: sanitizedName,
          buyer_name: sanitizedName,
          orderId: order.id, 
          itemType,
          itemId,
          origin: cleanOrigin,
        },
        callback_url: `${cleanOrigin}/purchase/complete`,
      }),
    });

    const result = (await paystackResponse.json()) as PaystackResponse;

    if (!result.status) {
      console.error("Paystack purchase init error:", result.message);
      
      await payloadCms.update({
        collection: 'orders',
        id: order.id,
        data: { status: 'failed' },
      });
      
      return NextResponse.json({ error: "Payment initialization failed" }, { status: 400 });
    }

    return NextResponse.json({
      authorization_url: result.data.authorization_url,
      reference: result.data.reference,
    });
  } catch (error) {
    console.error("Purchase initialization error:", error);
    return NextResponse.json({ error: "Unable to process purchase" }, { status: 500 });
  }
}