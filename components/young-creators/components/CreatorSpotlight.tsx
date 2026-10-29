/* eslint-disable @next/next/no-img-element */

import { ArrowRight, Quote } from "lucide-react";
import type { Creator } from "../types";
import { categoryLabel } from "../constants";
import { DemoBadge, Eyebrow, Sticker, YcnLink, YCN_PATHS, btn } from "./primitives";
import { TalentTags } from "./TalentTags";

export function CreatorSpotlight({ creator }: { creator: Creator }) {
  const quote = creator.interview[0];
  return (
    <section className="relative overflow-hidden bg-ink py-24 text-ink-foreground">
      <div aria-hidden="true" className="yc-float pointer-events-none absolute -left-28 top-10 h-72 w-72 rounded-full bg-cobalt/25 blur-3xl" />
      <div aria-hidden="true" className="pointer-events-none absolute -bottom-24 -right-20 h-80 w-80 rounded-full bg-lilac/20 blur-3xl" />
      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 md:grid-cols-2">
        <div className="relative">
          <div aria-hidden="true" className="absolute -inset-2 -rotate-2 rounded-[2.2rem] border border-sun/30" />
          <img src={creator.portrait.src} alt={creator.portrait.alt} loading="lazy" width={800} height={1008} className="relative aspect-[4/5] w-full rounded-[2rem] object-cover" />
          <Sticker tone="primary" className="absolute -bottom-5 -right-3 md:-right-6">Creator spotlight</Sticker>
        </div>
        <div>
          <Eyebrow tone="sun">{categoryLabel(creator.primaryCategory)} · Class of {creator.classYear}</Eyebrow>
          <h2 className="flex flex-wrap items-center gap-3 break-words text-4xl font-bold md:text-6xl">{creator.publicDisplayName} <DemoBadge when={creator.isDemo} /></h2>
          <p className="mt-4 text-xl text-ink-foreground/80">{creator.tagline}</p>
          {quote && (
            <blockquote className="mt-8 rounded-r-3xl border-l-2 border-primary bg-white/5 py-2 pl-6 pr-4">
              <Quote className="mb-2 h-6 w-6 text-primary" />
              <p className="text-lg italic text-ink-foreground/90">&ldquo;{quote.answer}&rdquo;</p>
            </blockquote>
          )}
          <div className="mt-8"><TalentTags tags={creator.talents} size="md" /></div>
          <YcnLink href={YCN_PATHS.creator(creator.slug)} className={`${btn.primary} mt-10`}>Read {creator.publicDisplayName.split(" ")[0]}&apos;s story <ArrowRight className="h-4 w-4" /></YcnLink>
        </div>
      </div>
    </section>
  );
}
