/* eslint-disable @next/next/no-img-element */

import { ArrowRight, Quote } from "lucide-react";
import type { Creator } from "../types";
import { categoryLabel } from "../constants";
import { DemoBadge, Eyebrow, YcnLink, YCN_PATHS, btn } from "./primitives";
import { TalentTags } from "./TalentTags";

export function CreatorSpotlight({ creator }: { creator: Creator }) {
  const quote = creator.interview[0];
  return (
    <section className="bg-ink py-24 text-ink-foreground">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 md:grid-cols-2">
        <div className="relative">
          <img src={creator.portrait.src} alt={creator.portrait.alt} loading="lazy" width={800} height={1008} className="aspect-[4/5] w-full rounded-[2rem] object-cover" />
          <div className="absolute -bottom-5 -right-3 rounded-2xl bg-primary px-5 py-3 font-display font-bold text-primary-foreground shadow-xl md:-right-6">Creator Spotlight</div>
        </div>
        <div>
          <Eyebrow tone="sun">{categoryLabel(creator.primaryCategory)} · Class of {creator.classYear}</Eyebrow>
          <h2 className="flex flex-wrap items-center gap-3 break-words text-4xl font-bold md:text-6xl">{creator.publicDisplayName} <DemoBadge when={creator.isDemo} /></h2>
          <p className="mt-4 text-xl text-ink-foreground/80">{creator.tagline}</p>
          {quote && (
            <blockquote className="mt-8 border-l-2 border-primary pl-6">
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
