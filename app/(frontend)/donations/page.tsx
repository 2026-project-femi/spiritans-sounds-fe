"use client";

import { useState, FormEvent } from "react";
import { useCurrency } from "@/hooks/useCurrency";
import { CurrencySelector } from "@/components/CurrencySelector";

// Types
interface DonationFormData {
	name: string;
	email: string;
	amount: string;
}

interface PaymentResponse {
	authorization_url?: string;
	error?: string;
}

// Constants
const MIN_AMOUNT = 100; // NGN
const MAX_AMOUNT = 10000000; // NGN

export default function DonatePage() {
	const [formData, setFormData] = useState<DonationFormData>({
		name: "",
		email: "",
		amount: "",
	});

	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
		// Clear error when user starts typing
		if (error) setError(null);
	};

	const validateForm = (currency: string): boolean => {
		const { name, email, amount } = formData;
		const amountNum = Number(amount);

		if (!name.trim()) {
			setError("Please enter your full name");
			return false;
		}

		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) {
			setError("Please enter a valid email address");
			return false;
		}

		if (!amount || isNaN(amountNum)) {
			setError("Please enter a valid amount");
			return false;
		}

		const dynamicMin = currency === "NGN" ? 100 : 1;
		const dynamicMax = 10000000;

		if (amountNum < dynamicMin || amountNum > dynamicMax) {
			const sym = currency === "NGN" ? "₦" : currency === "GBP" ? "£" : "$";
			setError(`Amount must be between ${sym}${dynamicMin.toLocaleString()} and ${sym}${dynamicMax.toLocaleString()}`);
			return false;
		}

		return true;
	};

	const handleSubmitWrapper = async (e: FormEvent<HTMLFormElement>, currentCurrency: string) => {
		e.preventDefault();

		if (!validateForm(currentCurrency) || isLoading) return;

		setIsLoading(true);
		setError(null);

		try {
			const response = await fetch("/api/checkout/donate", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					email: formData.email,
					amount: Number(formData.amount) * 100, // Convert to kobo/cents
					name: formData.name.trim(),
					currency: currentCurrency,
				}),
			});

			const data: PaymentResponse = await response.json();

			if (!response.ok) {
				throw new Error(data.error || "Payment initialization failed");
			}

			if (data.authorization_url) {
				window.location.href = data.authorization_url;
			}
		} catch (err) {
			setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
			console.error("Donation error:", err);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<main className="max-w-3xl mx-auto py-16 px-6 space-y-12 pt-32">
			<HeroSection />
			<ImpactSection />
			<div className="p-8 bg-white">
			<blockquote className="italic text-gray-500 max-w-2xl mx-auto">
				“Each one must give as he has decided in his heart, not reluctantly or under compulsion, for God loves a cheerful
				giver.”
				<br />
				<cite className="not-italic text-sm">— 2 Corinthians 9:7</cite>
			</blockquote>
			</div>
			<DonationForm
				formData={formData}
				isLoading={isLoading}
				error={error}
				onInputChange={handleInputChange}
				onSubmit={(e, curr) => handleSubmitWrapper(e, curr)}
			/>
		</main>
	);
}

// Sub-components for better organization
function HeroSection() {
	return (
		<section className="text-center space-y-4">
			<h1 className="text-4xl md:text-5xl font-bold text-black">Partner With Us in Spreading the Gospel</h1>

			<p className="text-lg text-gray-800 max-w-xl mx-auto">
				Spiritans Sound Outreach is dedicated to evangelisation, talent discovery, faith formation, and youth empowerment through music, media, reflections, workshops, and creative outreach programmes.
			</p>

			
		</section>
	);
}

function ImpactSection() {
	const impacts = [
		{ icon: "📖", text: "Sharing homily, reflections, and inspiring articles" },
		{ icon: "🎙", text: "Organising workshops, broadcasts, and outreach programmes" },
		{ icon: "🎵", text: "Supporting young and talented creators" },
		{ icon: "🙏", text: "Reaching lives with hope, faith, and encouragement" },
	];

	return (
		<section className="bg-gradient-to-br from-gray-50 to-gray-100 p-8 rounded-2xl space-y-4">
			<h2 className="text-2xl font-semibold text-gray-800">Your support helps us continue:</h2>

			<ul className="space-y-3 text-gray-700">
				{impacts.map((impact, index) => (
					<li key={index} className="flex items-start gap-2">
						<span className="text-xl">{impact.icon}</span>
						<span>{impact.text}</span>
					</li>
				))}
			</ul>

			<p className="italic text-gray-800 pt-2 border-t border-gray-200">
				When you give, you become part of a mission that inspires and empowers lives.
			</p>
		</section>
	);
}

