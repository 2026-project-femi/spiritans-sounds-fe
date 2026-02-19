import { client } from "@/sanity/lib/client";
import {
  EVENTS_QUERY,
  EVENTS_COUNT_QUERY,
  FEATURED_EVENT_QUERY,
  POPULAR_EVENTS_QUERY,
} from "@/sanity/lib/queries";
import Image from "next/image";
import Link from "next/link";
import {
  CalendarDays,
  MapPin,
  Clock,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Flame,
  Star,
  Users,
  Award,
} from "lucide-react";

export const revalidate = 60;

const POSTS_PER_PAGE = 6;

interface Event {
  _id: string;
  title: string;
  slug: string;
  date: string;
  publishedAt?: string;
  location?: string;
  description?: string;
  excerpt?: string;
  imageUrl?: string;
  eventType?: "celebration" | "workshop" | "retreat" | "concert" | "symposium" | "news" | "other";
  isFeatured?: boolean;
  isPopular?: boolean;
}

// ─── Helpers ───────────────────────────────────────────────────────────────────
function isUpcoming(dateStr: string) {
  return new Date(dateStr) >= new Date();
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-NG", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function formatDateLong(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-NG", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

const eventTypeLabels: Record<string, string> = {
  celebration: "Annual Celebration",
  workshop: "Workshop",
  retreat: "Retreat",
  concert: "Concert / Performance",
  symposium: "Symposium / Conference",
  news: "News",
  other: "Other",
};

// ─── Hero / Featured Event ─────────────────────────────────────────────────────
function HeroEvent({ event, isDummy }: { event: Event; isDummy: boolean }) {
  const upcoming = isUpcoming(event.date);
  const excerpt = event.excerpt || event.description || "";

  const inner = (
    <article className="group relative rounded-3xl overflow-hidden border border-brand-primary/30 bg-linear-to-br from-red-950/40 via-[#0c0c0e] to-red-900/40 hover:border-brand-primary/60 transition-all duration-500 shadow-2xl">
      <div className="flex flex-col lg:flex-row min-h-[450px]">
        {/* Image Section */}
        <div className="lg:w-3/5 relative overflow-hidden bg-linear-to-br from-red-950/30 to-red-900/40">
          {event.imageUrl ? (
            <Image
              src={event.imageUrl}
              alt={event.title}
              fill
              priority
              className="object-cover group-hover:scale-105 transition-transform duration-1000"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <CalendarDays className="w-24 h-24 text-brand-primary/10" />
            </div>
          )}
          <div className="absolute inset-0 bg-linear-to-r from-black/60 via-transparent to-transparent hidden lg:block" />
          <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent lg:hidden" />

          {/* Badges */}
          <div className="absolute top-6 left-6 flex gap-3 z-20">
            <span className="text-[10px] tracking-widest uppercase font-black px-4 py-2 rounded-full bg-brand-primary text-white shadow-lg">
              Featured Event
            </span>
            <span
              className={`text-[10px] tracking-widest uppercase font-bold px-4 py-2 rounded-full backdrop-blur-md ${
                upcoming
                  ? "bg-green-500/20 text-green-400 border border-green-500/30"
                  : "bg-white/10 text-gray-400 border border-white/10"
              }`}
            >
              {upcoming ? "Upcoming" : "Past Event"}
            </span>
          </div>
        </div>

        {/* Content Section */}
        <div className="lg:w-2/5 p-8 lg:p-12 flex flex-col justify-center relative z-10">
          <div className="space-y-6">
            <div className="flex flex-col gap-2">
              <span className="flex items-center gap-2 text-xs font-bold text-brand-primary uppercase tracking-widest">
                <Star className="w-4 h-4 fill-brand-primary" />
                Special Feature
              </span>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-white leading-tight">
                {event.title}
              </h2>
            </div>

            <div className="flex flex-col gap-3 text-sm text-gray-400">
              <span className="flex items-center gap-2 font-medium">
                <Clock className="w-4 h-4 text-brand-primary" />
                {formatDateLong(event.date)}
              </span>
              {event.location && (
                <span className="flex items-center gap-2 font-medium">
                  <MapPin className="w-4 h-4 text-brand-primary" />
                  {event.location}
                </span>
              )}
            </div>

            {excerpt && (
              <p className="text-gray-300 leading-relaxed text-lg line-clamp-4 font-light">
                {excerpt}
              </p>
            )}

            <div className="pt-4">
              <div className="inline-flex items-center gap-3 px-8 py-4 bg-linear-to-r from-brand-primary to-red-700 text-white font-bold rounded-full hover:opacity-90 transition-all duration-300 hover:scale-105 shadow-xl shadow-red-900/20">
                Explore Event Details <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>
  );

  if (isDummy) return inner;
  return <Link href={`/unveiler/events/${event.slug}`}>{inner}</Link>;
}

// ─── Event Card (grid) ─────────────────────────────────────────────────────────
function EventCard({ event, isDummy }: { event: Event; isDummy: boolean }) {
  const upcoming = isUpcoming(event.date);
  const excerpt = event.excerpt || event.description || "";

  const inner = (
    <article className="group flex flex-col rounded-2xl overflow-hidden border border-white/5 bg-[#121214] hover:border-brand-primary/30 transition-all duration-300 h-full">
      {/* Image Container */}
      <div className="aspect-16/9 relative overflow-hidden bg-[#1a1a1e]">
        {event.imageUrl ? (
          <Image
            src={event.imageUrl}
            alt={event.title}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-700"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <CalendarDays className="w-10 h-10 text-brand-primary/10" />
          </div>
        )}
        <div className="absolute inset-0 bg-linear-to-t from-[#121214] via-transparent to-transparent opacity-60" />

        {/* Status indicator */}
        <div className="absolute bottom-4 left-4">
          <span
            className={`text-[9px] tracking-widest uppercase font-black px-3 py-1.5 rounded-full backdrop-blur-md ${
              upcoming
                ? "bg-green-500/20 text-green-400 border border-green-500/30"
                : "bg-black/40 text-gray-500 border border-white/5"
            }`}
          >
            {upcoming ? "Upcoming" : "Past"}
          </span>
        </div>

        {event.eventType && (
          <div className="absolute top-4 right-4">
            <span className="text-[9px] tracking-widest uppercase font-bold px-3 py-1.5 rounded-full bg-linear-to-r from-brand-primary/80 to-red-600/80 text-white shadow-lg">
              {eventTypeLabels[event.eventType]}
            </span>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-6 flex flex-col flex-1 gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-3 text-[10px] uppercase tracking-[0.2em] font-bold text-gray-500">
            <span className="text-brand-primary">{formatDate(event.date)}</span>
            {event.location && (
              <>
                <span className="w-1 h-1 rounded-full bg-gray-700" />
                <span className="line-clamp-1">{event.location}</span>
              </>
            )}
          </div>
          <h3 className="text-xl font-bold text-white group-hover:text-red-400 transition-colors leading-tight line-clamp-2">
            {event.title}
          </h3>
        </div>

        {excerpt && (
          <p className="text-sm text-gray-400 leading-relaxed line-clamp-3 flex-1 font-light">
            {excerpt}
          </p>
        )}

        <div className="pt-2 border-t border-white/5 flex items-center justify-between group/btn">
          <span className="text-xs font-bold text-brand-primary uppercase tracking-widest group-hover/btn:text-red-400 transition-colors">
            Read Story
          </span>
          <ArrowRight className="w-4 h-4 text-brand-primary group-hover/btn:translate-x-1 transition-transform" />
        </div>
      </div>
    </article>
  );

  if (isDummy) return <div className="opacity-70 cursor-not-allowed h-full">{inner}</div>;
  return <Link href={`/unveiler/events/${event.slug}`} className="h-full">{inner}</Link>;
}

// ─── Sidebar ───────────────────────────────────────────────────────────────────
function EventsSidebar({
  upcoming,
  recent,
  popular,
  isDummy,
}: {
  upcoming: Event[];
  recent: Event[];
  popular: Event[];
  isDummy: boolean;
}) {
  const SidebarItem = ({ event, showPopularMark }: { event: Event; showPopularMark?: boolean }) => {
    const item = (
      <div className="group flex gap-4 items-center py-4 border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors px-2 rounded-lg cursor-pointer">
        <div className="w-16 h-16 shrink-0 rounded-xl overflow-hidden bg-[#1a1a1e] relative shadow-inner">
          {event.imageUrl ? (
            <Image
              src={event.imageUrl}
              alt={event.title}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-500"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <CalendarDays className="w-6 h-6 text-brand-primary/20" />
            </div>
          )}
          {showPopularMark && (
            <div className="absolute top-0 right-0 p-1">
              <Flame className="w-3 h-3 text-brand-primary fill-brand-primary" />
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[9px] font-black text-brand-primary uppercase tracking-widest">
              {formatDate(event.date)}
            </span>
            {isUpcoming(event.date) && (
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-sm shadow-green-900" />
            )}
          </div>
          <h4 className="text-sm font-bold text-gray-200 group-hover:text-brand-primary transition-colors leading-snug line-clamp-2">
            {event.title}
          </h4>
        </div>
      </div>
    );

    if (isDummy) return item;
    return <Link href={`/unveiler/events/${event.slug}`}>{item}</Link>;
  };

  return (
    <aside className="space-y-12 lg:sticky lg:top-[120px]">
      {/* Upcoming Events */}
      <section className="bg-[#0c0c0e] rounded-2xl border border-white/5 p-6 shadow-xl">
        <h3 className="text-xs tracking-[0.3em] uppercase font-black text-white mb-6 flex items-center gap-3">
          <span className="w-8 h-[1px] bg-brand-primary" />
          Upcoming
        </h3>
        <div className="space-y-1">
          {upcoming.length > 0 ? (
            upcoming.slice(0, 4).map((e) => <SidebarItem key={e._id} event={e} />)
          ) : (
            <p className="text-xs text-gray-600 italic px-2">No upcoming events scheduled.</p>
          )}
        </div>
      </section>

      {/* Popular Events */}
      <section className="bg-[#0c0c0e] rounded-2xl border border-white/5 p-6 shadow-xl">
        <h3 className="text-xs tracking-[0.3em] uppercase font-black text-white mb-6 flex items-center gap-3">
          <span className="w-8 h-[1px] bg-red-700" />
          Popular
        </h3>
        <div className="space-y-1">
          {popular.length > 0 ? (
            popular.slice(0, 4).map((e) => <SidebarItem key={e._id} event={e} showPopularMark />)
          ) : (
            <p className="text-xs text-gray-600 italic px-2">No popular events marked.</p>
          )}
        </div>
      </section>

      {/* Recent Activity */}
      <section className="bg-[#0c0c0e] rounded-2xl border border-white/5 p-6 shadow-xl">
        <h3 className="text-xs tracking-[0.3em] uppercase font-black text-white mb-6 flex items-center gap-3">
          <span className="w-8 h-[1px] bg-gray-600" />
          Recent
        </h3>
        <div className="space-y-1">
          {recent.length > 0 ? (
            recent.slice(0, 4).map((e) => <SidebarItem key={e._id} event={e} />)
          ) : (
            <p className="text-xs text-gray-600 italic px-2">No recent past events.</p>
          )}
        </div>
      </section>

      {/* Newsletter - Premium Design */}
      <section className="relative overflow-hidden group">
        <div className="absolute inset-0 bg-linear-to-br from-brand-primary to-red-800 blur-[60px] opacity-20 group-hover:opacity-30 transition-opacity" />
        <div className="relative p-8 rounded-3xl border border-brand-primary/20 bg-black/40 backdrop-blur-xl">
          <Users className="w-10 h-10 text-brand-primary mb-4" />
          <h3 className="text-xl font-black text-white mb-2 tracking-tight">The Unveiler Digest</h3>
          <p className="text-xs text-gray-400 mb-6 leading-relaxed">
            Join 2,000+ creators and believers. Get event invites and spiritual treasures in your inbox.
          </p>
          <div className="space-y-3">
            <input
              type="email"
              placeholder="Your sacred email"
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-gray-600 focus:outline-none focus:border-brand-primary/50 transition-all text-xs"
            />
            <button className="w-full py-3 bg-white text-black text-xs font-black rounded-xl hover:bg-brand-primary hover:text-white transition-all duration-300 uppercase tracking-widest">
              Join The Mission
            </button>
          </div>
        </div>
      </section>
    </aside>
  );
}

// ─── Pagination ────────────────────────────────────────────────────────────────
function Pagination({ currentPage, totalPages }: { currentPage: number; totalPages: number }) {
  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
        pages.push(i);
      } else if (pages[pages.length - 1] !== "...") {
        pages.push("...");
      }
    }
    return pages;
  };

  return (
    <div className="flex items-center justify-center gap-2 pt-12">
      {currentPage > 1 && (
        <Link
          href={`/unveiler?page=${currentPage - 1}`}
          className="w-10 h-10 flex items-center justify-center rounded-xl border border-white/5 bg-white/3 text-gray-400 hover:border-brand-primary/40 hover:text-brand-primary transition-all"
        >
          <ChevronLeft className="w-5 h-5" />
        </Link>
      )}

      {getPageNumbers().map((p, i) =>
        typeof p === "number" ? (
          <Link
            key={i}
            href={`/unveiler?page=${p}`}
            className={`w-10 h-10 flex items-center justify-center rounded-xl text-sm font-black transition-all ${
              p === currentPage
                ? "bg-linear-to-r from-brand-primary to-red-600 text-white shadow-lg shadow-red-900/30"
                : "border border-white/5 bg-white/3 text-gray-500 hover:border-brand-primary/40 hover:text-brand-primary"
            }`}
          >
            {p}
          </Link>
        ) : (
          <span key={i} className="text-gray-700 px-1">
            ...
          </span>
        )
      )}

      {currentPage < totalPages && (
        <Link
          href={`/unveiler?page=${currentPage + 1}`}
          className="w-10 h-10 flex items-center justify-center rounded-xl border border-white/5 bg-white/3 text-gray-400 hover:border-brand-primary/40 hover:text-brand-primary transition-all"
        >
          <ChevronRight className="w-5 h-5" />
        </Link>
      )}
    </div>
  );
}

// ─── Main Page ──────────────────────────────────────────────────────────────────
export default async function UnveilerHomePage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page: pageParam } = await searchParams;
  const currentPage = Math.max(1, parseInt(pageParam ?? "1", 10));

  let featuredEvent: Event | null = null;
  let paginatedEvents: Event[] = [];
  let popularEvents: Event[] = [];
  let totalCount = 0;
  let isDummy = false;

  try {
    featuredEvent = await client.fetch(FEATURED_EVENT_QUERY);
    popularEvents = await client.fetch(POPULAR_EVENTS_QUERY);

    const start = (currentPage - 1) * POSTS_PER_PAGE;
    const end = start + POSTS_PER_PAGE;

    // Fetch all events for counts and lists
    const allRecent = await client.fetch(EVENTS_QUERY, { start: 0, end: 100 });
    totalCount = await client.fetch(EVENTS_COUNT_QUERY);

    // Filter out the featured event from the main grid to avoid duplication
    paginatedEvents = (allRecent as Event[]).filter((e) => e._id !== featuredEvent?._id).slice(start, end);

    if (allRecent.length === 0) throw new Error("No events found");
  } catch (err) {
    isDummy = true;
    // Enhanced dummy data matching new schema fields
    const mockEvents: Event[] = [
      {
        _id: "d1",
        title: "Treasures Unveiled 2025 — Annual Celebration",
        slug: "treasures-unveiled-2025",
        date: "2025-07-12T10:00:00Z",
        location: "Lagos, Nigeria",
        excerpt: "The flagship annual event of TUYDF — celebrating young creatives, presenting awards, and gathering in faith.",
        isFeatured: true,
        eventType: "celebration",
      },
      ...Array.from({ length: 12 }).map((_, i) => ({
        _id: `d${i + 2}`,
        title: `Community Outreach Program #${i + 2}`,
        slug: `outreach-${i + 2}`,
        date: new Date(Date.now() - (i - 2) * 86400000 * 10).toISOString(),
        location: "Ibadan, Nigeria",
        excerpt: "Building faith through community action and creative engagement.",
        eventType: i % 3 === 0 ? "workshop" : "retreat" as any,
        isPopular: i < 3,
      })),
    ];

    featuredEvent = mockEvents.find((e) => e.isFeatured) || mockEvents[0];
    popularEvents = mockEvents.filter((e) => e.isPopular);
    const remaining = mockEvents.filter((e) => e._id !== featuredEvent?._id);
    totalCount = remaining.length;
    const start = (currentPage - 1) * POSTS_PER_PAGE;
    paginatedEvents = remaining.slice(start, start + POSTS_PER_PAGE);
  }

  // Sidebar grouping logic
  const upcomingEvents = (isDummy ? paginatedEvents : paginatedEvents).filter((e) => isUpcoming(e.date)).slice(0, 4);
  const recentActivity = (isDummy ? paginatedEvents : paginatedEvents).filter((e) => !isUpcoming(e.date)).slice(0, 4);

  // Group events by type for sections (only on page 1)
  const groupedEvents = paginatedEvents.reduce((acc, event) => {
    const type = event.eventType || "other";
    if (!acc[type]) acc[type] = [];
    acc[type].push(event);
    return acc;
  }, {} as Record<string, Event[]>);

  const totalPages = Math.ceil(totalCount / POSTS_PER_PAGE);

  return (
    <main className="min-h-screen bg-[#08080a] text-foreground pb-32">
      {/* Dynamic Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-primary/5 blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-red-800/5 blur-[120px]" />
      </div>

      <div className="relative z-10">
        {/* Page Title Section */}
        <section className="px-6 pt-16 pb-12 max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-[2px] bg-brand-primary" />
                <span className="text-xs tracking-[0.4em] uppercase text-brand-primary font-extrabold">
                  Spiritans Outreach
                </span>
              </div>
              <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter">
                UNVEILER <span className="text-gray-700">FEED</span>
              </h1>
              <p className="text-gray-500 max-w-xl font-medium">
                The pulse of the Treasures Unveiler Youth Development Foundation — 
                news, workshops, celebrations, and missionary stories.
              </p>
            </div>

            {isDummy && (
              <div className="flex items-center gap-2 text-xs text-amber-400 bg-amber-400/5 border border-amber-400/10 px-5 py-2.5 rounded-full">
                <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                Demo Archive Mode
              </div>
            )}
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-6 space-y-16">
          {/* 1. Hero / Featured (Only Page 1) */}
          {currentPage === 1 && featuredEvent && (
            <section>
              <HeroEvent event={featuredEvent} isDummy={isDummy} />
            </section>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-16">
            {/* ─── Main Content ─── */}
            <div className="space-y-20">
              {/* 2. Grouped Sections (Example: Celebrations) - Only on Page 1 */}
              {currentPage === 1 && groupedEvents["celebration"] && (
                <section className="space-y-10">
                  <div className="flex items-center gap-4">
                    <Award className="w-6 h-6 text-brand-primary" />
                    <h2 className="text-2xl font-black text-white uppercase tracking-tight">Focus: Celebrations</h2>
                    <div className="flex-1 h-[1px] bg-white/5" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {groupedEvents["celebration"].map((event) => (
                      <EventCard key={event._id} event={event} isDummy={isDummy} />
                    ))}
                  </div>
                </section>
              )}

              {/* 3. Main Stream (Paginated Grid) */}
              <section className="space-y-10">
                <div className="flex items-center gap-4">
                  <Users className="w-6 h-6 text-red-700" />
                  <h2 className="text-2xl font-black text-white uppercase tracking-tight">
                    {currentPage === 1 ? "Latest Activity" : `Archive - Page ${currentPage}`}
                  </h2>
                  <div className="flex-1 h-[1px] bg-white/5" />
                </div>

                {paginatedEvents.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {paginatedEvents
                      .filter(e => currentPage !== 1 || e.eventType !== "celebration")
                      .map((event) => (
                        <EventCard key={event._id} event={event} isDummy={isDummy} />
                      ))}
                  </div>
                ) : (
                  <div className="bg-white/5 border border-dashed border-white/10 rounded-2xl p-20 text-center">
                    <CalendarDays className="w-16 h-16 text-gray-800 mx-auto mb-4" />
                    <p className="text-gray-500 text-lg">The archive is empty at this depth.</p>
                  </div>
                )}

                <Pagination currentPage={currentPage} totalPages={totalPages} />
              </section>
            </div>

            {/* ─── Sidebar ─── */}
            <div className="hidden lg:block">
              <EventsSidebar
                upcoming={upcomingEvents}
                popular={popularEvents}
                recent={recentActivity}
                isDummy={isDummy}
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}