"use client";

import { useState } from "react";
import Image from "next/image";
import { BookOpen, ShoppingCart, Download, Calendar } from "lucide-react";

interface Book {
  _id: string;
  title: string;
  description: string;
  price: string;
  priceAmount?: number;
  slug: string;
  imageUrl?: string;
  fileUrl?: string;
  publishedAt?: string;
}

export function BookCard({ book }: { book: Book }) {
  const isPaid = book.price === "Paid";

  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: "", email: "" });
  const [isProcessing, setIsProcessing] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);

  async function handlePurchase(e: React.FormEvent) {
    e.preventDefault();
    setModalError(null);
    setIsProcessing(true);
    try {
      const res = await fetch("/api/paystack/purchase/initialize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.email,
          name: form.name,
          itemId: book._id,
          itemType: "publication",
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
    <>
      <div className="group flex flex-col rounded-2xl bg-white/3 border border-white/10 hover:border-brand-primary/40 transition-all duration-300 overflow-hidden hover:shadow-2xl hover:shadow-red-950/20">
        {/* Book Cover */}
        <div className="aspect-3/4 relative bg-linear-to-br from-red-950/30 to-red-900/40 flex items-center justify-center overflow-hidden border-b border-white/5">
          {book.imageUrl ? (
            <Image
              src={book.imageUrl}
              alt={book.title}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              className="object-cover group-hover:scale-110 transition-transform duration-700"
            />
          ) : (
            <div className="flex flex-col items-center gap-3 text-center px-6">
              <BookOpen className="w-16 h-16 text-brand-primary/30" />
              <span className="text-[10px] tracking-widest uppercase text-gray-600">Treasures Unveiler</span>
            </div>
          )}

          {/* Hover overlay — download only for free items */}
          {book.fileUrl && !isPaid && (
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <a
                href={`${book.fileUrl}?dl=${book.title}.pdf`}
                className="p-4 bg-brand-primary text-white rounded-full hover:scale-110 transition-transform shadow-xl"
                title="Download eBook"
              >
                <Download size={24} />
              </a>
            </div>
          )}
        </div>

        <div className="p-6 flex flex-col flex-1 gap-4">
          <div className="space-y-2">
            <div className="flex justify-between items-start">
              <h2 className="text-xl font-bold text-white leading-tight group-hover:text-brand-primary transition-colors line-clamp-2">
                {book.title}
              </h2>
            </div>
            {book.publishedAt && (
              <div className="flex items-center gap-1.5 text-[10px] text-gray-500 uppercase tracking-widest font-bold">
                <Calendar size={12} />
                {new Date(book.publishedAt).getFullYear()}
              </div>
            )}
          </div>

          <p className="text-sm text-gray-400 leading-relaxed line-clamp-3 font-light flex-1">
            {book.description}
          </p>

          <div className="flex items-center justify-between pt-5 border-t border-white/5">
            <div className="flex flex-col">
              <span className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-1">Investment</span>
              <span className={`font-bold text-lg ${isPaid ? "text-amber-400" : "text-green-500"}`}>
                {isPaid && book.priceAmount
                  ? `₦${book.priceAmount.toLocaleString()}`
                  : book.price || "Free"}
              </span>
            </div>

            {isPaid ? (
              <button
                onClick={() => setShowModal(true)}
                className="flex items-center gap-2 px-5 py-2.5 bg-white text-black text-xs font-black rounded-full hover:bg-brand-primary hover:text-white transition-all uppercase tracking-widest"
              >
                <ShoppingCart size={14} /> Buy
              </button>
            ) : book.fileUrl ? (
              <a
                href={`${book.fileUrl}?dl=${book.title}.pdf`}
                className="flex items-center gap-2 px-5 py-2.5 bg-linear-to-r from-brand-primary to-red-700 text-white text-xs font-black rounded-full hover:opacity-90 transition-all uppercase tracking-widest shadow-lg shadow-red-900/20"
              >
                <Download size={14} /> Download
              </a>
            ) : (
              <span className="text-[10px] font-bold uppercase tracking-widest text-gray-600 border border-white/10 px-4 py-2 rounded-full">
                Coming Soon
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Buy modal */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-[#0d0d0d] border border-white/10 rounded-2xl p-8 w-full max-w-sm shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-base font-black text-white mb-1 line-clamp-2">{book.title}</h3>
            <p className="text-sm text-gray-500 mb-6">
              {book.priceAmount ? `₦${book.priceAmount.toLocaleString()}` : ""} — enter your details to proceed to payment
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
