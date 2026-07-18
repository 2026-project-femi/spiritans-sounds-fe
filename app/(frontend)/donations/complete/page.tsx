// app/donations/complete/page.tsx
"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

function DonationContent() {
	const searchParams = useSearchParams();
	const reference = searchParams.get("reference") || searchParams.get("trxref");
	const status = searchParams.get("status");
	const [countdown, setCountdown] = useState(10);
	
	const isCancelled = status === "cancelled";

	useEffect(() => {
		// Auto-redirect after 10 seconds
		if (countdown === 0) {
			window.location.href = "/";
			return;
		}

		const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
		return () => clearTimeout(timer);
	}, [countdown]);

	return (
		<div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
			<div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
				{/* Icon */}
				<div className={`w-20 h-20 ${isCancelled ? 'bg-red-100' : 'bg-green-100'} rounded-full flex items-center justify-center mx-auto`}>
					{isCancelled ? (
						<svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
						</svg>
					) : (
						<svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
						</svg>
					)}
				</div>

				<h2 className="mt-4 text-2xl font-bold text-gray-800">
					{isCancelled ? "Donation Cancelled" : "Thank You! 🙏"}
				</h2>

				<p className="mt-2 text-gray-800">
					{isCancelled ? "You cancelled the donation process. No charges were made." : "Your donation is being processed."}
				</p>

				{reference && (
					<div className="mt-4 p-3 bg-gray-50 rounded-lg">
						<p className="text-sm text-gray-500">Reference</p>
						<p className="font-mono text-sm text-gray-700">{reference}</p>
					</div>
				)}

				<div className="mt-6 space-y-4">
					{!isCancelled && (
						<div className="animate-pulse text-sm text-gray-500">You'll receive a confirmation email shortly.</div>
					)}

					<Link
						href="/"
						className={`inline-block ${isCancelled ? 'bg-red-600 hover:bg-red-700' : 'bg-green-700 hover:bg-green-800'} text-white px-6 py-3 rounded-lg font-semibold transition-colors`}>
						Return Home {countdown > 0 && `(${countdown}s)`}
					</Link>

					<p className="text-sm text-gray-500 italic">"God loves a cheerful giver." — 2 Corinthians 9:7</p>
				</div>
			</div>
		</div>
	);
}

export default function DonationCompletePage() {
	return (
		<Suspense
			fallback={
				<div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
					<div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
						<div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto animate-pulse"></div>
						<h2 className="mt-4 text-2xl font-bold text-gray-800">Loading...</h2>
					</div>
				</div>
			}>
			<DonationContent />
		</Suspense>
	);
}
