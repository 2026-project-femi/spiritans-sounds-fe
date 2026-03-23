import { client } from "@/sanity/lib/client";
import { EVENT_QUERY } from "@/sanity/lib/queries";
import Image from "next/image";
import Link from "next/link";
import { PortableText } from "@portabletext/react";
import { portableTextComponents, YouTubeEmbed } from "@/components/PortableTextComponents";
import { ArrowLeft, CalendarDays, MapPin, Clock } from "lucide-react";

export const revalidate = 60;

interface Event {
  _id: string;
  title: string;
  slug: string;
  date: string;
  publishedAt?: string;
  location?: string;
  description?: string;
  body?: any; // Sanity Portable Text
  youtubeUrl?: string;
  excerpt?: string;
  imageUrl?: string;
}

function isUpcoming(dateStr: string) {
  return new Date(dateStr) >= new Date();
}

export default async function SingleEventPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  let event: Event | null = null;
  try {
    event = await client.fetch(EVENT_QUERY, { slug });
  } catch {
    // fall through
  }

  // Dummy fallback for when Sanity has no data
  const displayEvent: Event = event ?? {
    _id: "dummy",
    title: "Treasures Unveiled 2025 — Annual Celebration",
    slug,
    date: "2025-07-12T10:00:00Z",
    location: "Lagos, Nigeria",
    description: `The flagship annual event of the Treasures Unveiler Youth Development Foundation — a joyful gathering of young creatives, mentors, and the wider community to celebrate the gifts God has planted in young hearts.

This year's celebration will feature the presentation of the Young Creators Award, live performances by Spiritans Sound artists, an exhibition of works by young visual artists and writers, and a keynote address on the theme: "Bring Out What Is New and Old."

All are welcome. Come and celebrate the treasures in our midst.`,
    excerpt: "The flagship annual event of TUYDF — celebrating young creatives, presenting the Young Creators Award, and gathering the community in faith and joy.",
  };

  const upcoming = isUpcoming(displayEvent.date);
  const isDummy = !event;

  const formattedDate = new Date(displayEvent.date).toLocaleDateString("en-NG", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const formattedTime = new Date(displayEvent.date).toLocaleTimeString("en-NG", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <main className="pb-24">
      {/* Back */}
      <div className="max-w-4xl mx-auto px-6 pt-10">
        <Link href="/unveiler"
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-brand-primary transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Events
        </Link>
      </div>

      {/* Hero Image */}
      {displayEvent.imageUrl && (
        <div className="max-w-4xl mx-auto px-6 mt-6">
          <div className="aspect-video relative rounded-2xl overflow-hidden">
            <Image src={displayEvent.imageUrl} alt={displayEvent.title} fill className="object-cover" />
          </div>
        </div>
      )}

      {/* Content */}
      <article className="max-w-3xl mx-auto px-6 mt-10 space-y-6">
        {isDummy && (
          <div className="inline-flex items-center gap-2 text-xs text-amber-400/80 bg-amber-400/10 border border-amber-400/20 px-3 py-1.5 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            Sample content — add this event in Sanity Studio
          </div>
        )}

        {/* Status */}
        <span className={`inline-block text-[10px] tracking-widest uppercase font-bold px-3 py-1.5 rounded-full ${
          upcoming
            ? "bg-green-500/20 text-green-400 border border-green-500/30"
            : "bg-white/10 text-gray-400 border border-white/10"
        }`}>
          {upcoming ? "Upcoming Event" : "Past Event"}
        </span>

        <h1 className="text-4xl md:text-5xl font-extrabold text-white leading-tight">
          {displayEvent.title}
        </h1>

        {/* Meta */}
        <div className="flex flex-wrap gap-5 text-sm text-gray-400 pb-6 border-b border-white/10">
          <span className="flex items-center gap-2">
            <CalendarDays className="w-4 h-4 text-brand-primary/60" />
            {formattedDate}
          </span>
          <span className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-brand-primary/60" />
            {formattedTime}
          </span>
          {displayEvent.location && (
            <span className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-brand-primary/60" />
              {displayEvent.location}
            </span>
          )}
        </div>

        {/* YouTube embed */}
        {displayEvent.youtubeUrl && (
          <YouTubeEmbed url={displayEvent.youtubeUrl} />
        )}

        {/* Body */}
        <div className="prose prose-invert prose-red max-w-none">
          {displayEvent.body ? (
            <PortableText value={displayEvent.body} components={portableTextComponents} />
          ) : (
            (displayEvent.description || displayEvent.excerpt || "").split("\n\n").map((para, i) => (
              <p key={i} className="text-gray-300 leading-relaxed text-lg mb-5">
                {para}
              </p>
            ))
          )}
        </div>

        {/* CTA for upcoming */}
        {upcoming && (
          <div className="mt-10 p-8 rounded-2xl bg-linear-to-br from-red-950/20 to-red-900/20 border border-brand-primary/20 text-center space-y-4">
            <h2 className="text-2xl font-bold text-white">Join Us</h2>
            <p className="text-gray-400">
              This event is coming up. We&apos;d love to see you there. Reach out for more details or to register.
            </p>
            <Link href="/contact"
              className="inline-block px-8 py-3 bg-linear-to-r from-brand-primary to-red-700 text-white font-semibold rounded-full hover:opacity-90 transition-all hover:scale-105">
              Get in Touch
            </Link>
          </div>
        )}
      </article>
    </main>
  );
}
