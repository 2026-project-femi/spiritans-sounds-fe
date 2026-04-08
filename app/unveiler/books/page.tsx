import { client } from "@/sanity/lib/client";
import { PUBLICATIONS_QUERY } from "@/sanity/lib/queries";
import { BookCard } from "@/components/magazine/BookCard";
import { ExternalLink } from "lucide-react";
import type { Metadata } from "next";

export const revalidate = 3600;

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
  price: string;
  slug: string;
  imageUrl?: string;
  fileUrl?: string;
  publishedAt?: string;
}

const DUMMY_BOOKS: Book[] = [
  {
    _id: "d1",
    title: "Proclaiming Christ Through Art",
    description: "A reflection on how creativity becomes a vehicle for the Gospel — exploring music, writing, and visual art as sacred expression.",
    price: "₦2,500",
    slug: "proclaiming-christ-through-art",
  },
  {
    _id: "d2",
    title: "Treasures Unveiled: Young Voices",
    description: "A compilation of writings, poems, and reflections from recipients of the Young Creators Award — voices that shine before others.",
    price: "₦1,800",
    slug: "treasures-unveiled-young-voices",
  },
];

export default async function BooksPage() {
  let books: Book[] = [];
  try {
    books = await client.fetch(PUBLICATIONS_QUERY);
  } catch (err) {
    console.error("Failed to fetch books:", err);
  }

  const isDummy = books.length === 0;
  const displayBooks = isDummy ? DUMMY_BOOKS : books;

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
        
        {isDummy && (
          <div className="mt-8 inline-flex items-center gap-2 text-xs text-amber-400/80 bg-amber-400/5 border border-amber-400/10 px-5 py-2.5 rounded-full">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            Showing sample catalog — items in Sanity Studio will appear here automatically.
          </div>
        )}
      </section>

      {/* Books Grid */}
      <section className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {displayBooks.map((book) => (
            <BookCard key={book._id} book={book} />
          ))}
        </div>
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
                <a href="/contact"
                    className="inline-flex px-10 py-4 bg-white text-black text-sm font-black rounded-full hover:bg-brand-primary hover:text-white transition-all duration-300 hover:scale-105 uppercase tracking-widest shadow-xl">
                    Submit Your Manuscript
                </a>
            </div>
        </div>
      </section>
    </main>
  );
}
