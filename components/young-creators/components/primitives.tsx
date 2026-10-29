/* eslint-disable @next/next/no-img-element */

/**
 * Small portable primitives. The ONLY router coupling in the module is YcnLink,
 * which uses Next.js `next/link`.
 */
import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { YCN_DEMO_MODE } from "../demo";

export const YCN_PATHS = {
  home: "/young-creators",
  directory: "/young-creators/creators",
  creator: (slug: string) => `/young-creators/creators/${slug}`,
  support: "/young-creators/support",
  mentor: "/young-creators/mentor",
  opportunity: "/young-creators/opportunity",
};

export function YcnLink(props: ComponentProps<typeof Link>) {
  return <Link {...props} />;
}

/** Official Treasures Unveiler / Young Creators logo. */
export function YcnLogo({ className = "h-11 w-11" }: { className?: string }) {
  return (
    <img
      src="/young-creators/logo.jpeg"
      alt="Treasures Unveiler Youth Development Foundation"
      width={88}
      height={88}
      className={`shrink-0 object-contain ${className}`}
    />
  );
}

const base = "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-60";
export const btn = {
  primary: `${base} bg-primary text-primary-foreground shadow-[0_10px_30px_-12px_var(--yc-tangerine)] hover:-translate-y-0.5 hover:brightness-105`,
  ink: `${base} bg-ink text-ink-foreground hover:-translate-y-0.5 hover:opacity-90`,
  outline: `${base} border border-foreground/20 text-foreground hover:border-foreground hover:bg-foreground/5`,
  light: `${base} border border-ink-foreground/30 text-ink-foreground hover:bg-ink-foreground/10`,
};

export function Eyebrow({ children, tone = "tangerine" }: { children: ReactNode; tone?: "tangerine" | "teal" | "sun" | undefined }) {
  const color = tone === "teal" ? "text-teal" : tone === "sun" ? "text-sun" : "text-primary";
  return <p className={`mb-3 text-xs font-bold uppercase tracking-[0.2em] ${color}`}>{children}</p>;
}

export function SectionHeading({ eyebrow, title, intro, tone, light }: { eyebrow?: string; title: ReactNode; intro?: ReactNode; tone?: "tangerine" | "teal" | "sun" | undefined; light?: boolean }) {
  return (
    <div className="max-w-2xl">
      {eyebrow && <Eyebrow tone={tone}>{eyebrow}</Eyebrow>}
      <h2 className={`text-3xl font-bold leading-tight md:text-5xl ${light ? "text-ink-foreground" : "text-foreground"}`}>{title}</h2>
      {intro && <p className={`mt-4 text-lg ${light ? "text-ink-foreground/75" : "text-muted-foreground"}`}>{intro}</p>}
    </div>
  );
}

/** Renders nothing when YCN_DEMO_MODE is false. */
export function DemoBadge({ className = "", when = true }: { className?: string; when?: boolean | undefined }) {
  if (!YCN_DEMO_MODE || !when) return null;
  return (
    <span className={`inline-flex items-center rounded-full bg-sun px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-ink ${className}`} title="Temporary demo content">
      Demo
    </span>
  );
}

