"use client";

import { useState, type FormEvent } from "react";
import { Loader2, Lock, Mic2, Palette, Sparkles, Users } from "lucide-react";
import type { SupportCurrency, SupportIntent } from "../types";
import { supportSchema, toFieldErrors, type FieldErrors } from "../lib/schemas";
import { type CheckoutResult } from "../api/actions";
import { btn } from "./primitives";
import { YCN_DEMO_MODE } from "../demo";
import { Field, SuccessPanel, inputCls } from "./form-fields";

const PRESET_AMOUNTS: Record<SupportCurrency, number[]> = {
  NGN: [10000, 25000, 60000, 150000],
  GBP: [10, 25, 50, 100],
  USD: [15, 30, 60, 120],
};
const IMPACT_PRESETS = [
  { icon: Palette, label: "Art materials" },
  { icon: Users, label: "Mentoring support" },
  { icon: Sparkles, label: "Workshop access" },
  { icon: Mic2, label: "Showcase stage" },
] as const;
const SYMBOL: Record<SupportCurrency, string> = { NGN: "₦", GBP: "£", USD: "$" };
const DESIGNATIONS = [
  { value: "general", label: "Where most needed" }, { value: "mentorship", label: "Mentoring" },
  { value: "equipment", label: "Tools & materials" }, { value: "showcase", label: "Showcases & events" },
] as const;

const seg = (on: boolean) => `flex-1 rounded-full px-4 py-2 text-sm font-semibold transition-colors ${on ? "bg-ink text-ink-foreground" : "text-foreground/70 hover:text-foreground"}`;