interface DonationFormProps {
	formData: DonationFormData;
	isLoading: boolean;
	error: string | null;
	onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	onSubmit: (e: FormEvent<HTMLFormElement>, currency: string) => void;
}

function DonationForm({ formData, isLoading, error, onInputChange, onSubmit }: DonationFormProps) {
	const { currency, symbol, isLoading: isCurrencyLoading } = useCurrency();

	if (isCurrencyLoading) {
		return <div className="text-center py-8">Loading...</div>;
	}

	const minAmount = currency === "NGN" ? 100 : 1; // 100 NGN or 1 USD/GBP
	const stepAmount = "any";

	return (
		<section className="bg-white shadow-xl p-8 rounded-2xl space-y-6">
			<div className="text-center space-y-3">
				<p className="text-gray-800">Your generosity becomes a seed planted in faith.</p>
				<p className="text-gray-800">What you give today may be the message that restores someone tomorrow.</p>
				<p className="font-medium text-green-700">God multiplies what is given in love.</p>
			</div>

			<div className="flex justify-center border-b pb-4 mb-4">
				<CurrencySelector />
			</div>

			{error && (
				<div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
					<p className="text-red-700 text-sm">{error}</p>
				</div>
			)}

			<form onSubmit={(e) => onSubmit(e, currency)} className="space-y-4">
				<InputField
					type="text"
					name="name"
					placeholder="Full Name"
					value={formData.name}
					onChange={onInputChange}
					required
					autoComplete="name"
				/>

				<InputField
					type="email"
					name="email"
					placeholder="Email Address"
					value={formData.email}
					onChange={onInputChange}
					required
					autoComplete="email"
				/>

				<div className="relative">
					<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
						<span className="text-gray-500 sm:text-sm">{symbol}</span>
					</div>
					<input
						type="number"
						name="amount"
						placeholder={`Donation Amount (${currency})`}
						value={formData.amount}
						onChange={onInputChange}
						required
						min={minAmount}
						step={stepAmount}
						className="w-full border border-gray-300 py-3 pr-3 pl-8 rounded-lg focus:ring-2 focus:ring-green-500 
                  focus:border-transparent outline-none transition-all duration-200
                  placeholder:text-gray-400"
					/>
				</div>

				<button
					type="submit"
					disabled={isLoading}
					className={`
            w-full bg-green-700 text-white p-4 rounded-xl font-semibold 
            transition-all duration-200
            ${isLoading ? "opacity-50 cursor-not-allowed" : "hover:bg-green-800 hover:shadow-lg active:scale-98"}
          `}>
					{isLoading ? (
						<span className="flex items-center justify-center gap-2">
							<svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
								<circle
									className="opacity-25"
									cx="12"
									cy="12"
									r="10"
									stroke="currentColor"
									strokeWidth="4"
									fill="none"
								/>
								<path
									className="opacity-75"
									fill="currentColor"
									d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
								/>
							</svg>
							Processing...
						</span>
					) : (
						"Give Cheerfully"
					)}
				</button>
			</form>

			<div className="text-center space-y-2">
				<div className="flex items-center justify-center gap-2 text-sm text-gray-500">
					<span className="text-green-600">🔒</span>
					<span>Secure donation powered by Paystack</span>
				</div>
				<p className="text-xs text-gray-400">You'll receive an instant confirmation receipt via email</p>
			</div>
		</section>
	);
}

interface InputFieldProps {
	type: string;
	name: string;
	placeholder: string;
	value: string;
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	required?: boolean;
	autoComplete?: string;
	min?: number;
	step?: string;
}

function InputField({ type, name, placeholder, value, onChange, required, autoComplete, min, step }: InputFieldProps) {
	return (
		<input
			type={type}
			name={name}
			placeholder={placeholder}
			value={value}
			onChange={onChange}
			required={required}
			autoComplete={autoComplete}
			min={min}
			step={step}
			className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-green-500 
                 focus:border-transparent outline-none transition-all duration-200
                 placeholder:text-gray-400"
		/>
	);
}
