/* eslint-disable @next/next/no-img-element */

import type { LatestPost } from "../types";
import { DemoBadge, SectionHeading, YcnLink, YCN_PATHS } from "./primitives";

const fmt = (d: string) => new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });

export function LatestCreators({ posts }: { posts: LatestPost[] }) {
  return (
    <section className="mx-auto max-w-7xl px-5 py-24">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <SectionHeading eyebrow="Latest from our creators" title="New work, new milestones." tone="teal" />
        <DemoBadge />
      </div>
      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {posts.map((p) => (
          <YcnLink key={p.id} href={YCN_PATHS.creator(p.creatorSlug)} className="group overflow-hidden rounded-3xl bg-card ring-1 ring-border transition-all hover:-translate-y-1 hover:shadow-xl">
            <div className="aspect-[16/10] overflow-hidden">
              <img src={p.image.src} alt={p.image.alt} loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
            </div>
            <div className="p-6">
              <div className="flex items-center gap-2 text-xs">
                <span className="rounded-full bg-accent px-2.5 py-1 font-semibold text-accent-foreground">{p.kind}</span>
                <span className="text-muted-foreground">{fmt(p.date)}</span>
              </div>
              <h3 className="mt-3 text-xl font-bold leading-snug group-hover:text-primary">{p.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{p.excerpt}</p>
            </div>
          </YcnLink>
        ))}
      </div>
    </section>
  );
}
