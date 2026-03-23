// /app/api/paystack/initialize/route.ts
import { NextResponse } from "next/server";
import { headers } from "next/headers";

// Types
interface InitializeRequest {
	email: string;
	amount: number; // In kobo (multiply NGN by 100)
	name?: string;
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
		const { email, amount, name } = body;

		// Email validation
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!email || !emailRegex.test(email)) {
			return NextResponse.json({ error: "Valid email is required" }, { status: 400 });
		}

		// Amount validation (in kobo: ₦100 = 10000 kobo minimum)
		const MIN_AMOUNT = 10000; // ₦100
		const MAX_AMOUNT = 1000000000; // ₦10,000,000

		if (!amount || amount < MIN_AMOUNT || amount > MAX_AMOUNT) {
			return NextResponse.json({ error: `Amount must be between ₦${MIN_AMOUNT / 100} and ₦${MAX_AMOUNT / 100}` }, { status: 400 });
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
				amount, // Already in kobo
				currency: "NGN",
				reference: `DON-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
				metadata: {
					name: sanitizedName,
					donor_name: sanitizedName,
					origin: cleanOrigin,
				},
				callback_url: `${cleanOrigin}/donations/complete`, // Where to redirect after payment
			}),
		});

		const result = (await paystackResponse.json()) as PaystackResponse;

		// 4. Handle Paystack response
		if (!result.status) {
			console.error("Paystack error:", result.message);
			return NextResponse.json({ error: "Payment initialization failed" }, { status: 400 });
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
