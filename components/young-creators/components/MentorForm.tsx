"use client";

import { useState, type FormEvent } from "react";
import { Loader2 } from "lucide-react";
import type { MentorApplication } from "../types";
import { CATEGORIES } from "../constants";
import { mentorSchema, toFieldErrors, type FieldErrors } from "../lib/schemas";
import { submitMentorApplication, type SubmitResult } from "../api/actions";
import { btn } from "./primitives";
import { ChipMulti, Consent, Field, SuccessPanel, inputCls } from "./form-fields";

type Draft = Omit<MentorApplication, "safeguardingConsent"> & { safeguardingConsent: boolean };
const EMPTY: Draft = { fullName: "", email: "", phone: "", organisation: "", expertise: [], experience: "", availability: "monthly", format: "either", safeguardingConsent: false };

/** `onSubmit` defaults to the demo adapter; pass the real server action when integrating. */
export function MentorForm({ onSubmit = submitMentorApplication }: { onSubmit?: (d: MentorApplication) => Promise<SubmitResult> }) {
  const [d, setD] = useState<Draft>(EMPTY);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState<string | null>(null);
  const set = <K extends keyof Draft>(k: K, v: Draft[K]) => setD((p) => ({ ...p, [k]: v }));

  async function submit(e: FormEvent) {
    e.preventDefault();
    const parsed = mentorSchema.safeParse(d);
    if (!parsed.success) { setErrors(toFieldErrors(parsed.error)); return; }
    setErrors({}); setBusy(true);
    try {
      const res = await onSubmit(parsed.data as MentorApplication);
      if (res.ok) setDone(res.reference);
      else setErrors({ form: res.error });
    } catch {
      setErrors({ form: "Something went wrong. Please try again." });
    } finally {
      setBusy(false);
    }
  }

  if (done) return <SuccessPanel title="Thank you for offering to mentor" reference={done}>Our team will be in touch within two weeks to talk through next steps, including safeguarding checks.</SuccessPanel>;

  return (
    <form onSubmit={submit} noValidate className="space-y-6 rounded-3xl bg-card p-6 ring-1 ring-border md:p-10">
      <div className="grid gap-5 md:grid-cols-2">
        <Field label="Full name" required error={errors.fullName}><input className={inputCls} value={d.fullName} onChange={(e) => set("fullName", e.target.value)} aria-invalid={!!errors.fullName} /></Field>
        <Field label="Email" required error={errors.email}><input type="email" className={inputCls} value={d.email} onChange={(e) => set("email", e.target.value)} aria-invalid={!!errors.email} /></Field>
        <Field label="Phone" error={errors.phone}><input className={inputCls} value={d.phone} onChange={(e) => set("phone", e.target.value)} /></Field>
        <Field label="Organisation / profession"><input className={inputCls} value={d.organisation} onChange={(e) => set("organisation", e.target.value)} /></Field>
      </div>
      <Field label="Areas you can mentor in" required group error={errors.expertise}><ChipMulti options={CATEGORIES} value={d.expertise} onChange={(v) => set("expertise", v)} /></Field>
      <Field label="Your experience" required error={errors.experience} hint="What have you done in your field, and why do you want to mentor?">
        <textarea rows={5} className={inputCls} value={d.experience} onChange={(e) => set("experience", e.target.value)} aria-invalid={!!errors.experience} />
      </Field>
      <div className="grid gap-5 md:grid-cols-2">
        <Field label="Availability"><select className={inputCls} value={d.availability} onChange={(e) => set("availability", e.target.value as Draft["availability"])}>
          <option value="weekly">Weekly</option><option value="fortnightly">Fortnightly</option><option value="monthly">Monthly</option><option value="project">Per project</option>
        </select></Field>
        <Field label="Format"><select className={inputCls} value={d.format} onChange={(e) => set("format", e.target.value as Draft["format"])}>
          <option value="in-person">In person</option><option value="online">Online</option><option value="either">Either</option>
        </select></Field>
      </div>
      <Consent checked={d.safeguardingConsent} onChange={(v) => set("safeguardingConsent", v)} error={errors.safeguardingConsent}>
        I understand some creators are under 18. I agree to TUYDEF safeguarding checks and that all mentoring contact is arranged through TUYDEF.
      </Consent>
      {errors.form && <p className="text-sm text-destructive">{errors.form}</p>}
      <button type="submit" disabled={busy} className={btn.primary}>{busy && <Loader2 className="h-4 w-4 animate-spin" />} Submit application</button>
    </form>
  );
}
