"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle, Mail } from "lucide-react";

function PurchaseContent() {
  const searchParams = useSearchParams();
  const reference = searchParams.get("reference") || searchParams.get("trxref");
  const [countdown, setCountdown] = useState(15);

  useEffect(() => {
    if (countdown === 0) {
      window.location.href = "/unveiler/issues";
      return;
    }
    const t = setTimeout(() => setCountdown(countdown - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown]);

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white/3 border border-white/10 rounded-2xl p-10 text-center space-y-6">

        {/* Icon */}
        <div className="w-20 h-20 bg-green-500/10 border border-green-500/20 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle className="w-10 h-10 text-green-400" />
        </div>

        <div>
          <h2 className="text-2xl font-black text-white">Payment Successful!</h2>
          <p className="mt-2 text-gray-400 text-sm leading-relaxed">
            Your purchase is confirmed. We are preparing your download link.
          </p>
        </div>

        {/* Email notice */}
        <div className="flex items-start gap-3 bg-brand-primary/5 border border-brand-primary/20 rounded-xl px-5 py-4 text-left">
          <Mail className="w-5 h-5 text-brand-primary mt-0.5 shrink-0" />
          <p className="text-sm text-gray-300 leading-relaxed">
            Your download link will arrive by email within a few minutes.
            Please check your inbox (and spam folder).
          </p>
        </div>

        {reference && (
          <div className="bg-white/5 rounded-lg px-4 py-3 text-left">
            <p className="text-[10px] text-gray-600 uppercase tracking-widest font-bold mb-1">Reference</p>
            <p className="font-mono text-sm text-gray-300 break-all">{reference}</p>
          </div>
        )}

        <Link
          href="/unveiler/issues"
          className="block w-full py-3 bg-brand-primary text-white font-black text-sm rounded-full hover:bg-red-700 transition-colors"
        >
          Back to Magazine {countdown > 0 && `(${countdown}s)`}
        </Link>

        <p className="text-xs text-gray-700 italic">
          &ldquo;Whatever is true, whatever is noble… think about such things.&rdquo; — Philippians 4:8
        </p>
      </div>
    </div>
  );
}

export default function PurchaseCompletePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#050505] flex items-center justify-center">
          <div className="w-16 h-16 rounded-full border-2 border-brand-primary/20 border-t-brand-primary animate-spin" />
        </div>
      }
    >
      <PurchaseContent />
    </Suspense>
  );
}
