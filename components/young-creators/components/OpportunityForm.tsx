"use client";

import { useState, type FormEvent } from "react";
import { Loader2 } from "lucide-react";
import type { OpportunityOffer } from "../types";
import { CATEGORIES } from "../constants";
import { opportunitySchema, toFieldErrors, type FieldErrors } from "../lib/schemas";
import { submitOpportunity, type SubmitResult } from "../api/actions";
import { btn } from "./primitives";
import { ChipMulti, Consent, Field, SuccessPanel, inputCls } from "./form-fields";

type Draft = Omit<OpportunityOffer, "safeguardingConsent"> & { safeguardingConsent: boolean };
const EMPTY: Draft = { contactName: "", organisation: "", email: "", phone: "", type: "commission", categories: [], title: "", description: "", location: "", deadline: "", safeguardingConsent: false };

export function OpportunityForm({ onSubmit = submitOpportunity }: { onSubmit?: (d: OpportunityOffer) => Promise<SubmitResult> }) {
  const [d, setD] = useState<Draft>(EMPTY);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState<string | null>(null);
  const set = <K extends keyof Draft>(k: K, v: Draft[K]) => setD((p) => ({ ...p, [k]: v }));

  async function submit(e: FormEvent) {
    e.preventDefault();
    const parsed = opportunitySchema.safeParse(d);
    if (!parsed.success) { setErrors(toFieldErrors(parsed.error)); return; }
    setErrors({}); setBusy(true);
    try {
      const res = await onSubmit(parsed.data as OpportunityOffer);
      if (res.ok) setDone(res.reference);
      else setErrors({ form: res.error });
    } catch {
      setErrors({ form: "Something went wrong. Please try again." });
    } finally {
      setBusy(false);
    }
  }

  if (done) return <SuccessPanel title="Opportunity received" reference={done}>TUYDEF will review it and match it with suitable creators. We&apos;ll contact you before sharing anything with a young person.</SuccessPanel>;

  return (
    <form onSubmit={submit} noValidate className="space-y-6 rounded-3xl bg-card p-6 ring-1 ring-border md:p-10">
      <div className="grid gap-5 md:grid-cols-2">
        <Field label="Your name" required error={errors.contactName}><input className={inputCls} value={d.contactName} onChange={(e) => set("contactName", e.target.value)} aria-invalid={!!errors.contactName} /></Field>
        <Field label="Organisation" required error={errors.organisation}><input className={inputCls} value={d.organisation} onChange={(e) => set("organisation", e.target.value)} aria-invalid={!!errors.organisation} /></Field>
        <Field label="Email" required error={errors.email}><input type="email" className={inputCls} value={d.email} onChange={(e) => set("email", e.target.value)} aria-invalid={!!errors.email} /></Field>
        <Field label="Phone" error={errors.phone}><input className={inputCls} value={d.phone} onChange={(e) => set("phone", e.target.value)} /></Field>
      </div>
      <div className="grid gap-5 md:grid-cols-2">
        <Field label="Type of opportunity"><select className={inputCls} value={d.type} onChange={(e) => set("type", e.target.value as Draft["type"])}>
          {["internship", "commission", "performance", "exhibition", "scholarship", "workshop", "other"].map((t) => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
        </select></Field>
        <Field label="Title" required error={errors.title}><input className={inputCls} value={d.title} onChange={(e) => set("title", e.target.value)} placeholder="e.g. Summer design internship" aria-invalid={!!errors.title} /></Field>
      </div>
      <Field label="Relevant talents" required group error={errors.categories}><ChipMulti options={CATEGORIES} value={d.categories} onChange={(v) => set("categories", v)} /></Field>
      <Field label="Description" required error={errors.description} hint="What's involved, who it suits, and any payment or support offered.">
        <textarea rows={5} className={inputCls} value={d.description} onChange={(e) => set("description", e.target.value)} aria-invalid={!!errors.description} />
      </Field>
      <div className="grid gap-5 md:grid-cols-2">
        <Field label="Location" required error={errors.location}><input className={inputCls} value={d.location} onChange={(e) => set("location", e.target.value)} placeholder="City or 'Online'" aria-invalid={!!errors.location} /></Field>
        <Field label="Deadline"><input type="date" className={inputCls} value={d.deadline} onChange={(e) => set("deadline", e.target.value)} /></Field>
      </div>
      <Consent checked={d.safeguardingConsent} onChange={(v) => set("safeguardingConsent", v)} error={errors.safeguardingConsent}>
        I understand TUYDEF will review this opportunity and handle all contact with creators, including parents/guardians for under-18s.
      </Consent>
      {errors.form && <p className="text-sm text-destructive">{errors.form}</p>}
      <button type="submit" disabled={busy} className={btn.primary}>{busy && <Loader2 className="h-4 w-4 animate-spin" />} Submit opportunity</button>
    </form>
  );
}
