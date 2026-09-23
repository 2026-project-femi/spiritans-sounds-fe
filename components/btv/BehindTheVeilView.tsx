'use client';

import { useState, useMemo, useSyncExternalStore } from 'react';
import Image from 'next/image';
import Link from 'next/link';
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
  X,
  Loader2,
  CheckCircle,
  ShoppingCart,
  Truck,
  Globe,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import Countdown from '@/components/btv/Countdown';
import LaunchRegistrationForm from '@/components/btv/LaunchRegistrationForm';
import { btvConfig } from '@/config/behindTheVeil';
import { timeStore } from '@/lib/timeStore';
import { useCurrency, Currency } from '@/hooks/useCurrency';
import { PdfPreviewModal } from '@/components/magazine/PdfPreviewModal';

export interface BehindTheVeilLaunchData {
  publicationId?: string;
  bookTitle?: string;
  bookSlug?: string;
  launchDateISO?: string;
  eventDate?: string;
  meetingPlatform?: string;
  meetingLink?: string;
  pages?: string;
  isbn?: string;
  publisher?: string;
  imprint?: string;
  language?: string;
  category?: string;
  isPreorder?: boolean;
  // eBook Pricing
  ebookAvailable?: boolean;
  ebookPriceNGN?: number;
  ebookPriceUSD?: number;
  ebookPriceGBP?: number;
  ebookPriceNote?: string;
  // Paperback Pricing
  paperbackAvailable?: boolean;
  paperbackPriceNGN?: number;
  paperbackPriceUSD?: number;
  paperbackPriceGBP?: number;
  paperbackPriceNote?: string;
  // Preview
  previewPdfUrl?: string | null;
  excerptTitle?: string;
  excerptText?: string;
  // Videos
  videosHeading?: string;
  videosIntro?: string;
  videos?: Array<{ title: string; description?: string; url: string; src?: string }>;
  // Audio
  audioHeading?: string;
  audioIntro?: string;
  audioPreviews?: Array<{
    title: string;
    description?: string;
    audioFileUrl?: string;
    audioUrl?: string;
    src?: string;
  }>;
  // Bookshops
  bookshopsHeading?: string;
  bookshopsIntro?: string;
  bookshops?: Array<{ name: string; address: string; city: string; phone?: string }>;
  // Testimonials
  testimonialsHeading?: string;
  testimonials?: Array<{ name: string; detail?: string; quote: string }>;
}

const icons = {
  eye: Eye,
  search: Search,
  heart: Heart,
  'shield-alert': ShieldAlert,
  'shield-check': ShieldCheck,
  handshake: Handshake,
} as const;

const useLaunched = (dateISO?: string) => {
  const { mode, dateISO: fallbackISO } = btvConfig.launch;
  const targetISO = dateISO || fallbackISO;
  const target = useMemo(() => new Date(targetISO).getTime(), [targetISO]);

  const now = useSyncExternalStore(
    timeStore.subscribe,
    timeStore.getSnapshot,
    timeStore.getServerSnapshot,
  );

  return mode === 'post-launch' || (mode === 'auto' && now > 0 && now >= target);
};

const scrollTo = (id: string) => () =>
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });

