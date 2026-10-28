/**
 * Young Creators Network — shared form result contracts.
 *
 * Implementations live in `../server/actions.ts` (server actions) and must be
 * passed into the client forms by their pages. There is no demo fallback: a form
 * can only submit through the real server action.
 */

export type SubmitResult = { ok: true; reference: string } | { ok: false; error: string };

export type CheckoutResult =
  | { ok: true; provider: "paystack" | "stripe"; redirectUrl: string | null }
  | { ok: false; error: string };
