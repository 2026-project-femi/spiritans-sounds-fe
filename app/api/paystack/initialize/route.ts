// /app/api/paystack/initialize/route.ts
import { NextResponse } from "next/server";
import { headers } from "next/headers";

// Types
interface InitializeRequest {
	email: string;
	amount: number; // In sub-units (kobo/cents)
	name?: string;
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

export async function POST(request: Request) {
	try {
		// 1. Verify origin (CORS protection)
		const headersList = await headers();
		const origin = headersList.get("origin");

		const allowedOrigins = [process.env.APP_URL, "http://localhost:3000"].filter(Boolean) as string[];

		// Remove trailing slash for comparison
		const cleanOrigin = origin?.replace(/\/$/, "");

		if (!cleanOrigin || !allowedOrigins.includes(cleanOrigin)) {
			return NextResponse.json({ error: "Unauthorized origin" }, { status: 403 });
		}

		// 2. Parse and validate request body
		const body = (await request.json()) as InitializeRequest;
		const { email, amount, name, currency = "NGN" } = body;

		// Email validation
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!email || !emailRegex.test(email)) {
			return NextResponse.json({ error: "Valid email is required" }, { status: 400 });
		}

		// Currency & Amount validation
		const minAmounts: Record<string, number> = {
			NGN: 10000, // ₦100
			USD: 100,   // $1
			GBP: 100,   // £1
		};
		const MIN_AMOUNT = minAmounts[currency] || 10000;
		const MAX_AMOUNT = 1000000000; // Large arbitrary limit

		if (!amount || amount < MIN_AMOUNT || amount > MAX_AMOUNT) {
			const symbols: Record<string, string> = { NGN: "₦", USD: "$", GBP: "£" };
			const symbol = symbols[currency] || "₦";
			return NextResponse.json(
				{ error: `Amount must be between ${symbol}${MIN_AMOUNT / 100} and ${symbol}${MAX_AMOUNT / 100}` },
				{ status: 400 }
			);
		}

		let paystackCurrency = currency;
		let finalAmount = amount;

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

			finalAmount = Math.round(amount * gbpToUsdRate);
			paystackCurrency = "USD";
		}

		// Sanitize name (prevent XSS)
		const sanitizedName =
			name
				?.replace(/[<>]/g, "") // Remove HTML tags
				.trim()
				.slice(0, 100) || "Anonymous"; // Limit length

		// 3. Initialize transaction with Paystack
		const paystackResponse = await fetch("https://api.paystack.co/transaction/initialize", {
			method: "POST",
			headers: {
				Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				email,
				amount: finalAmount, // Already in sub-units
				currency: paystackCurrency,
				reference: `DON-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
				metadata: {
					name: sanitizedName,
					donor_name: sanitizedName,
					origin: cleanOrigin,
					original_currency: currency,
				},
				callback_url: `${cleanOrigin}/donations/complete`, // Where to redirect after payment
			}),
		});

		const result = (await paystackResponse.json()) as PaystackResponse;

		// 4. Handle Paystack response
		if (!result.status) {
			console.error("Paystack error:", result.message);
			return NextResponse.json({ error: result.message || "Payment initialization failed" }, { status: 400 });
		}

		// 5. Return the authorization URL to the frontend
		return NextResponse.json({
			authorization_url: result.data.authorization_url,
			reference: result.data.reference,
		});
	} catch (error) {
		console.error("Donation initialization error:", error);
		return NextResponse.json({ error: "Unable to process donation" }, { status: 500 });
	}
}
