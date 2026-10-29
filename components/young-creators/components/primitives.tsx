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
  primary: `${base} bg-primary text-primary-foreground shadow-[0_14px_36px_-14px_var(--yc-tangerine)] hover:-translate-y-0.5 hover:brightness-105 active:translate-y-0`,
  ink: `${base} bg-ink text-ink-foreground hover:-translate-y-0.5 hover:opacity-90 active:translate-y-0`,
  outline: `${base} border border-foreground/20 text-foreground hover:border-foreground hover:bg-foreground/5`,
  light: `${base} border border-ink-foreground/30 text-ink-foreground hover:bg-ink-foreground/10`,
  sun: `${base} bg-sun text-ink shadow-[0_14px_36px_-16px_var(--yc-sun)] hover:-translate-y-0.5 hover:brightness-105 active:translate-y-0`,
  teal: `${base} bg-teal text-ink-foreground shadow-[0_14px_36px_-16px_var(--yc-teal)] hover:-translate-y-0.5 hover:brightness-105 active:translate-y-0`,
};

const eyebrowTone = {
  tangerine: "text-primary",
  teal: "text-teal",
  sun: "text-sun",
  cobalt: "text-cobalt",
  lilac: "text-lilac",
} as const;

export type EyebrowTone = keyof typeof eyebrowTone;

export function Eyebrow({ children, tone = "tangerine" }: { children: ReactNode; tone?: EyebrowTone | undefined }) {
  return (
    <p className={`mb-3 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.22em] md:text-xs ${eyebrowTone[tone]}`}>
      <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-current" />
      {children}
    </p>
  );
}

export function SectionHeading({ eyebrow, title, intro, tone, light }: { eyebrow?: string; title: ReactNode; intro?: ReactNode; tone?: EyebrowTone | undefined; light?: boolean }) {
  return (
    <div className="max-w-2xl">
      {eyebrow && <Eyebrow tone={tone}>{eyebrow}</Eyebrow>}
      <h2 className={`text-4xl font-extrabold leading-[1.02] tracking-[-0.035em] [text-wrap:balance] md:text-6xl ${light ? "text-ink-foreground" : "text-foreground"}`}>{title}</h2>
      {intro && <p className={`mt-5 max-w-xl text-lg leading-relaxed ${light ? "text-ink-foreground/75" : "text-muted-foreground"}`}>{intro}</p>}
    </div>
  );
}

/** Small rotated label for editorial accents. */
export function Sticker({ children, className = "", tone = "sun" }: { children: ReactNode; className?: string; tone?: "sun" | "primary" | "teal" | "cobalt" | "lilac" | undefined }) {
  const tones = {
    sun: "bg-sun text-ink",
    primary: "bg-primary text-primary-foreground",
    teal: "bg-teal text-ink-foreground",
    cobalt: "bg-cobalt text-white",
    lilac: "bg-lilac text-ink",
  } as const;
  return (
    <span className={`inline-flex -rotate-2 items-center rounded-full px-3 py-1.5 font-display text-xs font-bold uppercase tracking-[0.12em] shadow-lg ${tones[tone]} ${className}`}>
      {children}
    </span>
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

