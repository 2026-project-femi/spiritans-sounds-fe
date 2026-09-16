"use client";

import { useMemo, useSyncExternalStore } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  CalendarDays,
  ChevronLeft,
  Clock,
  Eye,
  Handshake,
  Headphones,
  Heart,
  MapPin,
  Monitor,
  Phone,
  PlayCircle,
  Quote,
  Search,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Countdown from "@/components/btv/Countdown";
import LaunchRegistrationForm from "@/components/btv/LaunchRegistrationForm";
import { btvConfig } from "@/config/behindTheVeil";

import { timeStore } from "@/lib/timeStore";

const icons = {
  eye: Eye,
  search: Search,
  heart: Heart,
  "shield-alert": ShieldAlert,
  "shield-check": ShieldCheck,
  handshake: Handshake,
} as const;

const useLaunched = () => {
  const { mode, dateISO } = btvConfig.launch;
  const target = useMemo(() => new Date(dateISO).getTime(), [dateISO]);

  const now = useSyncExternalStore(
    timeStore.subscribe,
    timeStore.getSnapshot,
    timeStore.getServerSnapshot
  );

  return mode === "post-launch" || (mode === "auto" && now > 0 && now >= target);
};

const scrollTo = (id: string) => () =>
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });

/** Renders a YouTube / Vimeo / .mp4 link as a responsive 16:9 embed. */
const VideoEmbed = ({ src, title }: { src: string; title: string }) => {
  const embedUrl = (() => {
    try {
      const u = new URL(src);
      const host = u.hostname.replace("www.", "");
      if (host === "youtube.com" && u.searchParams.get("v")) {
        return `https://www.youtube-nocookie.com/embed/${u.searchParams.get("v")}`;
      }
      if (host === "youtu.be") {
        return `https://www.youtube-nocookie.com/embed${u.pathname}`;
      }
      if (host === "vimeo.com") {
        return `https://player.vimeo.com/video${u.pathname}`;
      }
      if (src.endsWith(".mp4")) return null;
      return src;
    } catch {
      return src;
    }
  })();

  if (embedUrl === null) {
    return (
      <video
        controls
        title={title}
        className="absolute inset-0 size-full object-cover"
        src={src}
      />
    );
  }

  return (
    <iframe
      src={embedUrl}
      title={title}
      loading="lazy"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
      className="absolute inset-0 size-full"
    />
  );
};

const SectionHead = ({
  eyebrow,
  title,
  intro,
  light = false,
  center = false,
}: {
  eyebrow: string;
  title: string;
  intro?: string;
  light?: boolean;
  center?: boolean;
}) => (
  <div className={`max-w-3xl ${center ? "mx-auto text-center" : ""}`}>
    <span
      className={`eyebrow ${center ? "justify-center" : ""} ${light ? "text-brand-primary" : ""}`}
    >
      {eyebrow}
    </span>
    <h2
      className={`display mt-3 sm:mt-5 text-2xl min-[380px]:text-3xl sm:text-4xl md:text-5xl leading-[1.12] ${
        light ? "text-white" : "text-foreground"
      }`}
    >
      {title}
    </h2>
    {intro && (
      <p
        className={`mt-3 sm:mt-4 text-sm sm:text-base md:text-lg leading-relaxed ${
          light ? "text-white/70" : "text-muted-foreground"
        }`}
      >
        {intro}
      </p>
    )}
  </div>
);

