import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

// Optional: check for Stripe secret key
const stripe = process.env.STRIPE_SECRET_KEY 
  ? new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: "2026-06-24.dahlia" }) 
  : null;

interface PaystackResponse {
	status: boolean;
	message: string;
	data?: {
		authorization_url: string;
		access_code: string;
		reference: string;
	};
}

export async function POST(req: NextRequest) {
	try {
		const { email, amount, name, currency } = await req.json();

		if (!email || !amount || !currency) {
			return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
		}

		// Ensure amount is positive
		if (amount <= 0) {
			return NextResponse.json({ error: "Amount must be greater than zero" }, { status: 400 });
		}

		// Get the base URL
		const protocol = req.headers.get("x-forwarded-proto") || "http";
		const host = req.headers.get("host") || "localhost:3000";
		const cleanOrigin = `${protocol}://${host}`;

		// Sanitize name (prevent XSS)
		const sanitizedName = name?.replace(/[<>]/g, "").trim().slice(0, 100) || "Anonymous";

		// ROUTING LOGIC: Paystack for NGN, Stripe for USD/GBP
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
					amount, // Amount is expected in subunits (kobo)
					currency: "NGN",
					reference: `DON-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
					metadata: {
						name: sanitizedName,
						donor_name: sanitizedName,
						origin: cleanOrigin,
						original_currency: currency,
					},
					callback_url: `${cleanOrigin}/donations/complete`,
				}),
			});

			const result = (await paystackResponse.json()) as PaystackResponse;

			if (!result.status || !result.data) {
				console.error("Paystack error:", result.message);
				return NextResponse.json({ error: result.message || "Payment initialization failed" }, { status: 400 });
			}

			return NextResponse.json({ authorization_url: result.data.authorization_url });

		} else if (currency === "USD" || currency === "GBP") {
			// =======================
			// STRIPE (USD & GBP)
			// =======================
			if (!stripe) {
				return NextResponse.json({ error: "Stripe is not configured. Please add STRIPE_SECRET_KEY to your .env" }, { status: 500 });
			}

			const reference = `DON-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

			// Amount passed from frontend is in subunits (cents/pence)
			const session = await stripe.checkout.sessions.create({
				payment_method_types: ["card"],
				customer_email: email,
				line_items: [
					{
						price_data: {
							currency: currency.toLowerCase(),
							product_data: {
								name: "Spiritans Sound Donation",
								description: "Your generosity becomes a seed planted in faith.",
							},
							unit_amount: amount, // already in subunits
						},
						quantity: 1,
					},
				],
				mode: "payment",
				success_url: `${cleanOrigin}/donations/complete?reference=${reference}&status=success`,
				cancel_url: `${cleanOrigin}/donations/complete?status=cancelled`,
				metadata: {
					reference,
					donor_name: sanitizedName,
					origin: cleanOrigin,
					type: "donation",
				},
			});

			if (!session.url) {
				return NextResponse.json({ error: "Failed to create Stripe session" }, { status: 500 });
			}

			return NextResponse.json({ authorization_url: session.url });
		} else {
			return NextResponse.json({ error: "Unsupported currency" }, { status: 400 });
		}

	} catch (error) {
		console.error("Checkout initialize error:", error);
		return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
	}
}
