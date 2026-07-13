// app/api/paystack/purchase/init/route.ts
import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { getPayload } from 'payload';
import configPromise from '@/payload.config';

interface PurchaseInitRequest {
  email: string;
  name: string;
  itemId: string;
  itemType: "publications" | "magazineIssues"; 
  currency?: string; // NGN, USD, GBP
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
  priceAmountUSD?: number | null;
  priceAmountGBP?: number | null;
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
    const { email, name, itemId, itemType, currency = "NGN" } = body;

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
    
    let selectedPrice = item.priceAmount;
    if (currency === "USD" && item.priceAmountUSD) {
      selectedPrice = item.priceAmountUSD;
    } else if (currency === "GBP" && item.priceAmountGBP) {
      selectedPrice = item.priceAmountGBP;
    }

    if (item.price?.toLowerCase() !== "paid" || !selectedPrice || selectedPrice <= 0) {
      return NextResponse.json({ error: "Item is not available for purchase or price not set for this currency" }, { status: 400 });
    }

    let paystackCurrency = currency;
    let finalAmount = selectedPrice;

    // Convert GBP to USD since Paystack NG doesn't natively support GBP
    if (currency === "GBP") {
      let gbpToUsdRate = 1.3; // Fallback rate
      try {
        // Fetch real-time exchange rate (cached for 1 hour to prevent rate limiting)
        const fxResponse = await fetch("https://open.er-api.com/v6/latest/GBP", { 
          next: { revalidate: 3600 } 
        });
        if (fxResponse.ok) {
          const fxData = await fxResponse.json();
          if (fxData?.rates?.USD) {
            gbpToUsdRate = fxData.rates.USD;
          }
        }
      } catch (e) {
        console.error("Failed to fetch live exchange rate, using fallback.", e);
      }

      finalAmount = Math.round(selectedPrice * gbpToUsdRate);
      paystackCurrency = "USD";
    }

    const amountSubUnits = Math.round(finalAmount * 100); 
    const reference = `PUR-${Date.now()}-${Math.floor(Math.random() * 10000)}`;

    // 2. Exact match mapping to your 'Orders' schema fields
    const order = await payloadCms.create({
      collection: 'orders',
      data: {
        customerName: sanitizedName,    // Matches schema
        customerEmail: email,           // Matches schema
        amount: selectedPrice,          // Record the original price shown to user
        currency: currency as any,      // Record the original currency shown to user
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
        amount: amountSubUnits,
        currency: paystackCurrency,
        reference,
        metadata: {
          name: sanitizedName,
          buyer_name: sanitizedName,
          orderId: order.id, 
          itemType,
          itemId,
          origin: cleanOrigin,
          original_currency: currency,
        },
        callback_url: `${cleanOrigin}/purchase/complete`,
      }),
    });

    const result = (await paystackResponse.json()) as PaystackResponse;

    if (!result.status) {
      console.error("Paystack error:", result.message);
      
      await payloadCms.update({
        collection: 'orders',
        id: order.id,
        data: { status: 'failed' },
      });
      
      return NextResponse.json({ error: result.message || "Payment initialization failed" }, { status: 400 });
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