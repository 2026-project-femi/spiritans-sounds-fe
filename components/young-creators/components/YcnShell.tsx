"use client";

import { useState, type ReactNode } from "react";
import { ChevronRight, Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { YcnLink, YCN_PATHS, btn } from "./primitives";
import { ORG } from "../constants";

const NAV = [
  { href: YCN_PATHS.home, label: "Overview" },
  { href: YCN_PATHS.directory, label: "Meet the Creators" },
  { href: YCN_PATHS.mentor, label: "Mentor" },
  { href: YCN_PATHS.opportunity, label: "Offer an Opportunity" },
];

const CRUMBS: Record<string, string> = {
  creators: "Meet the Creators",
  mentor: "Become a Mentor",
  opportunity: "Offer an Opportunity",
  support: "Support",
};

function isActive(pathname: string | null, href: string) {
  if (!pathname) return false;
  if (href === YCN_PATHS.home) return pathname === href || pathname === `${href}/`;
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function YcnSubNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3">
        <YcnLink href={YCN_PATHS.home} className="flex items-center gap-2.5">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary font-display text-sm font-bold text-primary-foreground">YC</span>
          <span className="leading-tight">
            <span className="block font-display text-base font-bold text-foreground">Young Creators</span>
            <span className="block text-[11px] text-muted-foreground">a {ORG.foundationShort} programme</span>
          </span>
        </YcnLink>
        <nav className="hidden items-center gap-1 md:flex">
          {NAV.map((n) => (
            <YcnLink
              key={n.href}
              href={n.href}
              aria-current={isActive(pathname, n.href) ? "page" : undefined}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                isActive(pathname, n.href)
                  ? "bg-ink text-ink-foreground"
                  : "text-foreground/80 hover:bg-secondary hover:text-foreground"
              }`}
            >
              {n.label}
            </YcnLink>
          ))}
          <YcnLink href={YCN_PATHS.support} className={`${btn.primary} ml-2 px-5 py-2`}>Support</YcnLink>
        </nav>
        <button
          type="button"
          className="grid h-11 w-11 place-items-center md:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen(!open)}
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>
      {open && (
        <nav className="flex flex-col gap-1 border-t border-border px-5 py-3 md:hidden">
          {[...NAV, { href: YCN_PATHS.support, label: "Support Young Creators" }].map((n) => (
            <YcnLink
              key={n.href}
              href={n.href}
              onClick={() => setOpen(false)}
              aria-current={isActive(pathname, n.href) ? "page" : undefined}
              className={`rounded-lg px-3 py-2 text-sm font-medium ${isActive(pathname, n.href) ? "bg-secondary text-foreground" : "hover:bg-secondary"}`}
            >
              {n.label}
            </YcnLink>
          ))}
        </nav>
      )}
    </div>
  );
}

export function YcnBreadcrumb() {
  const pathname = usePathname();
  const segments = pathname?.split("/").filter(Boolean) ?? [];
  const section = segments[1];
  const slug = segments[2];
  const crumb =
    section === "creators" && slug
      ? slug.split("-").map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(" ")
      : section && section in CRUMBS
        ? CRUMBS[section]
        : undefined;
  const items = [ORG.parent, ORG.foundationShort, ORG.programme, ...(crumb ? [crumb] : [])];

  return (
    <ol className="mx-auto flex max-w-7xl flex-wrap items-center gap-1 px-5 py-3 text-xs text-muted-foreground">
      {items.map((it, i) => (
        <li key={it} className="flex items-center gap-1">
          {i > 0 && <ChevronRight className="h-3 w-3" />}
          <span className={i === items.length - 1 ? "font-medium text-foreground" : ""}>{it}</span>
        </li>
      ))}
    </ol>
  );
}

export function YcnFooter({ contact }: { contact?: { label: string; href: string } | null | undefined }) {
  return (
    <footer className="mt-24 bg-ink text-ink-foreground">
      <div className="mx-auto grid max-w-7xl gap-8 px-5 py-14 md:grid-cols-3">
        <div>
          <p className="font-display text-xl font-bold">Young Creators Network</p>
          <p className="mt-2 text-sm text-ink-foreground/70">
            A programme of {ORG.foundation}, an arm of{" "}
            <YcnLink href="/" className="underline decoration-ink-foreground/30 underline-offset-2 hover:text-sun">
              Spiritans Sound Outreach
            </YcnLink>.
          </p>
        </div>
        <div className="text-sm text-ink-foreground/70">
          <p className="font-semibold text-ink-foreground">Safeguarding</p>
          <p className="mt-2">Some of our creators are under 18. We never publish personal contact details. All enquiries go through {ORG.foundationShort}.</p>
        </div>
        <div className="flex flex-col gap-2 text-sm">
          {[...NAV, { href: YCN_PATHS.support, label: "Support Young Creators" }].map((n) => (
            <YcnLink key={n.href} href={n.href} className="text-ink-foreground/80 hover:text-sun">{n.label}</YcnLink>
          ))}
          {contact && (
            <a href={contact.href} className="text-ink-foreground/80 hover:text-sun">{contact.label}</a>
          )}
        </div>
      </div>
      <div className="border-t border-ink-foreground/10 px-5 py-5 text-xs text-ink-foreground/50">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 sm:flex-row">
          <span>© {ORG.foundationShort}</span>
          <nav aria-label="Spiritans Sound network" className="flex flex-wrap items-center justify-center gap-4">
            <YcnLink href="/" className="hover:text-sun">Spiritans Sound</YcnLink>
            <YcnLink href="/unveiler" className="hover:text-sun">Treasures Unveiler</YcnLink>
            <YcnLink href="/young-creators" className="text-ink-foreground">Young Creators</YcnLink>
          </nav>
        </div>
      </div>
    </footer>
  );
}

/** Page wrapper kept for compatibility with the prototype pages. */
export function YcnShell({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