export default function BehindTheVeilView() {
  const launched = useLaunched();
  const {
    book,
    launch,
    formats,
    audio,
    discover,
    author,
    testimonials,
    faq,
    videos,
    finalCta,
    nigeriaBookshops,
    brand,
    cta,
    sections,
    gallery,
    social,
  } = btvConfig;
  const galleryItems = gallery.filter((g) => g.src);
  const socialLinks = social.links.filter((s) => s.url);
  const availableFormats = formats.filter((f) => f.available);

  return (
    <div className="btv-funnel min-h-screen bg-background text-foreground">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-md focus:bg-brand-primary focus:px-4 focus:py-2 focus:text-white"
      >
        Skip to content
      </a>

      {/* ---------------------------------------------------------- sticky bar */}
      <header className="sticky top-0 z-50 bg-[#0c0c0e]/95 backdrop-blur-md border-b border-white/10 text-white">
        <div className="max-w-6xl mx-auto px-3.5 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-2 sm:gap-4">
          <div className="min-w-0 flex items-center gap-2 sm:gap-3.5">
            <Link
              href="/unveiler/books"
              className="inline-flex items-center gap-1 text-xs text-gray-400 hover:text-white transition-colors group shrink-0"
              title="Return to Treasures Unveiler Library"
            >
              <ChevronLeft className="size-4 group-hover:-translate-x-0.5 transition-transform" />
              <span className="hidden md:inline">Treasures Unveiler</span>
              <span className="md:hidden text-[11px] font-medium">Library</span>
            </Link>
            <div className="h-4 w-px bg-white/20 shrink-0" />
            <div className="min-w-0">
              <p className="font-serif text-sm sm:text-base md:text-lg font-bold leading-none truncate text-white">
                {brand.shortTitle}
              </p>
              <p className="text-[0.58rem] sm:text-[0.62rem] uppercase tracking-[0.16em] text-gray-400 mt-0.5 sm:mt-1 truncate hidden min-[380px]:block">
                {book.author}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2.5">
            {!launched && (
              <Button
                onClick={scrollTo("launch")}
                variant="outline"
                className="hidden sm:inline-flex h-9 sm:h-10 rounded-md border-white/20 bg-transparent text-white hover:bg-white/10 hover:text-white text-[0.65rem] sm:text-[0.68rem] font-semibold uppercase tracking-[0.14em]"
              >
                {cta.registerShort}
              </Button>
            )}
            <Button
              onClick={scrollTo("purchase")}
              className="h-9 sm:h-10 rounded-md bg-brand-primary text-white hover:bg-brand-primary/90 text-[0.65rem] sm:text-[0.68rem] font-semibold uppercase tracking-[0.14em] px-3 sm:px-4 shadow-md shadow-brand-primary/25 cursor-pointer whitespace-nowrap"
            >
              {cta.buy}
            </Button>
          </div>
        </div>
      </header>

      <main id="main">
        {/* ------------------------------------------------------------- 1. HERO */}
        <section className="relative overflow-hidden bg-[#08080a] text-white">
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "linear-gradient(160deg, rgba(20,20,20,0.95) 0%, rgba(10,10,10,0.98) 60%, rgba(48,8,10,0.6) 100%)",
            }}
          />
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(60% 50% at 50% 40%, rgba(219, 23, 23, 0.28) 0%, transparent 70%)",
            }}
          />
          <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-20 md:py-28 grid lg:grid-cols-[1.05fr_0.95fr] gap-10 lg:gap-16 items-center">
            <div className="space-y-6 sm:space-y-7 animate-rise">
              <div className="inline-flex items-center gap-2 rounded-full border border-brand-primary/50 bg-brand-primary/10 px-3.5 py-1.5 backdrop-blur-sm">
                <Sparkles className="size-3 text-brand-primary shrink-0" strokeWidth={2} />
                <span className="text-[0.58rem] min-[400px]:text-[0.62rem] sm:text-[0.68rem] font-semibold uppercase tracking-[0.18em] sm:tracking-[0.22em] text-white/90">
                  {launched ? cta.badgePostLaunch : `${cta.badgePreLaunch} · ${launch.dateLabel}`}
                </span>
              </div>

              <div>
                <h1 className="display text-3xl min-[380px]:text-4xl sm:text-6xl md:text-7xl text-white uppercase font-black leading-[0.98] break-words">
                  {book.heroTitleTop}
                  <br />
                  <span className="text-brand-primary">{book.heroTitleAccent}</span>
                </h1>
                <p className="mt-3 sm:mt-5 font-serif italic text-lg min-[380px]:text-xl sm:text-2xl md:text-3xl text-white/85 text-balance">
                  {book.subtitle}
                </p>
                <p className="mt-2 sm:mt-3 text-[0.68rem] sm:text-xs uppercase tracking-[0.18em] sm:tracking-[0.22em] text-white/60">
                  By {book.author}
                </p>
              </div>

              <div className="pt-1">
                <span className="rule-red" />
                <p className="mt-4 sm:mt-5 font-serif text-lg min-[380px]:text-xl sm:text-2xl md:text-[2.15rem] leading-[1.18] text-white text-balance">
                  {book.heroHeadline}
                </p>
                <p className="mt-3 sm:mt-4 text-white/70 text-sm sm:text-base leading-relaxed max-w-[54ch]">
                  {book.heroIntro}
                </p>
              </div>

              {!launched && (
                <div className="space-y-2.5 pt-1">
                  <p className="text-[0.58rem] sm:text-[0.62rem] font-semibold uppercase tracking-[0.18em] sm:tracking-[0.22em] text-white/50">
                    {sections.launch.heroCountdownLabel}
                  </p>
                  <Countdown targetISO={launch.dateISO} tone="light" />
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                {!launched ? (
                  <>
                    <Button
                      size="lg"
                      onClick={scrollTo("launch")}
                      className="w-full sm:w-auto h-12 sm:h-14 rounded-md bg-brand-primary text-white hover:bg-brand-primary/90 text-xs sm:text-[0.72rem] font-semibold uppercase tracking-[0.14em] sm:tracking-[0.18em] px-6 sm:px-7 shadow-lg shadow-brand-primary/30 cursor-pointer"
                    >
                      {cta.register}
                    </Button>
                    <Button
                      size="lg"
                      variant="outline"
                      onClick={scrollTo("purchase")}
                      className="w-full sm:w-auto h-12 sm:h-14 rounded-md border-white/25 bg-white/5 text-white hover:bg-white hover:text-black text-xs sm:text-[0.72rem] font-semibold uppercase tracking-[0.14em] sm:tracking-[0.18em] px-6 sm:px-7 cursor-pointer"
                    >
                      {cta.buy}
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      size="lg"
                      onClick={scrollTo("purchase")}
                      className="w-full sm:w-auto h-12 sm:h-14 rounded-md bg-brand-primary text-white hover:bg-brand-primary/90 text-xs sm:text-[0.72rem] font-semibold uppercase tracking-[0.14em] sm:tracking-[0.18em] px-6 sm:px-7 shadow-lg shadow-brand-primary/30 cursor-pointer"
                    >
                      {cta.buy}
                    </Button>
                    {launch.replayUrl && (
                      <Button
                        asChild
                        size="lg"
                        variant="outline"
                        className="w-full sm:w-auto h-12 sm:h-14 rounded-md border-white/25 bg-transparent text-white hover:bg-white hover:text-black text-xs sm:text-[0.72rem] font-semibold uppercase tracking-[0.14em] sm:tracking-[0.18em] px-6 sm:px-7"
                      >
                        <a href={launch.replayUrl}>{cta.watchReplay}</a>
                      </Button>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* 3D Case-bound hardcover book mockup */}
            <div className="relative flex justify-center lg:justify-end animate-fade pt-4 lg:pt-0">
              <div className="relative mb-4 sm:mb-8 pt-2 sm:pt-5">
                <div
                  className="absolute -inset-8 pointer-events-none"
                  style={{
                    background:
                      "radial-gradient(circle, rgba(219, 23, 23, 0.35) 0%, transparent 70%)",
                  }}
                />

                <div className="relative w-[210px] min-[360px]:w-[240px] -rotate-1 sm:w-[300px] md:w-[340px] lg:w-[380px] mx-auto">
                  {/* Page block edge */}
                  <div
                    className="absolute -right-4 top-3 bottom-[-0.15rem] w-6 rounded-r-xs border-y-2 border-r-2 border-[#6d050c] bg-stone-100 shadow-book"
                    aria-hidden="true"
                  >
                    <div className="absolute inset-y-2 left-1 w-px bg-stone-300" />
                    <div className="absolute inset-y-2 right-1 w-px bg-stone-300" />
                  </div>
                  {/* Hardcover bevel frame */}
                  <div
                    className="absolute -inset-[5px] rounded-xs border-[5px] border-[#6d050c] bg-[#6d050c] shadow-book"
                    aria-hidden="true"
                  />
                  {/* Spine hinge line */}
                  <div
                    className="absolute inset-y-0 left-0 z-10 w-3 rounded-l-xs bg-[#6d050c]/80"
                    aria-hidden="true"
                  >
                    <div className="absolute inset-y-3 right-0 w-px bg-white/30" />
                  </div>
                  <Image
                    src={book.coverImage}
                    alt={book.coverAlt}
                    width={520}
                    height={780}
                    priority
                    className="relative z-[1] block w-full rounded-xs shadow-2xl h-auto"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* --------------------------------------------------------- 2. THE BOOK */}
        <section id="the-book" className="section-pad bg-white">
          <div className="max-w-6xl mx-auto">
            <SectionHead
              eyebrow={sections.book.eyebrow}
              title={sections.book.title}
            />
            <div className="mt-12 grid lg:grid-cols-[1.15fr_0.85fr] gap-12 lg:gap-16">
              <div className="space-y-6">
                {book.description.map((p) => (
                  <p key={p.slice(0, 24)} className="text-base sm:text-lg leading-relaxed text-gray-800">
                    {p}
                  </p>
                ))}

                <div className="pt-6">
                  <h3 className="text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-brand-primary">
                    {sections.book.themesHeading}
                  </h3>
                  <div className="mt-4 flex flex-wrap gap-2.5">
                    {book.themes.map((t) => (
                      <span
                        key={t}
                        className="rounded-full border border-gray-200 bg-stone-50 px-4 py-2 text-xs sm:text-[0.82rem] font-medium text-gray-800"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                <figure className="mt-8 border-l-3 border-brand-primary pl-6 py-2 bg-stone-50/70 rounded-r-md">
                  <blockquote className="font-serif italic text-lg sm:text-xl leading-relaxed text-gray-900">
                    “{book.excerpt.split("\n\n")[0]}”
                  </blockquote>
                  <figcaption className="mt-3 text-[0.68rem] uppercase tracking-[0.2em] text-gray-500 font-semibold">
                    {sections.book.excerptCaption}
                  </figcaption>
                </figure>
              </div>

              {/* Publication metadata aside */}
              <aside className="rounded-xl border border-gray-200 bg-stone-50 p-5 sm:p-8 h-fit lg:sticky lg:top-24 shadow-xs">
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-gray-950">
                  {sections.book.publicationHeading}
                </h3>
                <span className="rule-red mt-3 sm:mt-4" />
                <dl className="mt-5 sm:mt-6 space-y-3 sm:space-y-4 text-xs sm:text-sm">
                  {[
                    ["Publisher", book.publication.publisher],
                    ["Imprint", book.publication.imprint],
                    ["Publication date", book.publication.publicationDate],
                    ["Language", book.publication.language],
                    ["Pages", book.publication.pages],
                    ["ISBN", book.publication.isbn],
                    ["Category", book.publication.category],
                  ].map(([k, v]) => (
                    <div key={k} className="flex flex-col min-[380px]:flex-row min-[380px]:justify-between gap-1 min-[380px]:gap-6 border-b border-gray-200/80 pb-2.5 sm:pb-3 last:border-0">
                      <dt className="text-gray-500 shrink-0">{k}</dt>
                      <dd className="text-left min-[380px]:text-right font-semibold text-gray-900">{v}</dd>
                    </div>
                  ))}
                </dl>
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <p className="text-[0.65rem] uppercase tracking-[0.2em] text-gray-500 font-semibold">
                    {sections.book.availableInLabel}
                  </p>
                  <p className="mt-2 font-bold text-gray-900">
                    {availableFormats.map((f) => f.name).join(" · ")}
                  </p>
                  <Button
                    onClick={scrollTo("purchase")}
                    className="mt-5 w-full h-12 rounded-md bg-brand-primary text-white hover:bg-brand-primary/90 text-[0.68rem] font-semibold uppercase tracking-[0.16em] cursor-pointer"
                  >
                    {cta.buy}
                  </Button>
                </div>
              </aside>
            </div>
          </div>
        </section>

        {/* ------------------------------------------------------- 3. DISCOVER */}
        <section id="discover" className="section-pad bg-stone-50 border-y border-gray-200/80">
          <div className="max-w-6xl mx-auto">
            <SectionHead
              center
              eyebrow={sections.discover.eyebrow}
              title={sections.discover.title}
              intro={sections.discover.intro}
            />
            <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {discover.map((item, i) => {
                const Icon = icons[item.icon as keyof typeof icons] ?? Eye;
                return (
                  <article
                    key={item.title}
                    className="group relative rounded-xl border border-gray-200/80 bg-white p-7 sm:p-8 transition-all duration-300 hover:-translate-y-1 hover:border-brand-primary/40 hover:shadow-soft"
                  >
                    <span className="absolute right-6 top-6 font-serif text-sm text-gray-400 tabular-nums font-bold">
                      0{i + 1}
                    </span>
                    <span className="inline-flex size-12 items-center justify-center rounded-lg bg-red-50 text-brand-primary transition-colors duration-300 group-hover:bg-brand-primary group-hover:text-white">
                      <Icon className="size-5" strokeWidth={1.75} />
                    </span>
                    <h3 className="mt-6 font-serif text-xl sm:text-[1.35rem] leading-snug font-bold text-gray-950">
                      {item.title}
                    </h3>
                    <p className="mt-3 text-sm sm:text-[0.95rem] leading-relaxed text-gray-600">
                      {item.body}
                    </p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        {/* -------------------------------------------------- 4. WHY I WROTE IT */}
        <section id="why" className="section-pad bg-[#0c0c0e] text-white">
          <div className="max-w-6xl mx-auto grid lg:grid-cols-[0.85fr_1.15fr] gap-12 lg:gap-16 items-center">
            <div className="relative max-w-sm mx-auto lg:max-w-none">
              <span className="absolute -inset-3 -z-10 border border-brand-primary/40 rounded-lg" aria-hidden="true" />
              <Image
                src={author.photo}
                alt={author.photoAlt}
                width={400}
                height={500}
                className="w-full rounded-md object-cover aspect-[4/5] shadow-book h-auto"
              />
            </div>
            <div>
              <span className="eyebrow">{sections.why.eyebrow}</span>
              <h2 className="display mt-5 text-3xl sm:text-4xl md:text-5xl text-white leading-[1.08] font-bold">
                {author.whyTitle}
              </h2>
              <div className="mt-7 space-y-5">
                {author.whyBody.map((p) => (
                  <p key={p.slice(0, 24)} className="text-gray-300 text-base sm:text-lg leading-relaxed">
                    {p}
                  </p>
                ))}
              </div>
              <p className="mt-8 font-serif italic text-xl text-white font-medium">— {author.name}</p>
            </div>
          </div>
        </section>

        {/* ------------------------------------------------- 5. ABOUT THE AUTHOR */}
        <section id="author" className="section-pad bg-white">
          <div className="max-w-6xl mx-auto">
            <SectionHead eyebrow={sections.author.eyebrow} title={author.name} />
            <p className="mt-4 text-[0.72rem] uppercase tracking-[0.22em] text-brand-primary font-bold">
              {author.role}
            </p>
            <div className="mt-10 grid lg:grid-cols-[1.2fr_0.8fr] gap-12">
              <div className="space-y-5">
                {author.bio.map((p) => (
                  <p key={p.slice(0, 24)} className="text-base sm:text-lg leading-relaxed text-gray-700">
                    {p}
                  </p>
                ))}
                <div className="pt-3">
                  <Link
                    href={author.otherPublicationsUrl}
                    className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.16em] text-brand-primary hover:gap-3 transition-all"
                  >
                    {cta.otherPublications}
                    <ArrowRight className="size-4" strokeWidth={2} />
                  </Link>
                </div>
              </div>
              <div className="rounded-xl border border-gray-200 bg-stone-50 p-7 h-fit shadow-xs">
                <Image
                  src={author.photo}
                  alt={author.photoAlt}
                  width={300}
                  height={300}
                  className="w-full rounded-lg object-cover aspect-square h-auto"
                />
                <p className="mt-5 font-serif text-xl font-bold text-gray-900">{author.name}</p>
                <p className="mt-1 text-sm text-gray-600">{author.role}</p>
                <p className="mt-4 text-xs text-gray-500 leading-relaxed">
                  {brand.footerNote}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ------------------------------------------------------ 6. THE LAUNCH (FUNNEL REGISTRATION) */}
        <section id="launch" className="relative section-pad bg-[#08080a] text-white overflow-hidden">
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(60% 50% at 50% 30%, rgba(219, 23, 23, 0.25) 0%, transparent 70%)",
            }}
          />
          <div className="relative max-w-6xl mx-auto grid lg:grid-cols-[1fr_0.9fr] gap-12 lg:gap-16 items-start">
            <div>
              <span className="eyebrow">{sections.launch.eyebrow}</span>
              <h2 className="display mt-5 text-4xl sm:text-5xl md:text-6xl text-white uppercase leading-[0.98] font-black">
                {sections.launch.titleLine1}
                <br />
                <span className="text-brand-primary">{sections.launch.titleLine2}</span>
              </h2>
              <p className="mt-5 font-serif text-2xl sm:text-3xl text-white/90 font-semibold">
                {launch.dateLabel}
              </p>

              <div className="mt-8 space-y-4 max-w-md">
                {[
                  { Icon: CalendarDays, label: "Date", value: launch.dateLabel },
                  { Icon: Clock, label: "Time", value: launch.timeLabel },
                  { Icon: Monitor, label: "Platform", value: launch.platformLabel },
                ].map(({ Icon, label, value }) => (
                  <div
                    key={label}
                    className="flex items-center gap-4 border-b border-white/10 pb-4"
                  >
                    <Icon className="size-5 text-brand-primary shrink-0" strokeWidth={1.75} />
                    <div>
                      <p className="text-[0.62rem] uppercase tracking-[0.2em] text-white/50">{label}</p>
                      <p className="text-sm sm:text-base text-white/90 font-medium">{value}</p>
                    </div>
                  </div>
                ))}
              </div>

              {!launched ? (
                <div className="mt-9 space-y-3">
                  <p className="text-[0.62rem] font-semibold uppercase tracking-[0.22em] text-white/50">
                    {sections.launch.countdownLabel}
                  </p>
                  <Countdown targetISO={launch.dateISO} tone="light" />
                </div>
              ) : (
                <div className="mt-9 rounded-lg border border-brand-primary/40 bg-brand-primary/10 p-6">
                  <p className="font-serif text-2xl text-white font-bold">{sections.launch.postLaunchNote}</p>
                  <p className="mt-2 text-white/70 text-sm">
                    {sections.launch.postLaunchThanks}
                  </p>
                </div>
              )}
            </div>

            {/* Registration Form Box */}
            <div className="rounded-xl bg-[#141417] border border-white/10 text-white p-5 sm:p-9 shadow-book">
              {!launched ? (
                <>
                  <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white">
                    {sections.launch.registerHeading}
                  </h3>
                  <p className="mt-2 text-sm text-gray-300 leading-relaxed">
                    {sections.launch.registerIntro}
                  </p>
                  <div className="mt-6">
                    <LaunchRegistrationForm />
                  </div>
                </>
              ) : (
                <>
                  <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white">
                    {sections.launch.postLaunchHeading}
                  </h3>
                  <p className="mt-2 text-sm text-gray-300 leading-relaxed">
                    {sections.launch.postLaunchIntro}
                    {launch.replayUrl ? ", or watch the replay below." : "."}
                  </p>
                  <div className="mt-6 space-y-3">
                    <Button
                      onClick={scrollTo("purchase")}
                      className="w-full h-14 rounded-md bg-brand-primary text-white hover:bg-brand-primary/90 text-[0.72rem] font-semibold uppercase tracking-[0.18em] cursor-pointer"
                    >
                      {cta.buy}
                    </Button>
                    {launch.replayUrl && (
                      <Button asChild variant="outline" className="w-full h-14 rounded-md text-[0.72rem] font-semibold uppercase tracking-[0.18em] border-white/20 bg-transparent text-white hover:bg-white/10">
                        <a href={launch.replayUrl}>{cta.watchReplay}</a>
                      </Button>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </section>

        {/* -------------------------------------------------------- 7. PURCHASE */}
        <section id="purchase" className="section-pad bg-white">
          <div className="max-w-6xl mx-auto">
            <SectionHead
              center
              eyebrow={sections.purchase.eyebrow}
              title={sections.purchase.title}
              intro={sections.purchase.intro}
            />
            <div
              className={`mt-14 grid gap-6 ${
                availableFormats.length === 1
                  ? "max-w-md mx-auto"
                  : availableFormats.length === 2
                    ? "sm:grid-cols-2 max-w-3xl mx-auto"
                    : "sm:grid-cols-2 lg:grid-cols-3"
              }`}
            >
              {availableFormats.map((f) => (
                <article
                  key={f.id}
                  className={`relative flex flex-col rounded-xl border p-7 sm:p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-soft ${
                    f.featured ? "border-brand-primary bg-red-50/20" : "border-gray-200 bg-stone-50/50"
                  }`}
                >
                  {f.featured && (
                    <span className="absolute -top-3 left-7 rounded-full bg-brand-primary px-3 py-1 text-[0.58rem] font-semibold uppercase tracking-[0.18em] text-white">
                      {sections.purchase.featuredBadge}
                    </span>
                  )}
                  <BookOpen className="size-6 text-brand-primary" strokeWidth={1.75} />
                  <h3 className="mt-5 font-serif text-2xl font-bold text-gray-950">{f.name}</h3>
                  <p className="mt-2 text-sm text-gray-600 leading-relaxed">{f.description}</p>
                  <p className="mt-6 font-serif text-3xl font-extrabold text-gray-900">{f.price}</p>
                  {f.priceNote && (
                    <p className="mt-1 text-xs text-gray-500">{f.priceNote}</p>
                  )}
                  <ul className="mt-6 space-y-2.5 flex-1">
                    {f.details.map((d) => (
                      <li key={d} className="flex items-start gap-2.5 text-sm text-gray-700">
                        <span className="mt-1.5 size-1.5 rounded-full bg-brand-primary shrink-0" />
                        {d}
                      </li>
                    ))}
                  </ul>
                  <Button
                    asChild
                    className="mt-7 h-14 rounded-md bg-brand-primary text-white hover:bg-brand-primary/90 text-[0.72rem] font-semibold uppercase tracking-[0.18em] shadow-md shadow-brand-primary/20 cursor-pointer"
                  >
                    <a href={f.checkoutUrl}>{cta.buyNow}</a>
                  </Button>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ----------------------------------------------- 7b. NIGERIA BOOKSHOPS */}
        <section id="nigeria-bookshops" className="section-pad bg-stone-50 border-y border-gray-200/80">
          <div className="max-w-6xl mx-auto">
            <SectionHead
              center
              eyebrow={sections.bookshops.eyebrow}
              title={nigeriaBookshops.heading}
              intro={nigeriaBookshops.intro}
            />
            <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {nigeriaBookshops.items.map((shop, i) => (
                <article
                  key={i}
                  className="relative rounded-xl border border-gray-200 bg-white p-6 sm:p-7 transition-all duration-300 hover:-translate-y-1 hover:border-brand-primary/40 hover:shadow-soft"
                >
                  <span className="absolute right-6 top-6 font-serif text-sm text-gray-400 tabular-nums font-bold">
                    0{i + 1}
                  </span>
                  <span className="inline-flex size-11 items-center justify-center rounded-lg bg-red-50 text-brand-primary">
                    <MapPin className="size-5" strokeWidth={1.75} />
                  </span>
                  <h3 className="mt-5 font-serif text-lg sm:text-xl font-bold leading-snug text-gray-900">
                    {shop.name}
                  </h3>
                  <div className="mt-3 space-y-1.5 text-sm text-gray-600 leading-relaxed">
                    <p>{shop.address}</p>
                    <p className="font-medium text-gray-800">{shop.city}</p>
                    {shop.phone && (
                      <p className="flex items-center gap-2 pt-1 font-medium text-gray-900">
                        <Phone className="size-3.5 text-brand-primary" strokeWidth={1.75} />
                        {shop.phone}
                      </p>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ----------------------------------------------------- 8. TESTIMONIALS */}
        <section id="testimonials" className="section-pad bg-white">
          <div className="max-w-6xl mx-auto">
            <SectionHead center eyebrow={sections.testimonials.eyebrow} title={sections.testimonials.title} />
            <div className="mt-12 grid md:grid-cols-3 gap-6">
              {testimonials.items.map((t, i) => (
                <figure
                  key={i}
                  className="rounded-xl border border-gray-200 bg-stone-50/50 p-7 sm:p-8 flex flex-col shadow-xs"
                >
                  <Quote className="size-6 text-brand-primary/60" strokeWidth={1.75} />
                  <blockquote className="mt-5 flex-1 font-serif text-lg leading-relaxed text-gray-800">
                    “{t.quote}”
                  </blockquote>
                  <figcaption className="mt-6 pt-5 border-t border-gray-200">
                    <p className="font-bold text-sm text-gray-950">{t.name}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{t.detail}</p>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>

        {/* --------------------------------------------------------- 9. EXCERPT */}
        <section id="excerpt" className="section-pad bg-stone-50 border-t border-gray-200">
          <div className="max-w-3xl mx-auto text-center">
            <SectionHead center eyebrow={sections.excerpt.eyebrow} title={sections.excerpt.title} />
          </div>
          <div className="mt-12 max-w-3xl mx-auto rounded-xl border border-gray-200 bg-white p-8 sm:p-12 shadow-sm">
            <p className="text-[0.68rem] uppercase tracking-[0.22em] text-brand-primary font-bold">
              {book.excerptTitle}
            </p>
            <div className="mt-6 space-y-5">
              {book.excerpt.split("\n\n").map((p) => (
                <p
                  key={p.slice(0, 24)}
                  className="font-serif text-lg sm:text-xl leading-[1.75] text-gray-800"
                >
                  {p}
                </p>
              ))}
            </div>
            <div className="mt-9 pt-8 border-t border-gray-200 text-center">
              <Button
                size="lg"
                onClick={scrollTo("purchase")}
                className="h-14 rounded-md bg-brand-primary text-white hover:bg-brand-primary/90 text-[0.72rem] font-semibold uppercase tracking-[0.18em] px-8 shadow-md shadow-brand-primary/20 cursor-pointer"
              >
                {cta.buyFullBook}
              </Button>
            </div>
          </div>
        </section>

        {/* --------------------------------------------------------- 9b. VIDEOS */}
        <section id="videos" className="section-pad bg-[#08080a] text-white">
          <div className="max-w-6xl mx-auto">
            <SectionHead
              center
              light
              eyebrow={sections.videos.eyebrow}
              title={videos.heading}
              intro={videos.intro}
            />
            <div className="mt-14 grid sm:grid-cols-2 gap-6">
              {videos.items.map((v, i) => (
                <article
                  key={i}
                  className="group rounded-xl border border-white/10 bg-white/[0.04] p-5 sm:p-6 transition-all duration-300 hover:-translate-y-1 hover:border-brand-primary/40"
                >
                  <div className="relative aspect-video overflow-hidden rounded-lg bg-black/50 ring-1 ring-white/10">
                    {v.src ? (
                      <VideoEmbed src={v.src} title={v.title} />
                    ) : (
                      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-center px-4">
                        <PlayCircle className="size-10 text-white/40" strokeWidth={1.5} />
                        <p className="text-[0.65rem] uppercase tracking-[0.18em] text-white/50 font-semibold">
                          Video link coming soon
                        </p>
                        <p className="text-[0.62rem] text-white/30">
                          YouTube · Vimeo · Livestream
                        </p>
                      </div>
                    )}
                  </div>
                  <h3 className="mt-5 font-serif text-lg sm:text-xl font-bold">{v.title}</h3>
                  <p className="mt-2 text-sm text-gray-400 leading-relaxed">{v.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* --------------------------------------------------- 9c. AUDIO PREVIEW */}
        <section id="audio" className="section-pad bg-white">
          <div className="max-w-6xl mx-auto">
            <SectionHead
              center
              eyebrow={sections.audio.eyebrow}
              title={audio.heading}
              intro={audio.intro}
            />
            <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {audio.items.map((a, i) => (
                <article
                  key={i}
                  className="rounded-xl border border-gray-200 bg-stone-50/50 p-6 sm:p-7 transition-all duration-300 hover:-translate-y-1 hover:border-brand-primary/40 hover:shadow-soft"
                >
                  <span className="inline-flex size-11 items-center justify-center rounded-lg bg-red-50 text-brand-primary">
                    <Headphones className="size-5" strokeWidth={1.75} />
                  </span>
                  <h3 className="mt-5 font-serif text-lg sm:text-xl font-bold leading-snug text-gray-900">
                    {a.title}
                  </h3>
                  <p className="mt-2 text-sm text-gray-600 leading-relaxed">{a.description}</p>
                  {a.src ? (
                    <audio
                      controls
                      preload="none"
                      className="mt-5 w-full"
                      aria-label={a.title}
                      src={a.src}
                    />
                  ) : (
                    <div className="mt-5 rounded-lg border border-dashed border-brand-primary/40 bg-white px-4 py-5 text-center">
                      <p className="text-[0.65rem] uppercase tracking-[0.18em] text-brand-primary font-bold">
                        Audio to be uploaded
                      </p>
                      <p className="mt-1 text-[0.62rem] text-gray-500">
                        Official audiobook recording in preparation
                      </p>
                    </div>
                  )}
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* --------------------------------------------- 9d. PROMOTIONAL IMAGES */}
        {galleryItems.length > 0 && (
          <section id="gallery" className="section-pad bg-stone-50 border-t border-gray-200">
            <div className="max-w-6xl mx-auto">
              <SectionHead
                center
                eyebrow={sections.gallery.eyebrow}
                title={sections.gallery.title}
                intro={sections.gallery.intro}
              />
              <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {galleryItems.map((g, i) => (
                  <figure key={i} className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xs">
                    <Image
                      src={g.src}
                      alt={g.alt}
                      width={400}
                      height={500}
                      className="w-full aspect-[4/5] object-cover"
                    />
                    {g.caption && (
                      <figcaption className="px-4 py-3 text-xs text-gray-500 text-center font-medium">
                        {g.caption}
                      </figcaption>
                    )}
                  </figure>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ------------------------------------------------------------- 10. FAQ */}
        <section id="faq" className="section-pad bg-stone-50 border-t border-gray-200">
          <div className="max-w-3xl mx-auto">
            <SectionHead center eyebrow={sections.faq.eyebrow} title={sections.faq.title} />
            <Accordion type="single" collapsible className="mt-12 w-full">
              {faq.map((item, i) => (
                <AccordionItem key={item.q} value={`item-${i}`} className="border-gray-200 bg-white rounded-lg px-5 mb-3 border">
                  <AccordionTrigger className="text-left font-serif text-lg sm:text-xl hover:no-underline py-5 font-bold text-gray-900">
                    {item.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-base leading-relaxed text-gray-600 pb-5">
                    {item.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>

        {/* -------------------------------------------------------- 11. FINAL CTA */}
        <section className="relative section-pad bg-[#08080a] text-white overflow-hidden">
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(60% 50% at 50% 40%, rgba(219, 23, 23, 0.3) 0%, transparent 70%)",
            }}
          />
          <div className="relative max-w-3xl mx-auto text-center">
            <h2 className="display text-2xl min-[380px]:text-3xl sm:text-5xl md:text-6xl text-white uppercase leading-[1.08] font-black break-words">
              {finalCta.heading}
            </h2>
            <p className="mt-5 sm:mt-7 text-gray-300 text-sm sm:text-base md:text-lg leading-relaxed max-w-[54ch] mx-auto">
              {finalCta.body}
            </p>
            <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row gap-3 sm:gap-3.5 justify-center">
              {!launched && (
                <Button
                  size="lg"
                  onClick={scrollTo("launch")}
                  className="w-full sm:w-auto h-12 sm:h-14 rounded-md bg-brand-primary text-white hover:bg-brand-primary/90 text-xs sm:text-[0.72rem] font-semibold uppercase tracking-[0.14em] sm:tracking-[0.18em] px-7 sm:px-8 shadow-lg shadow-brand-primary/30 cursor-pointer"
                >
                  {cta.registerFinal}
                </Button>
              )}
              <Button
                size="lg"
                variant="outline"
                onClick={scrollTo("purchase")}
                className={`w-full sm:w-auto h-12 sm:h-14 rounded-md text-xs sm:text-[0.72rem] font-semibold uppercase tracking-[0.14em] sm:tracking-[0.18em] px-7 sm:px-8 cursor-pointer ${
                  launched
                    ? "bg-brand-primary text-white border-brand-primary hover:bg-brand-primary/90"
                    : "border-white/25 bg-white/5 text-white hover:bg-white hover:text-black"
                }`}
              >
                {cta.buy}
              </Button>
            </div>
            {!launched && (
              <div className="mt-8 sm:mt-12 flex justify-center">
                <Countdown targetISO={launch.dateISO} tone="light" compact />
              </div>
            )}
          </div>
        </section>
      </main>

      {/* ----------------------------------------------------------- Footer */}
      <footer className="bg-stone-950 text-white border-t border-white/10 py-12 px-5 sm:px-6">
        <div className="max-w-6xl mx-auto text-center space-y-4">
          <p className="font-serif text-2xl font-bold">{brand.shortTitle}</p>
          <p className="text-sm text-gray-400 max-w-md mx-auto">
            {book.subtitle} · {author.name}
          </p>
          {socialLinks.length > 0 && (
            <div className="pt-2">
              <p className="text-[0.62rem] uppercase tracking-[0.2em] text-gray-400 font-semibold">
                {social.heading}
              </p>
              <div className="mt-3 flex flex-wrap justify-center gap-x-5 gap-y-2">
                {socialLinks.map((s) => (
                  <a
                    key={s.label}
                    href={s.url}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-primary hover:underline"
                  >
                    {s.label}
                  </a>
                ))}
              </div>
            </div>
          )}
          <p className="text-xs text-gray-400 pt-2">
            © {new Date().getFullYear()} {brand.siteName}. All rights reserved.
          </p>
        </div>
      </footer>

      {/* ------------------------------------------- mobile sticky action bar */}
      <div className="fixed bottom-0 inset-x-0 z-50 sm:hidden border-t border-white/10 bg-[#0c0c0e]/95 backdrop-blur-md p-2.5 sm:p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] flex gap-2">
        {!launched && (
          <Button
            onClick={scrollTo("launch")}
            variant="outline"
            className="flex-1 h-11 rounded-md text-[0.62rem] font-semibold uppercase tracking-[0.14em] border-white/20 bg-transparent text-white hover:bg-white/10"
          >
            {cta.registerShort}
          </Button>
        )}
        <Button
          onClick={scrollTo("purchase")}
          className="flex-1 h-11 rounded-md bg-brand-primary text-white hover:bg-brand-primary/90 text-[0.62rem] font-semibold uppercase tracking-[0.14em] shadow-md shadow-brand-primary/30"
        >
          {cta.buy}
        </Button>
      </div>
      <div className="h-20 sm:hidden" aria-hidden />
    </div>
  );
}
