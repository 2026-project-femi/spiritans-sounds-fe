/* eslint-disable @next/next/no-img-element */

import { ArrowLeft, MapPin, ShieldCheck, Sparkles } from "lucide-react";
import type { Creator } from "../types";
import { categoryLabel, ORG } from "../constants";
import { DemoBadge, YcnLink, YCN_PATHS, btn } from "./primitives";
import { TalentTags } from "./TalentTags";
import { Achievements, CreativeWorks, CreatorGallery, CreatorInterview, ProfileBlock, VideoInterview } from "./CreatorProfileSections";
import { ProfileNav } from "./ProfileNav";

const PROFILE_SECTIONS = [
  ["about", "About"], ["gifts", "Gifts & Talents"], ["discovery", "Discovery"], ["interview", "Meet the Creator"],
  ["works", "Creative Works"], ["achievements", "Achievements"], ["gallery", "Gallery"],
] as const;

export function CreatorProfile({ creator }: { creator: Creator }) {
  const first = creator.publicDisplayName.split(" ")[0] ?? creator.publicDisplayName;
  return (
    <article className="mx-auto max-w-7xl px-5">
      <YcnLink href={YCN_PATHS.directory} className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="h-4 w-4" /> All creators</YcnLink>

      <header className="mt-6 grid items-end gap-10 md:grid-cols-[1fr_1.2fr]">
        <img src={creator.portrait.src} alt={creator.portrait.alt} width={800} height={1008} className="aspect-[4/5] w-full rounded-[2rem] object-cover" />
        <div className="pb-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-primary px-3 py-1 text-xs font-bold text-primary-foreground">{categoryLabel(creator.primaryCategory)}</span>
            <span className="rounded-full bg-ink px-3 py-1 text-xs font-bold text-ink-foreground">Class of {creator.classYear}</span>
            <DemoBadge when={creator.isDemo} />
          </div>
          <h1 className="mt-5 break-words text-4xl font-extrabold sm:text-5xl md:text-7xl">{creator.publicDisplayName}</h1>
          {creator.location && <p className="mt-3 flex items-center gap-1 text-muted-foreground"><MapPin className="h-4 w-4" /> {creator.location}</p>}
          <p className="mt-6 text-2xl leading-snug text-foreground/85">{creator.tagline}</p>
          <div className="mt-6"><TalentTags tags={creator.talents} size="md" /></div>
          <div className="mt-8 flex flex-wrap gap-3">
            <YcnLink href={YCN_PATHS.opportunity} className={btn.primary}>Offer {first} an opportunity</YcnLink>
            <YcnLink href={YCN_PATHS.support} className={btn.outline}>Support creators like {first}</YcnLink>
          </div>
        </div>
      </header>

      <ProfileNav items={PROFILE_SECTIONS} variant="mobile" />

      <div className="mt-10 grid gap-12 lg:mt-16 lg:grid-cols-[220px_1fr]">
        <aside className="hidden lg:block">
          <div className="sticky top-24">
            <ProfileNav items={PROFILE_SECTIONS} />
            <div className="mt-6 rounded-2xl bg-accent p-4 text-xs text-accent-foreground">
              <ShieldCheck className="mb-2 h-5 w-5" />
              To contact {first} about opportunities, please go through {ORG.foundationShort}. We never share creators&apos; personal details.
            </div>
          </div>
        </aside>

        <div className="min-w-0">
          <ProfileBlock id="about" eyebrow="About" title={`Meet ${first}`}>
            <div className="space-y-4 text-lg leading-relaxed text-foreground/85">{creator.bio.map((p, i) => <p key={i}>{p}</p>)}</div>
          </ProfileBlock>
          <ProfileBlock id="gifts" eyebrow="Gifts & Talents" title="What makes their work special">
            <div className="flex gap-4 rounded-3xl bg-gradient-to-br from-primary/10 to-teal/10 p-8"><Sparkles className="h-6 w-6 shrink-0 text-primary" /><p className="text-lg">{creator.giftsAndTalents}</p></div>
          </ProfileBlock>
          <ProfileBlock id="discovery" eyebrow="Discovered & recognised" title={`How we met ${first}`}>
            <p className="text-lg leading-relaxed text-foreground/85">{creator.discoveryStory}</p>
          </ProfileBlock>
          <ProfileBlock id="interview" eyebrow="Meet the Creator" title="In their own words">
            <VideoInterview
              videoUrl={creator.videoUrl ?? creator.latestUpdateVideo?.url}
              poster={creator.videoPoster ?? creator.portrait}
              name={first}
              label={
                creator.videoUrl
                  ? `Watch: Meet ${first}`
                  : creator.latestUpdateVideo
                    ? `Watch: ${creator.latestUpdateVideo.title}`
                    : undefined
              }
            />
            <div className="mt-8"><CreatorInterview items={creator.interview} name={first} /></div>
          </ProfileBlock>
          <ProfileBlock id="works" eyebrow="Portfolio" title="Creative works"><CreativeWorks works={creator.works} /></ProfileBlock>
          <ProfileBlock id="achievements" eyebrow="Journey" title="Activities & achievements"><Achievements items={creator.achievements} /></ProfileBlock>
          <ProfileBlock id="gallery" eyebrow="Gallery" title="Moments"><CreatorGallery items={creator.gallery} /></ProfileBlock>
          <div className="rounded-2xl bg-accent p-5 text-sm text-accent-foreground lg:hidden">
            To contact {first} about opportunities, please go through {ORG.foundationShort}. We never share creators&apos; personal details.
          </div>
        </div>
      </div>
    </article>
  );
}
