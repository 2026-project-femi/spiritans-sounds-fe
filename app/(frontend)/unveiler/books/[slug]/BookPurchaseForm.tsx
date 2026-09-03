"use client";

import { useState } from "react";
import { useCurrency } from "@/hooks/useCurrency";
import { ShoppingCart, Download, Eye, Sparkles } from "lucide-react";
import { PdfPreviewModal } from "@/components/magazine/PdfPreviewModal";

interface BookPurchaseFormProps {
  book: {
    _id: string;
    title: string;
    price?: string;
    priceAmount?: number;
    priceAmountUSD?: number;
    priceAmountGBP?: number;
    fileUrl?: string;
    isPreorder?: boolean;
  };
}

export function BookPurchaseForm({ book }: BookPurchaseFormProps) {
  const isPaid = book.price?.toLowerCase() === "paid";

  const [showModal, setShowModal] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [form, setForm] = useState({ name: "", email: "" });
  const [isProcessing, setIsProcessing] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);

  const { currency, symbol } = useCurrency();

  let displayPrice = book.priceAmount;
  if (currency === "USD" && book.priceAmountUSD) {
    displayPrice = book.priceAmountUSD;
  } else if (currency === "GBP" && book.priceAmountGBP) {
    displayPrice = book.priceAmountGBP;
  }

  async function handlePurchase(e: React.FormEvent) {
    e.preventDefault();
    setModalError(null);
    setIsProcessing(true);
    try {
      const res = await fetch("/api/checkout/purchase", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.email,
          name: form.name,
          itemId: book._id,
          itemType: "publications",
          currency: currency,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Payment initialization failed");
      if (data.authorization_url) window.location.href = data.authorization_url;
    } catch (err) {
      setModalError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  }

  return (
    <div className="flex flex-col gap-6 mt-8">
      <div className="flex items-end gap-4">
        <div className="flex flex-col">
          <span className="text-xs uppercase tracking-widest text-gray-500 font-bold mb-1">Price</span>
          <span className={`font-black text-3xl ${isPaid ? "text-amber-400" : "text-green-500"}`}>
            {isPaid && displayPrice ? `${symbol}${displayPrice.toLocaleString()}` : book.price || "Free"}
          </span>
        </div>
      </div>

      {book.isPreorder && (
        <div className="relative overflow-hidden bg-gradient-to-br from-[#1c140a] via-[#120c04] to-[#0a0a0d] border border-amber-500/40 p-6 md:p-8 rounded-2xl space-y-5 shadow-xl shadow-amber-950/20">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
          
          <div className="flex items-center gap-2 px-3 py-1 bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[10px] font-black uppercase tracking-[0.25em] w-max rounded-full">
            <Sparkles className="w-3.5 h-3.5 animate-pulse text-amber-400" />
            <span>Book Pre-Order</span>
          </div>

          <div className="space-y-2">
            <h3 className="text-xl md:text-2xl font-black text-white">Reserve Your Copy Before Release</h3>
            <p className="text-gray-300 text-sm leading-relaxed font-light">
              Be among the first to receive this book when it is officially released. By pre-ordering, you secure your copy in advance and support the author and Spiritans Sound in promoting a culture of reading, writing and publishing.
            </p>
          </div>

          <div className="pt-2 border-t border-amber-500/20">
            <p className="font-bold text-amber-300 text-xs uppercase tracking-wider mb-3">Pre-Order Guarantee & Steps:</p>
            <ul className="text-xs text-gray-300 space-y-2.5">
              <li className="flex items-start gap-2">
                <span className="text-amber-400 font-bold">1.</span>
                <span>Place your pre-order and complete secure payment.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-400 font-bold">2.</span>
                <span>Receive instant order confirmation and email receipt.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-400 font-bold">3.</span>
                <span>Your copy will be delivered automatically immediately upon official release.</span>
              </li>
            </ul>
          </div>
          <p className="text-amber-400 text-xs font-bold italic pt-1">
            ✨ Pre-order now and secure early access upon launch.
          </p>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-4">
        {book.fileUrl && (
          <button
            onClick={() => setShowPreview(true)}
            className="flex items-center gap-2 px-8 py-4 bg-white/10 text-white font-black rounded-full hover:bg-white/20 transition-all uppercase tracking-widest"
          >
            <Eye size={18} /> Preview
          </button>
        )}

        {isPaid ? (
          <button
            onClick={() => setShowModal(true)}
            className={`flex-1 min-w-[200px] flex items-center justify-center gap-2 px-8 py-4 text-white font-black rounded-full transition-all uppercase tracking-widest shadow-xl ${book.isPreorder ? 'bg-amber-500 hover:bg-amber-600 shadow-amber-900/20 text-black' : 'bg-brand-primary hover:bg-red-700 shadow-red-900/20'}`}
          >
            <ShoppingCart size={18} /> {book.isPreorder ? "Pre-order Now" : "Purchase Now"}
          </button>
        ) : book.fileUrl ? (
          <a
            href={`${book.fileUrl}?dl=${book.title}.pdf`}
            className="flex-1 min-w-[200px] flex items-center justify-center gap-2 px-8 py-4 bg-linear-to-r from-brand-primary to-red-700 text-white font-black rounded-full hover:opacity-90 transition-all uppercase tracking-widest shadow-xl shadow-red-900/20"
          >
            <Download size={18} /> Download Free
          </a>
        ) : (
          <span className="px-8 py-4 bg-white/5 border border-white/10 text-gray-400 font-bold rounded-full uppercase tracking-widest">
            Unavailable
          </span>
        )}
      </div>

      {/* Preview Modal */}
      {showPreview && book.fileUrl && (
        <PdfPreviewModal
          fileUrl={book.fileUrl}
          title={book.title}
          onClose={() => setShowPreview(false)}
        />
      )}

      {/* Buy Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-[#0d0d0d] border border-white/10 rounded-2xl p-8 w-full max-w-sm shadow-2xl relative">
            <button 
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-white"
            >
              ✕
            </button>
            <h3 className="text-xl font-black text-white mb-2 line-clamp-2">{book.title}</h3>
            <p className="text-sm text-gray-500 mb-6">
              {displayPrice ? `${symbol}${displayPrice.toLocaleString()}` : ""} — enter your details to proceed to payment {book.isPreorder && "(Pre-order)"}
            </p>

            {modalError && (
              <p className="text-red-400 text-xs mb-4 bg-red-500/10 border border-red-500/20 px-3 py-2 rounded-lg">
                {modalError}
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
                className="w-full py-3.5 bg-brand-primary text-white font-black text-sm rounded-full hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? "Redirecting to Paystack…" : "Proceed to Payment"}
              </button>
            </form>

            <p className="mt-6 text-center text-[10px] text-gray-700 uppercase tracking-widest">
              Secured by Paystack · {book.isPreorder ? "Confirmation email sent upon payment. Book delivered upon release." : "Download link sent by email after payment."}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
