import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { createClient } from "next-sanity";
import { apiVersion, dataset, projectId } from "@/sanity/env";

interface PurchaseInitRequest {
  email: string;
  name: string;
  itemId: string;
  itemType: "publication" | "magazineIssue";
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

export async function POST(request: Request) {
  try {
    // 1. Verify origin (CORS protection — mirrors donation route)
    const headersList = await headers();
    const origin = headersList.get("origin");
    const allowedOrigins = [process.env.APP_URL, "http://localhost:3000"].filter(Boolean) as string[];
    const cleanOrigin = origin?.replace(/\/$/, "");

    if (!cleanOrigin || !allowedOrigins.includes(cleanOrigin)) {
      return NextResponse.json({ error: "Unauthorized origin" }, { status: 403 });
    }

    // 2. Parse and validate request body
    const body = (await request.json()) as PurchaseInitRequest;
    const { email, name, itemId, itemType } = body;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      return NextResponse.json({ error: "Valid email is required" }, { status: 400 });
    }
    if (!name?.trim()) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }
    if (!itemId || !["publication", "magazineIssue"].includes(itemType)) {
      return NextResponse.json({ error: "Valid item is required" }, { status: 400 });
    }

    const sanitizedName = name.replace(/[<>]/g, "").trim().slice(0, 100);

    const token = process.env.SANITY_API_TOKEN;
    if (!token) {
      return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
    }

    const sanityClient = createClient({ projectId, dataset, apiVersion, useCdn: false, token });

    // 3. Fetch item from Sanity — price is always authoritative from the server
    const item = await sanityClient.fetch(
      `*[_type == $itemType && _id == $itemId][0]{ _id, title, price, priceAmount }`,
      { itemType, itemId }
    );

    if (!item) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }
    if (item.price !== "Paid" || !item.priceAmount || item.priceAmount <= 0) {
      return NextResponse.json({ error: "Item is not available for purchase" }, { status: 400 });
    }

    const amountKobo = Math.round(item.priceAmount * 100); // NGN → kobo

    // 4. Create pending order in Sanity before redirecting to Paystack
    const order = await sanityClient.create({
      _type: "order",
      buyerName: sanitizedName,
      buyerEmail: email,
      item: { _type: "reference", _ref: itemId },
      itemType,
      amountNGN: item.priceAmount,
      status: "pending",
      createdAt: new Date().toISOString(),
    });

    // 5. Generate PUR- prefixed reference (distinguishes from DON- donation references in webhook)
    const reference = `PUR-${Date.now()}-${Math.floor(Math.random() * 10000)}`;

    // 6. Patch order with the reference so the webhook can look it up
    await sanityClient.patch(order._id).set({ reference }).commit();

    // 7. Initialize Paystack transaction
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
          orderId: order._id,
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
      await sanityClient.patch(order._id).set({ status: "failed" }).commit();
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
