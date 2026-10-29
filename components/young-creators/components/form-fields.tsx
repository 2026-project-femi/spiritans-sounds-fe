import type { ReactNode } from "react";
import { YCN_DEMO_MODE } from "../demo";

export const inputCls = "w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 aria-[invalid=true]:border-destructive";

export function Field({ label, error, hint, children, required, group }: { label: string; error?: string | undefined; hint?: string | undefined; children: ReactNode; required?: boolean | undefined; /** Use for multi-control fields (chips) so the label doesn't hijack clicks. */ group?: boolean | undefined }) {
  const Tag = group ? "div" : "label";
  return (
    <Tag className="block" {...(group ? { role: "group", "aria-label": label } : {})}>
      <span className="mb-1.5 block text-sm font-semibold">{label}{required && <span className="text-primary"> *</span>}</span>
      {children}
      {hint && !error && <span className="mt-1 block text-xs text-muted-foreground">{hint}</span>}
      {error && <span role="alert" className="mt-1 block text-xs font-medium text-destructive">{error}</span>}
    </Tag>
  );
}

export function ChipMulti<T extends string>({ options, value, onChange }: { options: { value: T; label: string }[]; value: T[]; onChange: (v: T[]) => void }) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => {
        const on = value.includes(o.value);
        return (
          <button type="button" key={o.value} aria-pressed={on} onClick={() => onChange(on ? value.filter((x) => x !== o.value) : [...value, o.value])}
            className={`rounded-full border px-3.5 py-1.5 text-sm transition-colors ${on ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background hover:border-foreground/40"}`}>
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

export function Consent({ checked, onChange, error, children }: { checked: boolean; onChange: (v: boolean) => void; error?: string | undefined; children: ReactNode }) {
  return (
    <div>
      <label className="flex items-start gap-3 rounded-xl bg-accent/60 p-4 text-sm">
        <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="mt-0.5 h-4 w-4 accent-[var(--yc-tangerine)]" />
        <span>{children}</span>
      </label>
      {error && <span role="alert" className="mt-1 block text-xs font-medium text-destructive">{error}</span>}
    </div>
  );
}

export function SuccessPanel({ title, reference, children }: { title: string; reference?: string | undefined; children: ReactNode }) {
  return (
    <div className="relative overflow-hidden rounded-3xl border-t-4 border-t-teal bg-card p-10 text-center shadow-xl ring-1 ring-border">
      <div aria-hidden="true" className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full bg-teal/15 blur-3xl" />
      <div aria-hidden="true" className="pointer-events-none absolute -bottom-24 -left-16 h-64 w-64 rounded-full bg-cobalt/10 blur-3xl" />
      <div className="relative mx-auto grid h-16 w-16 place-items-center rounded-full bg-gradient-to-br from-teal to-cobalt text-3xl text-ink-foreground shadow-lg">✓</div>
      <h2 className="relative mt-6 text-3xl font-extrabold tracking-tight">{title}</h2>
      <div className="relative mx-auto mt-3 max-w-md text-muted-foreground">{children}</div>
      {reference && <p className="relative mt-4 text-xs text-muted-foreground">Reference: <span className="font-mono">{reference}</span>{YCN_DEMO_MODE && " (demo)"}</p>}
    </div>
  );
}
