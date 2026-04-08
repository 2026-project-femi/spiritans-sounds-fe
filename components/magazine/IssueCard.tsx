"use client";

import { useState } from "react";
import Image from "next/image";
import { BookOpen, Calendar, Download, Eye } from "lucide-react";

interface MagazineIssue {
  _id: string;
  title: string;
  slug: string;
  publishedAt: string;
  imageUrl?: string;
  fileUrl?: string;
  price?: string;
  priceAmount?: number;
  description?: string;
}

export function IssueCard({ issue, index, isDummy }: { issue: MagazineIssue; index: number; isDummy: boolean }) {
  const isLatest = index === 0;
  const isPaid = issue.price === "Paid";
  const formattedDate = new Date(issue.publishedAt).toLocaleDateString("en-NG", {
    year: "numeric",
    month: "long",
  });

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
          itemId: issue._id,
          itemType: "magazineIssue",
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
      <div className={`group relative flex flex-col rounded-2xl overflow-hidden border transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-red-950/20 ${
        isLatest
          ? "border-brand-primary/50 bg-linear-to-br from-red-950/20 to-red-900/20"
          : "border-white/10 bg-white/3 hover:border-brand-primary/30"
      }`}>
        {isLatest && (
          <span className="absolute top-4 left-4 z-10 text-[10px] tracking-widest uppercase font-bold text-white bg-linear-to-r from-brand-primary to-red-700 px-3 py-1.5 rounded-full">
            Latest Issue
          </span>
        )}
        {isDummy && (
          <span className="absolute top-4 right-4 z-10 text-[10px] tracking-widest uppercase font-semibold text-gray-500 border border-gray-700 px-2 py-1 rounded-full">
            Sample
          </span>
        )}

        {/* Cover */}
        <div className="aspect-3/4 relative bg-linear-to-br from-red-950/30 to-red-900/40 flex items-center justify-center overflow-hidden">
          {issue.imageUrl ? (
            <Image
              src={issue.imageUrl}
              alt={issue.title}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="flex flex-col items-center gap-3 text-center px-6">
              <BookOpen className="w-12 h-12 text-brand-primary/40" />
              <p className="text-xs text-gray-600 uppercase tracking-widest">Treasures Unveiler</p>
              <p className="text-sm font-black text-white/20">{issue.title}</p>
            </div>
          )}

          {/* Overlay — download icon only for free items */}
          <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center p-6 pb-20">
            <div className="flex gap-4">
              {issue.fileUrl && !isPaid && (
                <a
                  href={`${issue.fileUrl}?dl=${issue.title}.pdf`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-brand-primary text-white rounded-full hover:bg-red-700 transition-colors shadow-lg"
                  title="Download PDF"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Download size={18} />
                </a>
              )}
              <div className="p-3 bg-white text-black rounded-full hover:bg-gray-200 transition-colors shadow-lg" title="Preview Cover">
                <Eye size={18} />
              </div>
            </div>
          </div>

          <div className="absolute bottom-4 left-4 right-4">
            <p className="text-white font-black text-sm leading-tight line-clamp-2">{issue.title}</p>
          </div>
        </div>

        {/* Meta */}
        <div className="p-5 space-y-4">
          <div className="flex items-center justify-between text-[10px] text-gray-500 font-bold uppercase tracking-widest">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              {formattedDate}
            </span>
            <span className={`px-2 py-0.5 rounded-full border ${isPaid ? "border-amber-500/50 text-amber-500" : "border-green-500/50 text-green-500"}`}>
              {isPaid && issue.priceAmount
                ? `₦${issue.priceAmount.toLocaleString()}`
                : issue.price || "Free"}
            </span>
          </div>

          {isPaid ? (
            <button
              onClick={() => setShowModal(true)}
              className={`block w-full text-center py-2.5 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${
                isLatest
                  ? "bg-white text-black hover:bg-brand-primary hover:text-white"
                  : "bg-white/10 text-white hover:bg-brand-primary"
              }`}
            >
              Buy — {issue.priceAmount ? `₦${issue.priceAmount.toLocaleString()}` : "Paid"}
            </button>
          ) : issue.fileUrl ? (
            <a
              href={`${issue.fileUrl}?dl=${issue.title}.pdf`}
              className={`block w-full text-center py-2.5 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${
                isLatest
                  ? "bg-brand-primary text-white hover:bg-red-700"
                  : "bg-white/10 text-white hover:bg-brand-primary"
              }`}
            >
              Download Issue
            </a>
          ) : (
            <div className="text-xs font-semibold uppercase tracking-widest text-gray-600 text-center py-2.5">
              Coming Soon
            </div>
          )}
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
            <h3 className="text-base font-black text-white mb-1 line-clamp-2">{issue.title}</h3>
            <p className="text-sm text-gray-500 mb-6">
              {issue.priceAmount ? `₦${issue.priceAmount.toLocaleString()}` : ""} — enter your details to proceed to payment
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
