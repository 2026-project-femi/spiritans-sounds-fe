import { getPayload } from "payload";
import configPromise from "@/payload.config";
import { BookSearchList } from "@/components/magazine/BookSearchList";
import { ExternalLink } from "lucide-react";
import { PreorderBanner } from "@/components/magazine/PreorderBanner";
import type { Metadata } from "next";
import Link from "next/link";

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
    books = result.docs.map((d: any) => ({
      ...d,
      _id: d.id,
      authorName: d.author && typeof d.author === 'object' ? d.author.name : undefined,
      imageUrl: d.cover && typeof d.cover === 'object' ? d.cover.url : undefined,
      fileUrl: d.file && typeof d.file === 'object' ? d.file.url : undefined,
      isPreorder: d.isPreorder,
    })) as Book[];
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
