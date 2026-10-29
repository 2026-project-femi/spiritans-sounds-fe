/* eslint-disable @next/next/no-img-element */

import { Award, Compass, GraduationCap, Sparkles } from "lucide-react";
import type { ImpactStat } from "../types";
import { SectionHeading } from "./primitives";

const PILLARS = [
  { icon: Compass, title: "Young Talent Discovered", text: "Finding gifted young people in schools, parishes and communities." },
  { icon: Award, title: "Creativity Recognised", text: "Celebrating their gifts publicly so their work is seen and valued." },
  { icon: GraduationCap, title: "Mentorship & Training", text: "Pairing creators with experienced mentors, workshops and tools." },
  { icon: Sparkles, title: "Creative Opportunities", text: "Opening doors to stages, exhibitions, commissions and scholarships." },
];

/**
 * Works with no numbers. Pass verified `stats` (from getImpactStats) to show
 * headline figures above the pillars — never invent figures.
 */
export function ImpactSection({ stats = [], image }: { stats?: ImpactStat[] | undefined; image: string }) {
  return (
    <section className="mx-auto max-w-7xl px-5 py-24">
      <div className="grid items-center gap-12 lg:grid-cols-2">
        <div className="min-w-0">
          <SectionHeading eyebrow="Your support at work" title="What your support makes possible." intro="Every gift funds mentoring sessions, creative materials, showcase stages and the next opportunity for a young person with something to say." />
          {stats.length > 0 && (
            <div className="mt-10 grid grid-cols-2 gap-4">
              {stats.map((s) => (
                <div key={s.label} className="rounded-2xl bg-card p-6 ring-1 ring-border">
                  <p className="font-display text-4xl font-extrabold text-primary md:text-5xl">{s.value}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{s.label}</p>
                </div>
              ))}
            </div>
          )}
          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {PILLARS.map(({ icon: Icon, title, text }) => (
              <div key={title} className="rounded-2xl bg-card p-6 ring-1 ring-border">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-primary/10 text-primary"><Icon className="h-5 w-5" /></span>
                <p className="mt-4 font-display text-lg font-bold">{title}</p>
                <p className="mt-1 text-sm text-muted-foreground">{text}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="relative">
          <div aria-hidden="true" className="absolute -inset-3 rotate-2 rounded-[2.4rem] bg-gradient-to-br from-primary/25 via-sun/25 to-teal/25" />
          <img src={image} alt="Mentor guiding young creators at a workshop" loading="lazy" width={1200} height={800} className="relative aspect-[4/3] w-full rounded-[2rem] object-cover shadow-2xl" />
        </div>
      </div>
    </section>
  );
}
