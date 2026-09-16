import { getPayload } from "payload";
import configPromise from "@/payload.config";
import { BookSearchList } from "@/components/magazine/BookSearchList";
import { ExternalLink } from "lucide-react";
import { PreorderBanner } from "@/components/magazine/PreorderBanner";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Books & Publications",
  description: "Faith-rooted books and publications from Treasures Unveiler — resources for young people, ministers, and all who seek.",
  openGraph: {
    title: "Books & Publications | Spiritans Sound",
    description: "Faith-rooted books and publications from Treasures Unveiler — resources for young people, ministers, and all who seek.",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
  },
  twitter: { card: "summary_large_image" },
};

interface Book {
  _id: string;
  title: string;
  description: string;
  price?: string;
  priceAmount?: number;
  priceAmountUSD?: number;
  priceAmountGBP?: number;
  slug: string;
  authorName?: string;
  imageUrl?: string;
  fileUrl?: string;
  publishedAt?: string;
  isPreorder?: boolean;
}

export default async function BooksPage() {
  let books: Book[] = [];
  try {
    const payload = await getPayload({ config: configPromise });
    const result = await payload.find({ collection: 'publications', where: { _status: { equals: 'published' } }, sort: '-publishedAt', limit: 100 });
    books = result.docs.map((d) => {
      const doc = d as unknown as Record<string, unknown>;
      return {
        ...doc,
        _id: String(doc.id),
        authorName: doc.author && typeof doc.author === 'object' && 'name' in doc.author ? String((doc.author as { name: string }).name) : undefined,
        imageUrl: doc.cover && typeof doc.cover === 'object' && 'url' in doc.cover ? String((doc.cover as { url: string }).url) : undefined,
        fileUrl: doc.file && typeof doc.file === 'object' && 'url' in doc.file ? String((doc.file as { url: string }).url) : undefined,
        isPreorder: Boolean(doc.isPreorder),
      };
    }) as Book[];
  } catch (err) {
    console.error("Failed to fetch books:", err);
  }

  const preorderBooks = books.filter((b) => b.isPreorder);

  return (
    <main className="pb-24">
      {/* Header */}
      <section className="px-6 py-20 text-center max-w-3xl mx-auto">
        <span className="inline-block text-[10px] tracking-[0.4em] uppercase text-brand-primary font-semibold border border-brand-primary/30 px-4 py-1.5 rounded-full mb-6">
          Book Publishing
        </span>
        <h1 className="text-5xl font-extrabold text-white mb-6">
          Words That Form,<br />
          <span className="text-transparent bg-clip-text bg-linear-to-r from-brand-primary to-red-600">
            Inspire & Send Forth
          </span>
        </h1>
        <p className="text-gray-400 text-lg leading-relaxed">
          Treasures Unveiler publishes books rooted in faith, creativity, and mission — 
          resources for young people, ministers, and all who seek to bring out what is new and old from the treasury.
        </p>
      </section>

      {/* Featured Behind the Veil Launch Funnel Banner */}
      <section className="max-w-7xl mx-auto px-6 mb-14">
        <div className="relative overflow-hidden rounded-3xl border border-brand-primary/40 bg-gradient-to-br from-[#1c080b] via-[#120a0d] to-[#0a0a0c] p-7 sm:p-10 text-white shadow-2xl">
          <div className="absolute top-0 right-0 -mr-20 -mt-20 size-80 rounded-full bg-brand-primary/15 blur-3xl pointer-events-none" />
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
              <div className="relative w-28 sm:w-36 shrink-0 aspect-[2/3] rounded-md overflow-hidden shadow-2xl border border-brand-primary/30 group-hover:scale-105 transition-transform">
                <Image
                  src="/images/behind-the-veil/behind-the-veil-front-cover.jpg"
                  alt="Behind the Veil cover"
                  width={200}
                  height={300}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="max-w-xl">
                <div className="inline-flex items-center gap-2 rounded-full border border-brand-primary/40 bg-brand-primary/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-brand-primary mb-3">
                  Featured Book Launch · 21 Nov 2026
                </div>
                <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-black text-white leading-tight">
                  Behind the Veil
                </h2>
                <p className="text-sm sm:text-base text-gray-300 font-serif italic mt-1">
                  How to Detect Deception and Deal with Liars
                </p>
                <p className="text-xs text-gray-400 uppercase tracking-widest mt-1">
                  By Fr. Oluwafemi Victor Orilua, CSSp
                </p>
                <p className="text-sm text-gray-300 mt-3 line-clamp-2 leading-relaxed">
                  A pastoral and psychological guide to seeing clearly — for anyone who has ever sensed that something was wrong long before they could name it.
                </p>
              </div>
            </div>

            <div className="shrink-0 flex flex-col sm:flex-row md:flex-col gap-3 w-full sm:w-auto">
              <Link
                href="/unveiler/books/behind-the-veil"
                className="inline-flex items-center justify-center px-8 py-4 rounded-full bg-brand-primary text-white text-xs font-bold uppercase tracking-widest hover:bg-brand-primary/90 transition-all shadow-lg shadow-brand-primary/25 hover:scale-102"
              >
                Join Online Launch & Register →
              </Link>
              <Link
                href="/unveiler/books/behind-the-veil#purchase"
                className="inline-flex items-center justify-center px-8 py-3.5 rounded-full border border-white/20 bg-white/5 text-white text-xs font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-all"
              >
                Explore Book Editions
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Pre-Order Promotional Showcase Banner */}
      <section className="max-w-7xl mx-auto px-6 mb-16">
        <PreorderBanner books={preorderBooks} />
      </section>

      {/* Books Search & Grid */}
      <section className="max-w-7xl mx-auto px-6">
        <BookSearchList books={books} />
      </section>

      {/* Publishing Submissions CTA */}
      <section className="max-w-4xl mx-auto px-6 py-24 text-center">
        <div className="relative group overflow-hidden">
            <div className="absolute inset-0 bg-linear-to-br from-brand-primary to-red-900 blur-[80px] opacity-10 group-hover:opacity-20 transition-opacity" />
            <div className="relative p-12 rounded-3xl border border-white/5 bg-black/40 backdrop-blur-sm shadow-2xl">
                <ExternalLink className="w-12 h-12 text-brand-primary mx-auto mb-6" />
                <h2 className="text-4xl font-black text-white mb-6 tracking-tight">Want to Publish With Us?</h2>
                <p className="text-gray-400 mb-10 leading-relaxed text-lg font-light max-w-2xl mx-auto">
                    Are you a young creative with a manuscript, a collection of poems, or a faith-filled story to tell? 
                    Treasures Unveiler is committed to giving young voices a platform. Join our stable of authors.
                </p>
                <Link href="/unveiler/publish"
                    className="inline-flex px-10 py-4 bg-white text-black text-sm font-black rounded-full hover:bg-brand-primary hover:text-white transition-all duration-300 hover:scale-105 uppercase tracking-widest shadow-xl">
                    Submit Your Manuscript
                </Link>
            </div>
        </div>
      </section>
    </main>
  );
}
