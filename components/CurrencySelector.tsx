"use client";

import { useCurrency, Currency } from "@/hooks/useCurrency";

export function CurrencySelector() {
  const { currency, setCurrency, isLoading } = useCurrency();

  if (isLoading) return null;

  return (
    <div className="flex items-center gap-2 text-sm">
      <label htmlFor="currency-select" className="text-gray-600 font-medium">Currency:</label>
      <select
        id="currency-select"
        value={currency}
        onChange={(e) => setCurrency(e.target.value as Currency)}
        className="border border-gray-300 rounded-md py-1 px-2 bg-white text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500"
      >
        <option value="NGN">NGN (₦)</option>
        <option value="USD">USD ($)</option>
        <option value="GBP">GBP (£)</option>
      </select>
    </div>
  );
}
