/* eslint-disable @next/next/no-img-element */

import { ArrowUpRight, MapPin } from "lucide-react";
import type { Creator } from "../types";
import { categoryLabel } from "../constants";
import { DemoBadge, Sticker, YcnLink, YCN_PATHS } from "./primitives";
import { TalentTags } from "./TalentTags";

export function CreatorCard({
  creator,
  className = "",
  imageClassName = "aspect-[4/5]",
  feature = false,
}: {
  creator: Creator;
  className?: string;
  imageClassName?: string;
  feature?: boolean;
}) {
  return (
    <YcnLink href={YCN_PATHS.creator(creator.slug)} className={`group block overflow-hidden rounded-3xl border border-border bg-card transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_24px_50px_-24px_var(--yc-ink)] ${className}`}>
      <div className={`relative overflow-hidden ${imageClassName}`}>
        <img src={creator.portrait.src} alt={creator.portrait.alt} loading="lazy" width={800} height={1008} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-ink/80 to-transparent" />
        <span className="absolute left-4 top-4 rounded-full bg-background/90 px-3 py-1 text-xs font-semibold text-foreground">{categoryLabel(creator.primaryCategory)}</span>
        {feature ? <Sticker tone="sun" className="absolute right-4 top-4">Spotlight</Sticker> : <DemoBadge when={creator.isDemo} className="absolute right-4 top-4" />}
        <div className="absolute inset-x-4 bottom-4 flex items-end justify-between text-ink-foreground">
          <div>
            <p className={`font-display font-bold ${feature ? "text-3xl md:text-4xl" : "text-2xl"}`}>{creator.publicDisplayName}</p>
            <p className="flex items-center gap-1 text-xs opacity-80">{creator.location && <><MapPin className="h-3 w-3" />{creator.location} · </>}Class of {creator.classYear}</p>
          </div>
          <span className="grid h-10 w-10 place-items-center rounded-full bg-primary text-primary-foreground transition-transform group-hover:rotate-45"><ArrowUpRight className="h-5 w-5" /></span>
        </div>
      </div>
      <div className="space-y-3 p-5">
        <p className={`text-muted-foreground ${feature ? "line-clamp-3 text-base" : "line-clamp-2 text-sm"}`}>{creator.tagline}</p>
        <TalentTags tags={creator.talents.slice(0, feature ? 4 : 3)} />
      </div>
    </YcnLink>
  );
}
