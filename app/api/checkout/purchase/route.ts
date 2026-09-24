import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { getPayload } from 'payload';
import configPromise from '@/payload.config';
import Stripe from "stripe";

const stripe = process.env.STRIPE_SECRET_KEY 
  ? new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: "2026-06-24.dahlia" }) 
  : null;

interface PurchaseInitRequest {
  email: string;
  name: string;
  itemId: string;
  itemType: "publications" | "magazineIssues"; 
  currency?: string; // NGN, USD, GBP
  format?: "ebook" | "paperback";
  shippingAddress?: string;
  shippingCity?: string;
  shippingCountry?: string;
  shippingPhone?: string;
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
  slug?: string;
  isPreorder?: boolean;
}

export async function POST(request: Request) {
  try {
    const headersList = await headers();
    const origin = headersList.get("origin");
    const host = headersList.get("host");
    const protocol = headersList.get("x-forwarded-proto") || "http";
    const currentHostUrl = host ? `${protocol}://${host}` : null;
    
    const allowedOrigins = [
      process.env.APP_URL, 
      "http://localhost:3000", 
      "https://spiritanssound.com", 
      "https://www.spiritanssound.com",
      currentHostUrl
    ].filter(Boolean) as string[];
    
    // Fallback to currentHostUrl if origin is missing, or just use origin
    const cleanOrigin = (origin || currentHostUrl)?.replace(/\/$/, "");

    if (!cleanOrigin || !allowedOrigins.includes(cleanOrigin)) {
      console.error(`Blocked by origin check. Origin: ${origin}, Host: ${host}, Allowed:`, allowedOrigins);
      return NextResponse.json({ error: "Unauthorized origin" }, { status: 403 });
    }

    const body = (await request.json()) as PurchaseInitRequest;
    const {
      email,
      name,
      itemId,
      itemType,
      currency = "NGN",
      format = "ebook",
      shippingAddress,
      shippingCity,
      shippingCountry,
      shippingPhone,
    } = body;

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

    if (format === "paperback") {
      if (!shippingAddress?.trim()) {
        return NextResponse.json({ error: "Delivery address is required for paperback orders." }, { status: 400 });
      }
      if (!shippingPhone?.trim()) {
        return NextResponse.json({ error: "Contact phone number is required for delivery coordination." }, { status: 400 });
      }
    }

    const sanitizedName = name.replace(/[<>]/g, "").trim().slice(0, 100);
    const payloadCms = await getPayload({ config: configPromise });

    // Find the item
    const item = (await payloadCms.findByID({
      collection: itemType as any, 
      id: itemId,
    })) as unknown as PurchasableItem;

    if (!item) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }

    // Check if this item relates to BookLaunchSettings
    let launchSettings: any = null;
    if (itemType === "publications") {
      try {
        const settings = await payloadCms.findGlobal({ slug: "book-launch-settings" as any });
        if (
          settings?.bookSlug === item.slug ||
          (settings?.publication && typeof settings.publication === "object" && settings.publication.id === item.id) ||
          settings?.publication === item.id ||
          item.slug === "behind-the-veil"
        ) {
          launchSettings = settings;
        }
      } catch (e) {
        // Fallback gracefully
      }
    }

    let selectedPrice: number | null | undefined = null;

    if (launchSettings) {
      if (format === "paperback") {
        if (currency === "USD") selectedPrice = launchSettings.paperbackPriceUSD;
        else if (currency === "GBP") selectedPrice = launchSettings.paperbackPriceGBP;
        else selectedPrice = launchSettings.paperbackPriceNGN;
      } else {
        if (currency === "USD") selectedPrice = launchSettings.ebookPriceUSD;
        else if (currency === "GBP") selectedPrice = launchSettings.ebookPriceGBP;
        else selectedPrice = launchSettings.ebookPriceNGN;
      }
    }

    // Fallback to item base price if not set from launchSettings
    if (!selectedPrice) {
      if (currency === "USD" && item.priceAmountUSD) {
        selectedPrice = item.priceAmountUSD;
      } else if (currency === "GBP" && item.priceAmountGBP) {
        selectedPrice = item.priceAmountGBP;
      } else {
        selectedPrice = item.priceAmount;
      }
    }

    if (!selectedPrice || selectedPrice <= 0) {
      return NextResponse.json({ error: "Item is not available for purchase or price not set for this currency" }, { status: 400 });
    }

    const isPreorder = Boolean(launchSettings?.isPreorder ?? item.isPreorder);
    const amountSubUnits = Math.round(selectedPrice * 100); 
    const reference = `PUR-${Date.now()}-${Math.floor(Math.random() * 10000)}`;

    const paymentProvider = currency === "NGN" ? "paystack" : "stripe";
    
    // Create the Payload Order with format and shipping fields
    const order = await payloadCms.create({
      collection: 'orders',
      data: {
        customerName: sanitizedName,
        customerEmail: email,
        amount: selectedPrice,
        currency: currency as any,
        status: 'pending',
        paymentProvider,
        format: format || 'ebook',
        isPreorder,
        shippingAddress: shippingAddress ? String(shippingAddress).trim() : undefined,
        shippingCity: shippingCity ? String(shippingCity).trim() : undefined,
        shippingCountry: shippingCountry ? String(shippingCountry).trim() : undefined,
        shippingPhone: shippingPhone ? String(shippingPhone).trim() : undefined,
        paystackReference: paymentProvider === 'paystack' ? reference : undefined,
        items: [
          {
            relationTo: itemType as any, 
            value: itemId,
          }
        ],
      },
    });

    const formatLabel = format === "paperback" ? "Paperback Edition" : "eBook Edition";
    const itemTitleWithFormat = `${item.title || "Book"} (${formatLabel})`;

    if (currency === "NGN") {
      // =======================
      // PAYSTACK (NGN ONLY)
      // =======================
      if (!process.env.PAYSTACK_SECRET_KEY) {
        return NextResponse.json({ error: "Paystack secret key not configured" }, { status: 500 });
      }

      const paystackResponse = await fetch("https://api.paystack.co/transaction/initialize", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          amount: amountSubUnits,
          currency: "NGN",
          reference,
          metadata: {
            name: sanitizedName,
            buyer_name: sanitizedName,
            orderId: order.id, 
            itemType,
            itemId,
            format,
            shippingAddress,
            shippingPhone,
            origin: cleanOrigin,
            original_currency: currency,
          },
          callback_url: `${cleanOrigin}/purchase/complete?orderId=${order.id}&isPreorder=${isPreorder ? 'true' : 'false'}&format=${format}`,
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

    } else if (currency === "USD" || currency === "GBP") {
      // =======================
      // STRIPE (USD & GBP)
      // =======================
      if (!stripe) {
        return NextResponse.json({ error: "Stripe is not configured. Please add STRIPE_SECRET_KEY to your .env" }, { status: 500 });
      }

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        customer_email: email,
        line_items: [
          {
            price_data: {
              currency: currency.toLowerCase(),
              product_data: {
                name: itemTitleWithFormat,
                description: format === "paperback"
                  ? `Physical paperback edition posted to: ${shippingAddress || "Specified address"}`
                  : "Digital edition purchase from Spiritans Sound.",
              },
              unit_amount: amountSubUnits,
            },
            quantity: 1,
          },
        ],
        mode: "payment",
        success_url: `${cleanOrigin}/purchase/complete?orderId=${order.id}&reference=${reference}&status=success&isPreorder=${isPreorder ? 'true' : 'false'}&format=${format}`,
        cancel_url: `${cleanOrigin}/purchase/complete?status=cancelled`,
        metadata: {
          reference,
          orderId: order.id.toString(),
          itemType,
          itemId,
          format,
          shippingAddress: shippingAddress || "",
          shippingPhone: shippingPhone || "",
          buyer_name: sanitizedName,
          origin: cleanOrigin,
          type: "purchase",
        },
        payment_intent_data: {
          metadata: {
            reference,
            orderId: order.id.toString(),
            itemType,
            itemId,
            format,
            shippingAddress: shippingAddress || "",
            shippingPhone: shippingPhone || "",
            buyer_name: sanitizedName,
            origin: cleanOrigin,
            type: "purchase",
          }
        }
      });

      if (!session.url || !session.id) {
        return NextResponse.json({ error: "Failed to create Stripe session" }, { status: 500 });
      }

      // Update Payload order with the actual Stripe session ID so we can verify it later
      await payloadCms.update({
        collection: 'orders',
        id: order.id,
        data: { stripeSessionId: session.id },
      });

      return NextResponse.json({
        authorization_url: session.url,
        reference: session.id,
      });

    } else {
      return NextResponse.json({ error: "Unsupported currency" }, { status: 400 });
    }
  } catch (error) {
    console.error("Purchase initialization error:", error);
    return NextResponse.json({ error: "Unable to process purchase" }, { status: 500 });
  }
}
