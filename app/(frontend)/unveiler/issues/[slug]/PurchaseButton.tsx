"use client";

import { useState } from "react";
import { ShoppingCart, Eye } from "lucide-react";
import { PdfPreviewModal } from "../../../../../components/magazine/PdfPreviewModal";
import { useCurrency } from "@/hooks/useCurrency";

interface Props {
  itemId: string;
  itemTitle: string;
  priceAmount: number;
  priceAmountUSD?: number;
  priceAmountGBP?: number;
  fileUrl?: string;
}

export function PurchaseButton({ itemId, itemTitle, priceAmount, priceAmountUSD, priceAmountGBP, fileUrl }: Props) {
  const [showModal, setShowModal] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [form, setForm] = useState({ name: "", email: "" });
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { currency, symbol } = useCurrency();

  let displayPrice = priceAmount;
  if (currency === "USD" && priceAmountUSD) {
    displayPrice = priceAmountUSD;
  } else if (currency === "GBP" && priceAmountGBP) {
    displayPrice = priceAmountGBP;
  }

  async function handlePurchase(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setIsProcessing(true);
    try {
      const res = await fetch("/api/paystack/purchase/initialize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.email,
          name: form.name,
          itemId,
          itemType: "magazineIssue",
          currency: currency,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Payment initialization failed");
      if (data.authorization_url) window.location.href = data.authorization_url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  }

  return (
    <>
      <div className="flex flex-col gap-3">
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center justify-center gap-3 w-full py-4 bg-white text-black font-black rounded-xl hover:bg-brand-primary hover:text-white transition-all uppercase tracking-widest text-sm shadow-xl"
        >
          <ShoppingCart size={18} /> Purchase — {symbol}{displayPrice.toLocaleString()}
        </button>

        {fileUrl && (
          <button
            onClick={() => setShowPreview(true)}
            className="flex items-center justify-center gap-3 w-full py-4 bg-white/10 text-white font-black rounded-xl hover:bg-white/20 transition-all uppercase tracking-widest text-sm"
          >
            <Eye size={18} /> Preview First 5 Pages
          </button>
        )}
      </div>

      {/* Preview Modal */}
      {showPreview && fileUrl && (
        <PdfPreviewModal
          fileUrl={fileUrl}
          title={itemTitle}
          onClose={() => setShowPreview(false)}
        />
      )}

      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-[#0d0d0d] border border-white/10 rounded-2xl p-8 w-full max-w-sm shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-base font-black text-white mb-1 line-clamp-2">{itemTitle}</h3>
            <p className="text-sm text-gray-500 mb-6">
              {symbol}{displayPrice.toLocaleString()} — enter your details to proceed to payment
            </p>

            {error && (
              <p className="text-red-400 text-xs mb-4 bg-red-500/10 border border-red-500/20 px-3 py-2 rounded-lg">
                {error}
              </p>
            )}

            <form onSubmit={handlePurchase} className="space-y-4">
              <input
                type="text"
                placeholder="Full Name"
                required
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-gray-600 text-sm focus:outline-none focus:border-brand-primary/50 transition-colors"
              />
              <input
                type="email"
                placeholder="Email Address"
                required
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-gray-600 text-sm focus:outline-none focus:border-brand-primary/50 transition-colors"
              />
              <button
                type="submit"
                disabled={isProcessing}
                className="w-full py-3 bg-brand-primary text-white font-black text-sm rounded-full hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? "Redirecting to Paystack…" : "Proceed to Payment"}
              </button>
            </form>

            <button
              onClick={() => setShowModal(false)}
              className="mt-4 w-full text-center text-xs text-gray-600 hover:text-gray-400 transition-colors"
            >
              Cancel
            </button>

            <p className="mt-4 text-center text-[10px] text-gray-700">
              Secured by Paystack · Download link sent by email after payment.
            </p>
          </div>
        </div>
      )}
    </>
  );
}
