"use client";

import { useState } from "react";
import { Check, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export interface RegistrationValues {
  fullName: string;
  email: string;
  whatsapp?: string;
  country?: string;
  bookSlug?: string;
  bookTitle?: string;
  source?: string;
}

export default function LaunchRegistrationForm() {
  const [values, setValues] = useState({
    fullName: "",
    email: "",
    whatsapp: "",
    country: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [successMessage, setSuccessMessage] = useState("You're on the list.");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const set = (key: keyof typeof values) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setValues((v) => ({ ...v, [key]: e.target.value }));
    if (errorMessage) setErrorMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;

    if (!values.fullName.trim() || values.fullName.trim().length < 2) {
      setErrorMessage("Please enter your full name (at least 2 characters).");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!values.email.trim() || !emailRegex.test(values.email.trim())) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }

    setSubmitting(true);
    setErrorMessage(null);

    try {
      const res = await fetch("/api/unveiler/launch-registrations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: values.fullName.trim(),
          email: values.email.trim(),
          whatsapp: values.whatsapp.trim(),
          country: values.country.trim(),
          bookSlug: "behind-the-veil",
          bookTitle: "Behind the Veil",
          source: "landing-page",
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong. Please try again.");
      }

      setSuccessMessage(
        data.alreadyRegistered
          ? "You're already registered! We've updated your confirmation details."
          : "You're on the guest list! Details and access links will follow by email."
      );
      setDone(true);
    } catch (err: unknown) {
      setErrorMessage(
        err instanceof Error ? err.message : "Failed to register. Please check your connection and try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (done) {
    return (
      <div className="text-center space-y-4 py-8 animate-fadeIn">
        <div className="mx-auto size-16 rounded-full bg-brand-primary/15 text-brand-primary border border-brand-primary/30 flex items-center justify-center shadow-lg shadow-brand-primary/10">
          <Check className="size-8" strokeWidth={2.5} />
        </div>
        <h3 className="font-serif text-2xl sm:text-3xl text-white font-bold tracking-tight">
          You&apos;re on the list.
        </h3>
        <p className="text-sm sm:text-base text-gray-300 max-w-[42ch] mx-auto leading-relaxed">
          {successMessage} We&apos;ll email your private access link and a reminder before the online launch on 21 November 2026.
        </p>
      </div>
    );
  }

  const fieldLabel =
    "text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-gray-300";

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      {errorMessage && (
        <div className="flex items-start gap-2.5 p-3 rounded-md bg-red-950/60 border border-red-500/40 text-red-200 text-xs sm:text-sm">
          <AlertCircle className="size-4 shrink-0 mt-0.5 text-red-400" />
          <span>{errorMessage}</span>
        </div>
      )}

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <label htmlFor="btv-name" className={fieldLabel}>
            Full name <span className="text-brand-primary">*</span>
          </label>
          <Input
            id="btv-name"
            autoComplete="name"
            required
            value={values.fullName}
            onChange={set("fullName")}
            placeholder="Your full name"
            maxLength={120}
            className="mt-1.5 h-11 sm:h-12 rounded-md bg-white/5 border-white/15 text-white placeholder:text-gray-500 focus:border-brand-primary focus:ring-brand-primary/30 text-sm"
          />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="btv-email" className={fieldLabel}>
            Email address <span className="text-brand-primary">*</span>
          </label>
          <Input
            id="btv-email"
            type="email"
            inputMode="email"
            autoComplete="email"
            required
            value={values.email}
            onChange={set("email")}
            placeholder="you@example.com"
            maxLength={255}
            className="mt-1.5 h-11 sm:h-12 rounded-md bg-white/5 border-white/15 text-white placeholder:text-gray-500 focus:border-brand-primary focus:ring-brand-primary/30 text-sm"
          />
        </div>
        <div>
          <label htmlFor="btv-whatsapp" className={fieldLabel}>
            WhatsApp <span className="font-normal normal-case tracking-normal text-gray-400">(optional)</span>
          </label>
          <Input
            id="btv-whatsapp"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            value={values.whatsapp}
            onChange={set("whatsapp")}
            placeholder="+234 800 000 0000"
            maxLength={30}
            className="mt-1.5 h-11 sm:h-12 rounded-md bg-white/5 border-white/15 text-white placeholder:text-gray-500 focus:border-brand-primary focus:ring-brand-primary/30 text-sm"
          />
        </div>
        <div>
          <label htmlFor="btv-country" className={fieldLabel}>
            Country <span className="font-normal normal-case tracking-normal text-gray-400">(optional)</span>
          </label>
          <Input
            id="btv-country"
            autoComplete="country-name"
            value={values.country}
            onChange={set("country")}
            placeholder="Nigeria"
            maxLength={80}
            className="mt-1.5 h-11 sm:h-12 rounded-md bg-white/5 border-white/15 text-white placeholder:text-gray-500 focus:border-brand-primary focus:ring-brand-primary/30 text-sm"
          />
        </div>
      </div>

      <Button
        type="submit"
        size="lg"
        disabled={submitting}
        className="w-full h-12 sm:h-14 rounded-md bg-brand-primary text-white hover:bg-brand-primary/90 text-xs sm:text-sm font-semibold uppercase tracking-[0.14em] sm:tracking-[0.18em] shadow-lg shadow-brand-primary/20 transition-all cursor-pointer"
      >
        {submitting ? (
          <span className="inline-flex items-center gap-2">
            <Loader2 className="size-4 animate-spin" /> Registering…
          </span>
        ) : (
          "Register for the Online Launch"
        )}
      </Button>
      <p className="text-[0.72rem] text-gray-400 text-center leading-relaxed">
        Your details are kept strictly confidential and used only to deliver your launch link and reminders.
      </p>
    </form>
  );
}