/** UI + validation only. The page passes the real Paystack/Stripe checkout action. */
export function SupportYoungCreators({ onCheckout }: { onCheckout: (intent: SupportIntent) => Promise<CheckoutResult> }) {
  const [currency, setCurrency] = useState<SupportCurrency>("NGN");
  const [frequency, setFrequency] = useState<SupportIntent["frequency"]>("one-off");
  const [amount, setAmount] = useState<number | "">(25000);
  const [designation, setDesignation] = useState<SupportIntent["designation"]>("general");
  const [donorName, setName] = useState("");
  const [donorEmail, setEmail] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState<string | null>(null);
  const selectedImpactIndex = PRESET_AMOUNTS[currency].indexOf(Number(amount));
  const selectedImpact = selectedImpactIndex >= 0 ? IMPACT_PRESETS[selectedImpactIndex] : null;

  const switchCurrency = (c: SupportCurrency) => {
    setCurrency(c);
    setAmount(PRESET_AMOUNTS[c][1] ?? "");
    if (c === "NGN") setFrequency("one-off");
  };

  async function submit(e: FormEvent) {
    e.preventDefault();
    const parsed = supportSchema.safeParse({ amount: amount === "" ? undefined : amount, currency, frequency, designation, donorName, donorEmail });
    if (!parsed.success) { setErrors(toFieldErrors(parsed.error)); return; }
    setErrors({}); setBusy(true);
    try {
      const res = await onCheckout(parsed.data as SupportIntent);
      if (!res.ok) {
        setErrors({ form: res.error });
        return;
      }
      if (res.redirectUrl) {
        window.location.href = res.redirectUrl;
        return;
      }
      if (YCN_DEMO_MODE) {
        setDone(res.provider === "paystack" ? "Paystack" : "Stripe");
        return;
      }
      setErrors({ form: "Checkout could not be started. Please try again." });
    } catch {
      setErrors({ form: "Something went wrong. Please try again." });
    } finally {
      setBusy(false);
    }
  }

  if (done) return <SuccessPanel title={YCN_DEMO_MODE ? "Demo checkout complete" : "Thank you"}>{YCN_DEMO_MODE ? <>In the live site you would now be taken to secure <strong>{done}</strong> checkout. No payment was taken.</> : "Your gift is being processed."}</SuccessPanel>;

  return (
    <form onSubmit={submit} noValidate className="space-y-7 rounded-3xl border-t-4 border-t-primary bg-card p-6 shadow-xl ring-1 ring-border md:p-10">
      <div className="flex flex-col gap-3 border-b border-border pb-5 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="font-display text-2xl font-extrabold tracking-tight">Make a gift</p>
          <p className="mt-1 text-sm text-muted-foreground">Choose an amount and see the difference it could make.</p>
        </div>
        <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-teal/15 px-3 py-1 text-xs font-semibold text-teal">
          <Lock className="h-3.5 w-3.5" /> Secure
        </span>
      </div>
      <div>
        <div className="flex rounded-full bg-secondary p-1">
          {(["one-off", "monthly"] as const).map((f) => {
            const disabled = f === "monthly" && currency === "NGN";
            return (
              <button
                type="button"
                key={f}
                aria-pressed={frequency === f}
                disabled={disabled}
                title={disabled ? "Monthly giving is available in GBP or USD" : undefined}
                className={`${seg(frequency === f)} ${disabled ? "cursor-not-allowed opacity-40" : ""}`}
                onClick={() => { if (!disabled) setFrequency(f); }}
              >
                {f === "one-off" ? "Give once" : "Give monthly"}
              </button>
            );
          })}
        </div>
        {currency === "NGN" && <p className="mt-2 text-xs text-muted-foreground">Monthly giving is available in GBP or USD. NGN gifts are one-off.</p>}
      </div>
      <div>
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <span className="text-sm font-semibold">Amount</span>
          <div className="flex gap-1 rounded-full bg-secondary p-1 text-xs">
            {(["NGN", "GBP", "USD"] as const).map((c) => <button type="button" key={c} aria-pressed={currency === c} onClick={() => switchCurrency(c)} className={`rounded-full px-3 py-1 font-semibold transition-colors ${currency === c ? "bg-ink text-ink-foreground shadow" : "text-muted-foreground hover:text-foreground"}`}>{c}</button>)}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {PRESET_AMOUNTS[currency].map((p, index) => {
            const impact = IMPACT_PRESETS[index] ?? IMPACT_PRESETS[0];
            const Icon = impact.icon;
            const on = amount === p;
            return (
              <button
                type="button"
                key={p}
                aria-pressed={on}
                onClick={() => setAmount(p)}
                className={`group flex min-h-[132px] flex-col items-start justify-between rounded-2xl border-2 p-4 text-left transition-all ${
                  on
                    ? "border-primary bg-primary/10 shadow-[0_12px_30px_-18px_var(--yc-tangerine)]"
                    : "border-border bg-background hover:-translate-y-0.5 hover:border-foreground/30"
                }`}
              >
                <span className={`grid h-9 w-9 place-items-center rounded-xl ${on ? "bg-primary text-primary-foreground" : "bg-secondary text-foreground/70"}`}>
                  <Icon className="h-4 w-4" />
                </span>
                <span>
                  <span className={`block font-display text-xl font-extrabold ${on ? "text-primary" : ""}`}>{SYMBOL[currency]}{p.toLocaleString()}</span>
                  <span className="mt-1 block text-xs leading-snug text-muted-foreground">{impact.label}</span>
                </span>
              </button>
            );
          })}
        </div>
        <div className="relative mt-3">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">{SYMBOL[currency]}</span>
          <input type="number" min={1} inputMode="numeric" placeholder="Other amount" value={amount} onChange={(e) => setAmount(e.target.value === "" ? "" : Number(e.target.value))} className={`${inputCls} pl-9`} aria-label="Custom amount" />
        </div>
        <p aria-live="polite" className="mt-3 flex items-start gap-2 rounded-2xl bg-accent/60 p-3 text-xs text-foreground/80">
          <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
          {selectedImpact
            ? <>Your gift could help fund <strong className="font-semibold text-foreground">{selectedImpact.label.toLowerCase()}</strong>.</>
            : "Your gift will be directed to where it is needed most."}
        </p>
        {errors.amount && <p className="mt-1 text-xs text-destructive">{errors.amount}</p>}
      </div>
      <Field label="Direct my gift to">
        <select className={inputCls} value={designation} onChange={(e) => setDesignation(e.target.value as SupportIntent["designation"])}>
          {DESIGNATIONS.map((d) => <option key={d.value} value={d.value}>{d.label}</option>)}
        </select>
      </Field>
      <div className="grid gap-5 md:grid-cols-2">
        <Field label="Your name" required error={errors.donorName}><input className={inputCls} value={donorName} onChange={(e) => setName(e.target.value)} /></Field>
        <Field label="Email for receipt" required error={errors.donorEmail}><input type="email" className={inputCls} value={donorEmail} onChange={(e) => setEmail(e.target.value)} /></Field>
      </div>
      {errors.form && <p role="alert" className="text-sm font-medium text-destructive">{errors.form}</p>}
      <button type="submit" disabled={busy} className={`${btn.primary} w-full py-4 text-base`}>
        {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Lock className="h-4 w-4" />}
        Give {amount ? `${SYMBOL[currency]}${Number(amount).toLocaleString()}` : ""} {frequency === "monthly" ? "monthly" : ""}
      </button>
      <p className="text-center text-xs text-muted-foreground">Secure checkout via {currency === "NGN" ? "Paystack" : "Stripe"}.{YCN_DEMO_MODE && " Demo mode — no payment is taken."}</p>
    </form>
  );
}
