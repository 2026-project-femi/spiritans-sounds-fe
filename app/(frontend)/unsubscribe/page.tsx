"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

function UnsubscribeContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";

  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleUnsubscribe() {
    if (!email) {
      setStatus("error");
      setMessage("No email address found in this link. Please contact us for help.");
      return;
    }

    setStatus("loading");

    try {
      const res = await fetch("/api/newsletter/unsubscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus("success");
        setMessage(data.message);
      } else {
        setStatus("error");
        setMessage(data.message || "Something went wrong. Please try again.");
      }
    } catch {
      setStatus("error");
      setMessage("Something went wrong. Please try again.");
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        {status === "success" ? (
          <>
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
              <svg className="w-10 h-10 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="mt-4 text-2xl font-bold text-gray-800">Unsubscribed</h2>
            <p className="mt-2 text-gray-600">
              {email && (
                <span className="block text-sm font-medium text-gray-500 mb-2">{email}</span>
              )}
              You have been removed from our mailing list. You won&apos;t receive any further newsletters.
            </p>
            <p className="mt-4 text-sm text-gray-500 italic">
              Changed your mind? You can re-subscribe anytime on our website.
            </p>
            <Link
              href="/"
              className="mt-6 inline-block bg-red-700 hover:bg-red-800 text-white px-6 py-3 rounded-lg font-semibold transition-colors text-sm">
              Return Home
            </Link>
          </>
        ) : status === "error" ? (
          <>
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto">
              <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="mt-4 text-2xl font-bold text-gray-800">Something went wrong</h2>
            <p className="mt-2 text-gray-600">{message}</p>
            <Link
              href="/"
              className="mt-6 inline-block bg-red-700 hover:bg-red-800 text-white px-6 py-3 rounded-lg font-semibold transition-colors text-sm">
              Return Home
            </Link>
          </>
        ) : (
          <>
            <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto">
              <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h2 className="mt-4 text-2xl font-bold text-gray-800">Unsubscribe</h2>
            {email ? (
              <p className="mt-2 text-gray-600">
                Confirm that you&apos;d like to unsubscribe{" "}
                <span className="font-medium text-gray-800">{email}</span>{" "}
                from the Spiritans Sound newsletter.
              </p>
            ) : (
              <p className="mt-2 text-gray-600">
                No email address was found in this link. Please use the unsubscribe link from your email.
              </p>
            )}
            <div className="mt-6 space-y-3">
              <button
                onClick={handleUnsubscribe}
                disabled={!email || status === "loading"}
                className="w-full bg-red-700 hover:bg-red-800 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-semibold transition-colors text-sm">
                {status === "loading" ? "Processing..." : "Yes, unsubscribe me"}
              </button>
              <Link
                href="/"
                className="block w-full border border-gray-300 hover:border-gray-400 text-gray-700 px-6 py-3 rounded-lg font-semibold transition-colors text-sm">
                No, keep me subscribed
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function UnsubscribePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
          <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto animate-pulse" />
            <h2 className="mt-4 text-2xl font-bold text-gray-800">Loading...</h2>
          </div>
        </div>
      }>
      <UnsubscribeContent />
    </Suspense>
  );
}
