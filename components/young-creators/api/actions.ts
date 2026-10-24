/**
 * Young Creators Network — client-safe write adapters.
 *
 * This module intentionally has no demo/catalogue imports so client forms do
 * not pull the creator dataset into the browser bundle. Replace these bodies
 * with Next.js server actions or calls to the site's existing checkout.
 */
import type { MentorApplication, OpportunityOffer, SupportIntent } from "../types";

export type SubmitResult = { ok: true; reference: string } | { ok: false; error: string };

export type CheckoutResult =
  | { ok: true; provider: "paystack" | "stripe"; redirectUrl: string | null }
  | { ok: false; error: string };

const delay = (ms = 250) => new Promise((r) => setTimeout(r, ms));

export async function submitMentorApplication(data: MentorApplication): Promise<SubmitResult> {
  // TODO(backend): POST to a server action -> payload.create({ collection: "ycn-mentor-applications", data })
  // and trigger the existing email/notification to the TUYDEF safeguarding lead.
  await delay(700);
  console.info("[YCN demo] mentor application", data);
  return { ok: true, reference: `MEN-${Date.now().toString(36).toUpperCase()}` };
}

export async function submitOpportunity(data: OpportunityOffer): Promise<SubmitResult> {
  // TODO(backend): payload.create({ collection: "ycn-opportunities", data }) — reviewed by TUYDEF before any creator is contacted.
  await delay(700);
  console.info("[YCN demo] opportunity", data);
  return { ok: true, reference: `OPP-${Date.now().toString(36).toUpperCase()}` };
}

/**
 * Hand-off to the EXISTING payment infrastructure. Do not build a new one.
 * Expected real implementation: call the site's existing checkout initialiser
 * (Paystack for NGN, Stripe for GBP/USD) with metadata `{ programme: "young-creators", designation }`
 * and return its redirect URL. Confirmation arrives via the existing webhooks.
 */
export async function startSupportCheckout(intent: SupportIntent): Promise<CheckoutResult> {
  await delay(600);
  const provider = intent.currency === "NGN" ? "paystack" : "stripe";
  console.info(`[YCN demo] would start ${provider} checkout`, intent);
  return { ok: true, provider, redirectUrl: null };
}
