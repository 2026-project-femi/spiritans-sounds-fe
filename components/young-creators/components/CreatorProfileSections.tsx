"use client";

/* eslint-disable @next/next/no-img-element */


import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, ExternalLink, Play, Trophy, X } from "lucide-react";
import type { Achievement, CreativeWork, InterviewQA, MediaItem } from "../types";
import { Eyebrow } from "./primitives";
import { getYouTubeEmbedUrl, isYouTubeUrl } from "@/lib/youtube";

export function ProfileBlock({ id, eyebrow, title, children }: { id?: string; eyebrow: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-24 border-t border-border py-14">
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2 className="text-3xl font-bold md:text-4xl">{title}</h2>
      <div className="mt-6">{children}</div>
    </section>
  );
}

export function CreatorInterview({ items, name }: { items: InterviewQA[]; name: string }) {
  return (
    <div className="space-y-6">
      {items.map((qa) => (
        <div key={qa.question} className="rounded-2xl bg-card p-6 ring-1 ring-border">
          <p className="font-display font-bold text-teal">{qa.question}</p>
          <p className="mt-2 text-lg text-foreground/90">“{qa.answer}” <span className="text-sm text-muted-foreground">— {name}</span></p>
        </div>
      ))}
    </div>
  );
}

/** Pass a YouTube/Vimeo URL to render a real player. */
export function VideoInterview({ videoUrl, poster, name, label }: { videoUrl?: string | undefined; poster?: MediaItem | undefined; name: string; label?: string | undefined }) {
  const [playing, setPlaying] = useState(false);
  const embedUrl = videoUrl
    ? isYouTubeUrl(videoUrl)
      ? getYouTubeEmbedUrl(videoUrl) ?? undefined
      : videoUrl
    : undefined;
  const heading = label ?? (embedUrl ? `Watch: Meet ${name}` : "Video interview coming soon");

  if (embedUrl && playing) {
    return <div className="aspect-video overflow-hidden rounded-3xl bg-ink"><iframe src={embedUrl} title={`Video: ${name}`} className="h-full w-full" allow="autoplay; encrypted-media" allowFullScreen /></div>;
  }
  const Tag = embedUrl ? "button" : "div";
  return (
    <Tag {...(embedUrl ? { type: "button" as const, onClick: () => setPlaying(true), "aria-label": `Play video for ${name}` } : {})} className="group relative block aspect-video w-full overflow-hidden rounded-3xl bg-ink text-left">
      {poster && <img src={poster.src} alt={poster.alt} loading="lazy" className="h-full w-full object-cover opacity-60 transition-transform duration-500 group-hover:scale-105" />}
      <div className="absolute inset-0 grid place-items-center">
        <span className={`grid h-16 w-16 place-items-center rounded-full md:h-20 md:w-20 ${embedUrl ? "bg-primary" : "bg-muted-foreground/60"} text-primary-foreground shadow-2xl transition-transform group-hover:scale-110`}><Play className="ml-1 h-7 w-7" /></span>
      </div>
      <p className="absolute bottom-5 left-6 right-6 text-sm font-medium text-ink-foreground">{heading}</p>
    </Tag>
  );
}

export function CreativeWorks({ works }: { works: CreativeWork[] }) {
  return (
    <div className="grid gap-5 sm:grid-cols-2">
      {works.map((w) => (
        <article key={w.id} className="group overflow-hidden rounded-3xl bg-card ring-1 ring-border transition-shadow hover:shadow-lg">
          {w.image ? (
            <div className="aspect-[16/10] overflow-hidden"><img src={w.image.src} alt={w.image.alt} loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" /></div>
          ) : (
            <div className="grid aspect-[16/10] place-items-center bg-gradient-to-br from-accent to-secondary"><span className="font-display text-2xl font-bold text-accent-foreground">{w.type}</span></div>
          )}
          <div className="p-6">
            <p className="text-xs font-semibold uppercase tracking-wider text-primary">{w.type} · {w.year}</p>
            <h3 className="mt-2 text-xl font-bold">{w.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{w.description}</p>
            {w.href && <a href={w.href} target="_blank" rel="noreferrer" className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-teal">View work <ExternalLink className="h-3.5 w-3.5" /></a>}
          </div>
        </article>
      ))}
    </div>
  );
}

export function Achievements({ items }: { items: Achievement[] }) {
  return (
    <ol className="relative space-y-6 border-l-2 border-border pl-8">
      {items.map((a, i) => (
        <li key={i} className="relative">
          <span className="absolute -left-[42px] grid h-7 w-7 place-items-center rounded-full bg-sun text-ink"><Trophy className="h-3.5 w-3.5" /></span>
          <p className="text-sm font-bold text-primary">{a.year}</p>
          <p className="text-lg font-semibold">{a.title}</p>
          {a.detail && <p className="text-sm text-muted-foreground">{a.detail}</p>}
        </li>
      ))}
    </ol>
  );
}

export function CreatorGallery({ items }: { items: MediaItem[] }) {
  const [idx, setIdx] = useState<number | null>(null);
  useEffect(() => {
    if (idx === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIdx(null);
      if (e.key === "ArrowRight") setIdx((i) => (i === null ? i : (i + 1) % items.length));
      if (e.key === "ArrowLeft") setIdx((i) => (i === null ? i : (i - 1 + items.length) % items.length));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [idx, items.length]);

  return (
    <>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
        {items.map((m, i) => (
          <button type="button" key={i} aria-label={`Open photo ${i + 1}: ${m.alt}`} onClick={() => setIdx(i)} className={`group overflow-hidden rounded-2xl ${i === 0 ? "row-span-2" : ""}`}>
            <img src={m.src} alt={m.alt} loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
          </button>
        ))}
      </div>
      {idx !== null && items[idx] && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/95 p-4" role="dialog" aria-modal="true" aria-label="Photo viewer" onClick={() => setIdx(null)}>
          <button type="button" autoFocus aria-label="Close" className="absolute right-5 top-5 text-ink-foreground"><X className="h-7 w-7" /></button>
          <button aria-label="Previous" type="button" className="absolute left-2 z-10 rounded-full bg-ink/60 p-1 text-ink-foreground md:left-4" onClick={(e) => { e.stopPropagation(); setIdx((idx - 1 + items.length) % items.length); }}><ChevronLeft className="h-10 w-10" /></button>
          <figure className="max-h-full max-w-5xl" onClick={(e) => e.stopPropagation()}>
            <img src={items[idx]!.src} alt={items[idx]!.alt} className="max-h-[80vh] max-w-full rounded-2xl object-contain" />
            {items[idx]!.caption && <figcaption className="mt-3 text-center text-sm text-ink-foreground/80">{items[idx]!.caption}</figcaption>}
          </figure>
          <button aria-label="Next" type="button" className="absolute right-2 z-10 rounded-full bg-ink/60 p-1 text-ink-foreground md:right-4" onClick={(e) => { e.stopPropagation(); setIdx((idx + 1) % items.length); }}><ChevronRight className="h-10 w-10" /></button>
        </div>
      )}
    </>
  );
}