/** Renders a YouTube / Vimeo / .mp4 link as a responsive 16:9 embed. */
const VideoEmbed = ({ src, title }: { src: string; title: string }) => {
  const embedUrl = (() => {
    try {
      const u = new URL(src);
      const host = u.hostname.replace('www.', '');
      if (host === 'youtube.com' && u.searchParams.get('v')) {
        return `https://www.youtube-nocookie.com/embed/${u.searchParams.get('v')}`;
      }
      if (host === 'youtu.be') {
        return `https://www.youtube-nocookie.com/embed${u.pathname}`;
      }
      if (host === 'vimeo.com') {
        return `https://player.vimeo.com/video${u.pathname}`;
      }
      if (src.endsWith('.mp4')) return null;
      return src;
    } catch {
      return src;
    }
  })();

  if (embedUrl === null) {
    return (
      <video controls title={title} className="absolute inset-0 size-full object-cover" src={src} />
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
  <div className={`max-w-3xl ${center ? 'mx-auto text-center' : ''}`}>
    <span
      className={`eyebrow ${center ? 'justify-center' : ''} ${light ? 'text-brand-primary' : ''}`}
    >
      {eyebrow}
    </span>
    <h2
      className={`display mt-3 sm:mt-5 text-2xl min-[380px]:text-3xl sm:text-4xl md:text-5xl leading-[1.12] ${
        light ? 'text-white' : 'text-foreground'
      }`}
    >
      {title}
    </h2>
    {intro && (
      <p
        className={`mt-3 sm:mt-4 text-sm sm:text-base md:text-lg leading-relaxed ${
          light ? 'text-white/70' : 'text-muted-foreground'
        }`}
      >
        {intro}
      </p>
    )}
  </div>
);

export default function BehindTheVeilView({
  launchData,
}: {
  launchData?: BehindTheVeilLaunchData;
}) {
  const launched = useLaunched(launchData?.launchDateISO);
  const { currency, setCurrency, symbol } = useCurrency();

  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [purchaseModalFormat, setPurchaseModalFormat] = useState<'ebook' | 'paperback' | null>(
    null,
  );
  const [purchaseForm, setPurchaseForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    country: '',
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [purchaseError, setPurchaseError] = useState<string | null>(null);

  const {
    book,
    launch,
    discover,
    author,
    testimonials: fallbackTestimonials,
    faq,
    videos: fallbackVideos,
    finalCta,
    nigeriaBookshops: fallbackBookshops,
    brand,
    cta,
    sections,
    gallery,
    social,
  } = btvConfig;

  const galleryItems = gallery.filter((g) => g.src);
  const socialLinks = social.links.filter((s) => s.url);

  // Dynamic pricing values
  const ebookAmount =
    currency === 'USD'
      ? (launchData?.ebookPriceUSD ?? 10)
      : currency === 'GBP'
        ? (launchData?.ebookPriceGBP ?? 8)
        : (launchData?.ebookPriceNGN ?? 5000);

  const paperbackAmount =
    currency === 'USD'
      ? (launchData?.paperbackPriceUSD ?? 25)
      : currency === 'GBP'
        ? (launchData?.paperbackPriceGBP ?? 20)
        : (launchData?.paperbackPriceNGN ?? 12000);

  const isPreorder = Boolean(launchData?.isPreorder ?? true);

  // Dynamic formats for the purchase grid
  const dynamicFormats = [
    {
      id: 'ebook' as const,
      name: 'eBook Edition',
      available: launchData?.ebookAvailable ?? true,
      price: `${symbol}${ebookAmount.toLocaleString()}`,
      currencyNote:
        currency === 'NGN'
          ? 'Naira · Instant Access'
          : currency === 'GBP'
            ? 'Pounds · Instant Access'
            : 'USD · Instant Access',
      priceNote: launchData?.ebookPriceNote || 'Instant download · PDF & ePub',
      description:
        'Read it on phone, tablet or ereader. Delivered straight to your inbox upon purchase.',
      details: ['Instant digital delivery', 'PDF & ePub formats', 'Universal device support'],
      featured: true,
    },
    {
      id: 'paperback' as const,
      name: 'Paperback Edition',
      available: launchData?.paperbackAvailable ?? true,
      price: `${symbol}${paperbackAmount.toLocaleString()}`,
      currencyNote:
        currency === 'NGN'
          ? 'Naira · Physical Delivery'
          : currency === 'GBP'
            ? 'Pounds · Postage Included'
            : 'USD · Shipping Available',
      priceNote:
        launchData?.paperbackPriceNote || 'UK & international delivery · posted on purchase',
      description:
        'A premium physical print edition to hold, underline, and share with others. Posted to your doorstep.',
      details: ['Print edition', 'Delivered to your address', 'Signed copies on request'],
      featured: false,
    },
    {
      id: 'audiobook' as const,
      name: 'Audiobook Edition',
      available: true,
      price: 'Listen to Previews',
      currencyNote: 'Narration by the author',
      priceNote: 'Official narration in preparation',
      description:
        'Sample narration clips available below in the Audiobook preview player. Full release coming soon.',
      details: ['Narrated edition', 'Listen on any device', 'Official audio release'],
      featured: false,
      isAudioAction: true,
    },
  ];

  const availableFormats = dynamicFormats.filter((f) => f.available);

  // Dynamic videos list
  const videoItems: ReadonlyArray<{
    title: string;
    description?: string;
    url?: string;
    src?: string;
  }> =
    launchData?.videos && launchData.videos.length > 0 ? launchData.videos : fallbackVideos.items;

  // Dynamic audio items
  const audioItems: ReadonlyArray<{
    title: string;
    description?: string;
    audioFileUrl?: string;
    audioUrl?: string;
    src?: string;
  }> =
    launchData?.audioPreviews && launchData.audioPreviews.length > 0
      ? launchData.audioPreviews
      : btvConfig.audio.items;

  // Dynamic bookshops
  const bookshopItems =
    launchData?.bookshops && launchData.bookshops.length > 0
      ? launchData.bookshops
      : fallbackBookshops.items;

  // Dynamic testimonials
  const testimonialItems =
    launchData?.testimonials && launchData.testimonials.length > 0
      ? launchData.testimonials
      : fallbackTestimonials.items;

  // Handle book purchase
  async function handlePurchaseSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPurchaseError(null);

    if (!launchData?.publicationId) {
      setPurchaseError(
        'This book is not yet available for purchase. Please refresh the page and try again shortly.',
      );
      return;
    }

    setIsProcessing(true);

    try {
      const res = await fetch('/api/checkout/purchase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: purchaseForm.email,
          name: purchaseForm.name,
          itemId: launchData.publicationId,
          itemType: 'publications',
          currency: currency,
          format: purchaseModalFormat,
          shippingAddress: purchaseModalFormat === 'paperback' ? purchaseForm.address : undefined,
          shippingCity: purchaseModalFormat === 'paperback' ? purchaseForm.city : undefined,
          shippingCountry: purchaseModalFormat === 'paperback' ? purchaseForm.country : undefined,
          shippingPhone: purchaseModalFormat === 'paperback' ? purchaseForm.phone : undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Payment initialization failed');
      if (data.authorization_url) {
        window.location.href = data.authorization_url;
      }
    } catch (err) {
      setPurchaseError(
        err instanceof Error ? err.message : 'Something went wrong. Please try again.',
      );
    } finally {
      setIsProcessing(false);
    }
  }

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
                {launchData?.bookTitle || brand.shortTitle}
              </p>
              <p className="text-[0.58rem] sm:text-[0.62rem] uppercase tracking-[0.16em] text-gray-400 mt-0.5 sm:mt-1 truncate hidden min-[380px]:block">
                {book.author}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2.5">
            <button
              onClick={() => setShowPreviewModal(true)}
              className="hidden md:inline-flex items-center gap-1.5 h-9 rounded-md border border-white/20 bg-white/5 hover:bg-white/15 px-3 text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-white transition-colors"
            >
              <Eye className="size-3.5 text-brand-primary" />
              <span>Preview</span>
            </button>
            {!launched && (
              <Button
                onClick={scrollTo('launch')}
                variant="outline"
                className="hidden sm:inline-flex h-9 sm:h-10 rounded-md border-white/20 bg-transparent text-white hover:bg-white/10 hover:text-white text-[0.65rem] sm:text-[0.68rem] font-semibold uppercase tracking-[0.14em]"
              >
                {cta.registerShort}
              </Button>
            )}
            <Button
              onClick={scrollTo('purchase')}
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
                'linear-gradient(160deg, rgba(20,20,20,0.95) 0%, rgba(10,10,10,0.98) 60%, rgba(48,8,10,0.6) 100%)',
            }}
          />
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                'radial-gradient(60% 50% at 50% 40%, rgba(219, 23, 23, 0.28) 0%, transparent 70%)',
            }}
          />
          <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-20 md:py-28 grid lg:grid-cols-[1.05fr_0.95fr] gap-10 lg:gap-16 items-center">
            <div className="space-y-6 sm:space-y-7 animate-rise">
              <div className="inline-flex items-center gap-2 rounded-full border border-brand-primary/50 bg-brand-primary/10 px-3.5 py-1.5 backdrop-blur-sm">
                <Sparkles className="size-3 text-brand-primary shrink-0" strokeWidth={2} />
                <span className="text-[0.58rem] min-[400px]:text-[0.62rem] sm:text-[0.68rem] font-semibold uppercase tracking-[0.18em] sm:tracking-[0.22em] text-white/90">
                  {launched
                    ? cta.badgePostLaunch
                    : `${cta.badgePreLaunch} · ${launchData?.eventDate || launch.dateLabel}`}
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
                  <Countdown targetISO={launchData?.launchDateISO || launch.dateISO} tone="light" />
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <Button
                  size="lg"
                  onClick={() => setShowPreviewModal(true)}
                  className="w-full sm:w-auto h-12 sm:h-14 rounded-md bg-white/10 hover:bg-white/20 text-white text-xs sm:text-[0.72rem] font-semibold uppercase tracking-[0.14em] sm:tracking-[0.18em] px-6 sm:px-7 border border-white/20 cursor-pointer flex items-center justify-center gap-2"
                >
                  <Eye className="size-4 text-brand-primary" />
                  Preview Book
                </Button>
                {!launched ? (
                  <>
                    <Button
                      size="lg"
                      onClick={scrollTo('launch')}
                      className="w-full sm:w-auto h-12 sm:h-14 rounded-md bg-brand-primary text-white hover:bg-brand-primary/90 text-xs sm:text-[0.72rem] font-semibold uppercase tracking-[0.14em] sm:tracking-[0.18em] px-6 sm:px-7 shadow-lg shadow-brand-primary/30 cursor-pointer"
                    >
                      {cta.register}
                    </Button>
                    <Button
                      size="lg"
                      variant="outline"
                      onClick={scrollTo('purchase')}
                      className="w-full sm:w-auto h-12 sm:h-14 rounded-md border-white/25 bg-white/5 text-white hover:bg-white hover:text-black text-xs sm:text-[0.72rem] font-semibold uppercase tracking-[0.14em] sm:tracking-[0.18em] px-6 sm:px-7 cursor-pointer"
                    >
                      {cta.buy}
                    </Button>
                  </>
                ) : (
                  <Button
                    size="lg"
                    onClick={scrollTo('purchase')}
                    className="w-full sm:w-auto h-12 sm:h-14 rounded-md bg-brand-primary text-white hover:bg-brand-primary/90 text-xs sm:text-[0.72rem] font-semibold uppercase tracking-[0.14em] sm:tracking-[0.18em] px-6 sm:px-7 shadow-lg shadow-brand-primary/30 cursor-pointer"
                  >
                    {cta.buy}
                  </Button>
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
                      'radial-gradient(circle, rgba(219, 23, 23, 0.35) 0%, transparent 70%)',
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
            <SectionHead eyebrow={sections.book.eyebrow} title={sections.book.title} />
            <div className="mt-12 grid lg:grid-cols-[1.15fr_0.85fr] gap-12 lg:gap-16">
              <div className="space-y-6">
                {book.description.map((p) => (
                  <p
                    key={p.slice(0, 24)}
                    className="text-base sm:text-lg leading-relaxed text-gray-800"
                  >
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
                    “{(launchData?.excerptText || book.excerpt).split('\n\n')[0]}”
                  </blockquote>
                  <figcaption className="mt-3 text-[0.68rem] uppercase tracking-[0.2em] text-gray-500 font-semibold">
                    {launchData?.excerptTitle || sections.book.excerptCaption}
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
                    ['Publisher', launchData?.publisher || book.publication.publisher],
                    ['Imprint', launchData?.imprint || book.publication.imprint],
                    ['Publication date', book.publication.publicationDate],
                    ['Language', launchData?.language || book.publication.language],
                    ['Pages', launchData?.pages || book.publication.pages],
                    ['ISBN', launchData?.isbn || book.publication.isbn],
                    ['Category', launchData?.category || book.publication.category],
                  ].map(([k, v]) => (
                    <div
                      key={k}
                      className="flex flex-col min-[380px]:flex-row min-[380px]:justify-between gap-1 min-[380px]:gap-6 border-b border-gray-200/80 pb-2.5 sm:pb-3 last:border-0"
                    >
                      <dt className="text-gray-500 shrink-0">{k}</dt>
                      <dd className="text-left min-[380px]:text-right font-semibold text-gray-900">
                        {v}
                      </dd>
                    </div>
                  ))}
                </dl>
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <p className="text-[0.65rem] uppercase tracking-[0.2em] text-gray-500 font-semibold">
                    {sections.book.availableInLabel}
                  </p>
                  <p className="mt-2 font-bold text-gray-900">
                    {availableFormats.map((f) => f.name).join(' · ')}
                  </p>
                  <div className="mt-5 flex flex-col gap-2.5">
                    <Button
                      onClick={() => setShowPreviewModal(true)}
                      variant="outline"
                      className="w-full h-11 rounded-md border-gray-300 bg-white hover:bg-stone-100 text-[0.68rem] font-semibold uppercase tracking-[0.16em] cursor-pointer text-gray-900 flex items-center justify-center gap-2"
                    >
                      <Eye className="size-3.5 text-brand-primary" />
                      Preview First 5 Pages
                    </Button>
                    <Button
                      onClick={scrollTo('purchase')}
                      className="w-full h-12 rounded-md bg-brand-primary text-white hover:bg-brand-primary/90 text-[0.68rem] font-semibold uppercase tracking-[0.16em] cursor-pointer"
                    >
                      {cta.buy}
                    </Button>
                  </div>
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
            <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {discover.map((item, i) => {
                const IconComponent = icons[item.icon as keyof typeof icons] || Eye;
                return (
                  <article
                    key={item.title}
                    className="relative rounded-xl border border-gray-200 bg-white p-7 sm:p-8 transition-all duration-300 hover:-translate-y-1 hover:border-brand-primary/40 hover:shadow-soft"
                  >
                    <span className="absolute right-6 top-6 font-serif text-sm text-gray-400 tabular-nums font-bold">
                      0{i + 1}
                    </span>
                    <span className="inline-flex size-11 items-center justify-center rounded-lg bg-red-50 text-brand-primary">
                      <IconComponent className="size-5" strokeWidth={1.75} />
                    </span>
                    <h3 className="mt-5 font-serif text-xl sm:text-2xl font-bold leading-snug text-gray-900">
                      {item.title}
                    </h3>
                    <p className="mt-3 text-sm text-gray-600 leading-relaxed">{item.body}</p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        {/* ------------------------------------------------------------- 4. WHY */}
        <section id="why" className="section-pad bg-[#0c0c0e] text-white">
          <div className="max-w-3xl mx-auto">
            <SectionHead eyebrow={sections.why.eyebrow} title="Why I wrote this book" light />
            <div className="mt-10 space-y-6 text-base sm:text-lg leading-relaxed text-white/80 font-serif">
              <p>
                In my years of pastoral counselling, I noticed that the deepest wounds were rarely
                caused by overt malice. They came from quiet, sustained deception — from the slow
                erosion of trust between people who had every reason to believe each other.
              </p>
              <p>
                People would sit before me not just hurt, but disoriented. They had sensed that
                something was wrong for months, sometimes years, but had talked themselves out of
                their own perception. They were not naive; they were generous. And that generosity
                had been weaponised against them.
              </p>
              <p>
                I wrote <em>Behind the Veil</em> because there are plenty of books that teach you to
                be suspicious, but very few that teach you to be discerning. Discernment does not
                harden your heart; it clears your vision. It allows you to see the pattern clearly
                and respond with both truth and love.
              </p>
            </div>
          </div>
        </section>

        {/* ---------------------------------------------------------- 5. AUTHOR */}
        <section id="author" className="section-pad bg-white">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-[0.85fr_1.15fr] gap-12 lg:gap-16 items-center">
              <div className="relative mx-auto w-full max-w-md aspect-4/5 overflow-hidden rounded-2xl bg-stone-100 shadow-md">
                <Image
                  src={author.photo}
                  alt={author.name}
                  fill
                  sizes="(max-width: 1024px) 100vw, 400px"
                  className="object-cover"
                />
              </div>
              <div className="space-y-6">
                <SectionHead eyebrow={sections.author.eyebrow} title={author.name} />
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-brand-primary -mt-2">
                  {author.role}
                </p>
                <div className="space-y-4 text-base sm:text-lg leading-relaxed text-gray-700">
                  <p>{author.bio}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ---------------------------------------------------------- 6. LAUNCH */}
        <section
          id="launch"
          className="relative section-pad bg-[#08080a] text-white overflow-hidden"
        >
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                'radial-gradient(50% 40% at 50% 50%, rgba(219, 23, 23, 0.22) 0%, transparent 70%)',
            }}
          />
          <div className="relative max-w-6xl mx-auto">
            <SectionHead
              center
              light
              eyebrow={sections.launch.eyebrow}
              title={`${sections.launch.titleLine1} ${sections.launch.titleLine2}`}
              intro={launched ? sections.launch.postLaunchIntro : sections.launch.registerIntro}
            />

            <div className="mt-14 max-w-2xl mx-auto">
              {!launched ? (
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 sm:p-10 backdrop-blur-sm space-y-8">
                  <div className="space-y-3 text-center">
                    <p className="text-[0.62rem] font-semibold uppercase tracking-[0.22em] text-white/50">
                      {sections.launch.countdownLabel}
                    </p>
                    <Countdown
                      targetISO={launchData?.launchDateISO || launch.dateISO}
                      tone="light"
                    />
                  </div>

                  <div className="grid sm:grid-cols-3 gap-4 py-4 border-y border-white/10 text-center">
                    <div>
                      <CalendarDays className="size-5 text-brand-primary mx-auto mb-1.5" />
                      <p className="text-[0.62rem] uppercase tracking-[0.16em] text-white/50">
                        Date
                      </p>
                      <p className="text-xs font-bold text-white mt-0.5">
                        {launchData?.eventDate || launch.dateLabel}
                      </p>
                    </div>
                    <div>
                      <Clock className="size-5 text-brand-primary mx-auto mb-1.5" />
                      <p className="text-[0.62rem] uppercase tracking-[0.16em] text-white/50">
                        Time
                      </p>
                      <p className="text-xs font-bold text-white mt-0.5">{launch.timeLabel}</p>
                    </div>
                    <div>
                      <Monitor className="size-5 text-brand-primary mx-auto mb-1.5" />
                      <p className="text-[0.62rem] uppercase tracking-[0.16em] text-white/50">
                        Platform
                      </p>
                      <p className="text-xs font-bold text-white mt-0.5">
                        {launchData?.meetingPlatform || launch.platformLabel}
                      </p>
                    </div>
                  </div>

                  <LaunchRegistrationForm />
                </div>
              ) : (
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-8 sm:p-12 text-center backdrop-blur-sm space-y-6">
                  <span className="inline-flex size-14 items-center justify-center rounded-full bg-brand-primary/20 text-brand-primary mx-auto">
                    <BookOpen className="size-7" strokeWidth={1.75} />
                  </span>
                  <h3 className="display text-2xl sm:text-3xl text-white uppercase font-black">
                    {sections.launch.postLaunchHeading}
                  </h3>
                  <p className="text-white/70 text-base max-w-lg mx-auto">
                    {sections.launch.postLaunchThanks} {sections.launch.postLaunchNote}
                  </p>
                  <Button
                    size="lg"
                    onClick={scrollTo('purchase')}
                    className="h-14 rounded-md bg-brand-primary text-white hover:bg-brand-primary/90 text-[0.72rem] font-semibold uppercase tracking-[0.18em] px-8 shadow-lg shadow-brand-primary/30 cursor-pointer"
                  >
                    {cta.buy}
                  </Button>
                </div>
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

            {/* Currency switch header */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 text-xs">
              <span className="text-gray-500 font-medium">Select Currency:</span>
              <div className="inline-flex rounded-lg border border-gray-200 bg-stone-100 p-1">
                {(['NGN', 'GBP', 'USD'] as Currency[]).map((cur) => (
                  <button
                    key={cur}
                    onClick={() => setCurrency(cur)}
                    className={`px-3.5 py-1.5 rounded-md font-bold text-xs uppercase tracking-wider transition-all ${
                      currency === cur
                        ? 'bg-white text-gray-950 shadow-xs border border-gray-200/80 font-black'
                        : 'text-gray-500 hover:text-gray-900'
                    }`}
                  >
                    {cur === 'NGN' ? '₦ NGN' : cur === 'GBP' ? '£ GBP' : '$ USD'}
                  </button>
                ))}
              </div>
              <span className="text-[11px] text-gray-400">
                ({currency === 'NGN' ? 'Nigeria / Paystack' : 'International / Stripe'})
              </span>
            </div>

            {/* Preorder notification banner */}
            {isPreorder && (
              <div className="mt-8 max-w-2xl mx-auto bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 sm:p-5 flex items-start gap-3.5 text-left">
                <Sparkles className="size-5 text-amber-500 shrink-0 mt-0.5" />
                <div className="text-xs sm:text-sm text-gray-800 space-y-1">
                  <p className="font-bold text-amber-700 uppercase tracking-wide">
                    Online Book Pre-Order
                  </p>
                  <p className="text-gray-600 leading-relaxed font-light">
                    Reserve your copy today before the official release. eBook downloads and
                    paperback deliveries will be dispatched immediately on launch date.
                  </p>
                </div>
              </div>
            )}

            <div
              className={`mt-10 grid gap-6 ${
                availableFormats.length === 1
                  ? 'max-w-md mx-auto'
                  : availableFormats.length === 2
                    ? 'sm:grid-cols-2 max-w-3xl mx-auto'
                    : 'sm:grid-cols-2 lg:grid-cols-3'
              }`}
            >
              {availableFormats.map((f) => (
                <article
                  key={f.id}
                  className={`relative flex flex-col rounded-xl border p-7 sm:p-8 transition-all duration-300 hover:-translate-y-1 hover:shadow-soft ${
                    f.featured
                      ? 'border-brand-primary bg-red-50/20'
                      : 'border-gray-200 bg-stone-50/50'
                  }`}
                >
                  {f.featured && (
                    <span className="absolute -top-3 left-7 rounded-full bg-brand-primary px-3 py-1 text-[0.58rem] font-semibold uppercase tracking-[0.18em] text-white">
                      {sections.purchase.featuredBadge}
                    </span>
                  )}
                  {f.id === 'paperback' ? (
                    <Truck className="size-6 text-brand-primary" strokeWidth={1.75} />
                  ) : f.id === 'audiobook' ? (
                    <Headphones className="size-6 text-brand-primary" strokeWidth={1.75} />
                  ) : (
                    <BookOpen className="size-6 text-brand-primary" strokeWidth={1.75} />
                  )}
                  <h3 className="mt-5 font-serif text-2xl font-bold text-gray-950">{f.name}</h3>
                  <p className="mt-2 text-sm text-gray-600 leading-relaxed">{f.description}</p>
                  <p className="mt-6 font-serif text-3xl font-extrabold text-gray-900">{f.price}</p>
                  <p className="mt-1 text-xs text-brand-primary font-medium">{f.currencyNote}</p>
                  {f.priceNote && <p className="mt-0.5 text-xs text-gray-500">{f.priceNote}</p>}
                  <ul className="mt-6 space-y-2.5 flex-1">
                    {f.details.map((d) => (
                      <li key={d} className="flex items-start gap-2.5 text-sm text-gray-700">
                        <span className="mt-1.5 size-1.5 rounded-full bg-brand-primary shrink-0" />
                        {d}
                      </li>
                    ))}
                  </ul>

                  {f.isAudioAction ? (
                    <Button
                      onClick={scrollTo('audio')}
                      variant="outline"
                      className="mt-7 h-14 rounded-md border-gray-300 bg-white hover:bg-stone-100 text-[0.72rem] font-semibold uppercase tracking-[0.18em] cursor-pointer text-gray-900"
                    >
                      Listen to Samples
                    </Button>
                  ) : (
                    <Button
                      onClick={() => setPurchaseModalFormat(f.id as 'ebook' | 'paperback')}
                      className="mt-7 h-14 rounded-md bg-brand-primary text-white hover:bg-brand-primary/90 text-[0.72rem] font-semibold uppercase tracking-[0.18em] shadow-md shadow-brand-primary/20 cursor-pointer flex items-center justify-center gap-2"
                    >
                      <ShoppingCart className="size-4" />
                      {isPreorder
                        ? `Pre-order ${f.name.split(' ')[0]}`
                        : `Buy ${f.name.split(' ')[0]} Now`}
                    </Button>
                  )}
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ----------------------------------------------- 7b. NIGERIA BOOKSHOPS */}
        <section
          id="nigeria-bookshops"
          className="section-pad bg-stone-50 border-y border-gray-200/80"
        >
          <div className="max-w-6xl mx-auto">
            <SectionHead
              center
              eyebrow={sections.bookshops.eyebrow}
              title={launchData?.bookshopsHeading || fallbackBookshops.heading}
              intro={launchData?.bookshopsIntro || fallbackBookshops.intro}
            />
            <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {bookshopItems.map((shop, i) => (
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
                      <p className="pt-1">
                        <a
                          href={`tel:${shop.phone}`}
                          className="inline-flex items-center gap-2 font-medium text-gray-900 hover:text-brand-primary transition-colors"
                        >
                          <Phone className="size-3.5 text-brand-primary" strokeWidth={1.75} />
                          {shop.phone}
                        </a>
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
            <SectionHead
              center
              eyebrow={sections.testimonials.eyebrow}
              title={launchData?.testimonialsHeading || sections.testimonials.title}
            />
            <div className="mt-12 grid md:grid-cols-3 gap-6">
              {testimonialItems.map((t, i) => (
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
                    {t.detail && <p className="text-xs text-gray-500 mt-0.5">{t.detail}</p>}
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
              {launchData?.excerptTitle || book.excerptTitle}
            </p>
            <div className="mt-6 space-y-5">
              {(launchData?.excerptText || book.excerpt).split('\n\n').map((p, idx) => (
                <p key={idx} className="font-serif text-lg sm:text-xl leading-[1.75] text-gray-800">
                  {p}
                </p>
              ))}
            </div>
            <div className="mt-9 pt-8 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                size="lg"
                onClick={() => setShowPreviewModal(true)}
                variant="outline"
                className="w-full sm:w-auto h-14 rounded-md border-gray-300 bg-white hover:bg-stone-100 text-[0.72rem] font-semibold uppercase tracking-[0.18em] px-8 cursor-pointer flex items-center justify-center gap-2 text-gray-900"
              >
                <Eye className="size-4 text-brand-primary" />
                Preview First 5 Pages
              </Button>
              <Button
                size="lg"
                onClick={scrollTo('purchase')}
                className="w-full sm:w-auto h-14 rounded-md bg-brand-primary text-white hover:bg-brand-primary/90 text-[0.72rem] font-semibold uppercase tracking-[0.18em] px-8 shadow-md shadow-brand-primary/20 cursor-pointer"
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
              title={launchData?.videosHeading || fallbackVideos.heading}
              intro={launchData?.videosIntro || fallbackVideos.intro}
            />
            <div className="mt-14 grid sm:grid-cols-2 gap-6">
              {videoItems.map((v, i) => {
                const videoSource = v.url || v.src || '';
                return (
                  <article
                    key={i}
                    className="group rounded-xl border border-white/10 bg-white/[0.04] p-5 sm:p-6 transition-all duration-300 hover:-translate-y-1 hover:border-brand-primary/40"
                  >
                    <div className="relative aspect-video overflow-hidden rounded-lg bg-black/50 ring-1 ring-white/10">
                      {videoSource ? (
                        <VideoEmbed src={videoSource} title={v.title} />
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
                    {v.description && (
                      <p className="mt-2 text-sm text-gray-400 leading-relaxed">{v.description}</p>
                    )}
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        {/* --------------------------------------------------- 9c. AUDIO PREVIEW */}
        <section id="audio" className="section-pad bg-white">
          <div className="max-w-6xl mx-auto">
            <SectionHead
              center
              eyebrow={sections.audio.eyebrow}
              title={launchData?.audioHeading || btvConfig.audio.heading}
              intro={launchData?.audioIntro || btvConfig.audio.intro}
            />
            <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {audioItems.map((a, i) => {
                const audioSource = a.audioFileUrl || a.audioUrl || a.src || '';
                return (
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
                    {a.description && (
                      <p className="mt-2 text-sm text-gray-600 leading-relaxed">{a.description}</p>
                    )}
                    {audioSource ? (
                      <audio
                        controls
                        preload="none"
                        className="mt-5 w-full"
                        aria-label={a.title}
                        src={audioSource}
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
                );
              })}
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
                  <figure
                    key={i}
                    className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xs"
                  >
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
                <AccordionItem
                  key={item.q}
                  value={`item-${i}`}
                  className="border-gray-200 bg-white rounded-lg px-5 mb-3 border"
                >
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
                'radial-gradient(60% 50% at 50% 40%, rgba(219, 23, 23, 0.3) 0%, transparent 70%)',
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
                  onClick={scrollTo('launch')}
                  className="w-full sm:w-auto h-12 sm:h-14 rounded-md bg-brand-primary text-white hover:bg-brand-primary/90 text-xs sm:text-[0.72rem] font-semibold uppercase tracking-[0.14em] sm:tracking-[0.18em] px-7 sm:px-8 shadow-lg shadow-brand-primary/30 cursor-pointer"
                >
                  {cta.registerFinal}
                </Button>
              )}
              <Button
                size="lg"
                variant="outline"
                onClick={scrollTo('purchase')}
                className={`w-full sm:w-auto h-12 sm:h-14 rounded-md text-xs sm:text-[0.72rem] font-semibold uppercase tracking-[0.14em] sm:tracking-[0.18em] px-7 sm:px-8 cursor-pointer ${
                  launched
                    ? 'bg-brand-primary text-white border-brand-primary hover:bg-brand-primary/90'
                    : 'border-white/25 bg-white/5 text-white hover:bg-white hover:text-black'
                }`}
              >
                {cta.buy}
              </Button>
            </div>
            {!launched && (
              <div className="mt-8 sm:mt-12 flex justify-center">
                <Countdown
                  targetISO={launchData?.launchDateISO || launch.dateISO}
                  tone="light"
                  compact
                />
              </div>
            )}
          </div>
        </section>
      </main>

      {/* ----------------------------------------------------------- Footer */}
      <footer className="bg-stone-950 text-white border-t border-white/10 py-12 px-5 sm:px-6">
        <div className="max-w-6xl mx-auto text-center space-y-4">
          <p className="font-serif text-2xl font-bold">
            {launchData?.bookTitle || brand.shortTitle}
          </p>
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
        <Button
          onClick={() => setShowPreviewModal(true)}
          variant="outline"
          className="flex-1 h-11 rounded-md text-[0.62rem] font-semibold uppercase tracking-[0.14em] border-white/20 bg-transparent text-white hover:bg-white/10"
        >
          <Eye className="size-3.5 mr-1" />
          Preview
        </Button>
        <Button
          onClick={scrollTo('purchase')}
          className="flex-1 h-11 rounded-md bg-brand-primary text-white hover:bg-brand-primary/90 text-[0.62rem] font-semibold uppercase tracking-[0.14em] shadow-md shadow-brand-primary/30"
        >
          {cta.buy}
        </Button>
      </div>
      <div className="h-20 sm:hidden" aria-hidden />

      {/* ------------------------------------------- PDF Preview Modal */}
      {showPreviewModal &&
        (launchData?.previewPdfUrl ? (
          <PdfPreviewModal
            fileUrl={launchData.previewPdfUrl}
            title={launchData?.bookTitle || book.title}
            onClose={() => setShowPreviewModal(false)}
          />
        ) : (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="bg-[#0d0d0d] border border-white/15 rounded-2xl p-6 sm:p-8 w-full max-w-md shadow-2xl relative text-center space-y-4">
              <button
                onClick={() => setShowPreviewModal(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-white"
              >
                <X size={20} />
              </button>
              <div className="size-12 rounded-full bg-brand-primary/10 border border-brand-primary/30 flex items-center justify-center mx-auto text-brand-primary">
                <BookOpen size={24} />
              </div>
              <h3 className="text-xl font-bold text-white">Preview Sample</h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                The sample PDF preview is currently being prepared by the publisher. You can read
                the selected excerpt on this page or pre-order your full copy.
              </p>
              <Button
                onClick={() => {
                  setShowPreviewModal(false);
                  scrollTo('excerpt')();
                }}
                className="w-full bg-brand-primary text-white hover:bg-brand-primary/90"
              >
                Read Selected Excerpt Passage
              </Button>
            </div>
          </div>
        ))}

      {/* ------------------------------------------- Purchase / Checkout Modal */}
      {purchaseModalFormat && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-[#0e0e11] border border-white/15 rounded-2xl p-6 sm:p-8 w-full max-w-md shadow-2xl relative my-8">
            <button
              onClick={() => setPurchaseModalFormat(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <X size={20} />
            </button>

            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-brand-primary/20 text-brand-primary border border-brand-primary/30">
                {purchaseModalFormat === 'paperback' ? 'Physical Paperback' : 'Digital eBook'}
              </span>
              {isPreorder && (
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-400/10 text-amber-400 border border-amber-400/30">
                  Pre-Order
                </span>
              )}
            </div>

            <h3 className="text-xl font-black text-white">
              {launchData?.bookTitle || 'Behind the Veil'}
            </h3>

            <p className="text-xs text-gray-400 mt-1 mb-5">
              Price:{' '}
              <strong className="text-white text-base">
                {symbol}
                {(purchaseModalFormat === 'paperback'
                  ? paperbackAmount
                  : ebookAmount
                ).toLocaleString()}
              </strong>{' '}
              {currency}
              {' · '}
              <span className="text-brand-primary">
                {currency === 'NGN' ? 'Secured by Paystack' : 'Secured by Stripe'}
              </span>
            </p>

            {purchaseError && (
              <p className="text-red-400 text-xs mb-4 bg-red-500/10 border border-red-500/20 px-3 py-2.5 rounded-lg">
                {purchaseError}
              </p>
            )}

            <form onSubmit={handlePurchaseSubmit} className="space-y-3.5 text-left">
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-gray-400 font-bold mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. John Doe"
                  value={purchaseForm.name}
                  onChange={(e) => setPurchaseForm((f) => ({ ...f, name: e.target.value }))}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3.5 py-2.5 text-white placeholder:text-gray-600 text-sm focus:outline-none focus:border-brand-primary/60 transition-colors"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-gray-400 font-bold mb-1">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  placeholder="e.g. john@example.com"
                  value={purchaseForm.email}
                  onChange={(e) => setPurchaseForm((f) => ({ ...f, email: e.target.value }))}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3.5 py-2.5 text-white placeholder:text-gray-600 text-sm focus:outline-none focus:border-brand-primary/60 transition-colors"
                />
              </div>

              {purchaseModalFormat === 'paperback' && (
                <>
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-gray-400 font-bold mb-1">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. +234 803 000 0000 or +44 7000 000000"
                      value={purchaseForm.phone}
                      onChange={(e) => setPurchaseForm((f) => ({ ...f, phone: e.target.value }))}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-3.5 py-2.5 text-white placeholder:text-gray-600 text-sm focus:outline-none focus:border-brand-primary/60 transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-gray-400 font-bold mb-1">
                      Delivery Address <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      required
                      rows={2}
                      placeholder="House / Flat number, Street address, Landmark"
                      value={purchaseForm.address}
                      onChange={(e) => setPurchaseForm((f) => ({ ...f, address: e.target.value }))}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-3.5 py-2.5 text-white placeholder:text-gray-600 text-sm focus:outline-none focus:border-brand-primary/60 transition-colors"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-gray-400 font-bold mb-1">
                        City / State
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Lagos or London"
                        value={purchaseForm.city}
                        onChange={(e) => setPurchaseForm((f) => ({ ...f, city: e.target.value }))}
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3.5 py-2.5 text-white placeholder:text-gray-600 text-sm focus:outline-none focus:border-brand-primary/60 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-gray-400 font-bold mb-1">
                        Country
                      </label>
                      <input
                        type="text"
                        placeholder={
                          currency === 'NGN'
                            ? 'Nigeria'
                            : currency === 'GBP'
                              ? 'United Kingdom'
                              : 'International'
                        }
                        value={purchaseForm.country}
                        onChange={(e) =>
                          setPurchaseForm((f) => ({ ...f, country: e.target.value }))
                        }
                        className="w-full bg-white/5 border border-white/10 rounded-lg px-3.5 py-2.5 text-white placeholder:text-gray-600 text-sm focus:outline-none focus:border-brand-primary/60 transition-colors"
                      />
                    </div>
                  </div>
                </>
              )}

              <button
                type="submit"
                disabled={isProcessing}
                className="w-full mt-4 py-3.5 bg-brand-primary text-white font-black text-sm rounded-full hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-brand-primary/30"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    <span>Processing payment…</span>
                  </>
                ) : (
                  <span>
                    Proceed to Payment ({symbol}
                    {(purchaseModalFormat === 'paperback'
                      ? paperbackAmount
                      : ebookAmount
                    ).toLocaleString()}
                    )
                  </span>
                )}
              </button>
            </form>

            <p className="mt-4 text-center text-[10px] text-gray-500 uppercase tracking-widest leading-relaxed">
              {purchaseModalFormat === 'paperback'
                ? 'Physical order confirmation sent via email. Book packaged and dispatched to your address.'
                : isPreorder
                  ? 'Order receipt sent via email. Download link sent automatically on launch release.'
                  : 'Order receipt & instant download link sent to your email after payment.'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
