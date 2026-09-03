import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Publishing Terms & Conditions",
  description: "Terms and conditions for publishing your book with Treasures Unveiler.",
};

import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default function PublishingTermsPage() {
  return (
    <main className="min-h-screen bg-[#08080a] text-foreground pb-32 pt-16">
      <div className="max-w-4xl mx-auto px-6">
        <Link
          href="/unveiler/publish"
          className="inline-flex items-center gap-2 text-brand-primary hover:text-white transition-colors mb-12 text-sm font-bold uppercase tracking-widest"
        >
          <ChevronLeft size={16} /> Back to Publish Form
        </Link>
        <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-8">
          Publishing Terms & Conditions
        </h1>
        <div className="prose prose-invert prose-lg max-w-none text-gray-400 font-light leading-relaxed">
          <p>
            Welcome to the Treasures Unveiler Publishing platform. By submitting your manuscript,
            you agree to the following terms and conditions:
          </p>
          
          <h2 className="text-2xl font-bold text-brand-primary mt-12 mb-4">1. Copyright and Ownership</h2>
          <p>
            You retain the full copyright to your work. Treasures Unveiler is granted a non-exclusive license
            to distribute, sell, and promote your book on our platform. You confirm that you are the original
            creator of the work or hold the necessary rights to publish it.
          </p>

          <h2 className="text-2xl font-bold text-brand-primary mt-12 mb-4">2. Royalties and Commissions</h2>
          <p>
            Treasures Unveiler takes a standard commission fee on every sale to cover platform maintenance,
            hosting, and promotional efforts. The remaining percentage (minus payment gateway processing fees)
            will be credited to your author dashboard. You can request a payout once your earnings reach
            the minimum payout threshold.
          </p>

          <h2 className="text-2xl font-bold text-brand-primary mt-12 mb-4">3. Content Guidelines</h2>
          <p>
            We publish books rooted in faith, creativity, and positive youth development. We reserve the right
            to reject submissions that conflict with our core values, promote hate speech, contain explicit
            material, or violate the intellectual property of others.
          </p>

          <h2 className="text-2xl font-bold text-brand-primary mt-12 mb-4">4. Payment Processing</h2>
          <p>
            All book sales are processed via our secure payment partners (e.g., Paystack). Payouts to authors
            will be made to the bank account provided during registration or updated in the author dashboard.
            Authors are responsible for providing accurate payment information.
          </p>

          <h2 className="text-2xl font-bold text-brand-primary mt-12 mb-4">5. Revisions and Takedowns</h2>
          <p>
            You may request to update your manuscript or unpublish your book at any time by contacting the
            Treasures Unveiler Publishing Team. We will process your request within 7 business days.
          </p>

          <p className="mt-12 text-sm text-gray-500">
            Last updated: August 2026. For further questions, please contact our support team.
          </p>
        </div>
      </div>
    </main>
  );
}
