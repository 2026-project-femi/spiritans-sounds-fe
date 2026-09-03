import { getPayload } from "payload";
import configPromise from "@/payload.config";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft, Calendar, BookOpen, User } from "lucide-react";
import { ShareBookButton } from "@/components/magazine/ShareBookButton";
import { BookPurchaseForm } from "./BookPurchaseForm";
import { TrackContentRead } from "@/components/analytics/TrackContentRead";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const payload = await getPayload({ config: configPromise });
  const result = await payload.find({
    collection: "publications",
    where: { slug: { equals: slug }, _status: { equals: "published" } },
    limit: 1,
  });

  if (!result.docs || result.docs.length === 0) {
    return { title: "Book Not Found" };
  }

  const book = result.docs[0] as any;
  return {
    title: `${book.title} | Spiritans Sound`,
    description: book.description,
    openGraph: {
      title: `${book.title} | Spiritans Sound`,
      description: book.description,
      images: book.cover?.url ? [{ url: book.cover.url }] : [],
    },
  };
}

export default async function BookDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const payload = await getPayload({ config: configPromise });
  
  const result = await payload.find({
    collection: "publications",
    where: { slug: { equals: slug }, _status: { equals: "published" } },
    limit: 1,
  });

  if (!result.docs || result.docs.length === 0) {
    notFound();
  }

  const doc = result.docs[0] as any;
  const book = {
    _id: doc.id,
    title: doc.title,
    description: doc.description,
    price: doc.price,
    priceAmount: doc.priceAmount,
    priceAmountUSD: doc.priceAmountUSD,
    priceAmountGBP: doc.priceAmountGBP,
    slug: doc.slug,
    authorName: doc.author && typeof doc.author === 'object' ? doc.author.name : undefined,
    imageUrl: doc.cover && typeof doc.cover === 'object' ? doc.cover.url : undefined,
    fileUrl: doc.file && typeof doc.file === 'object' ? doc.file.url : undefined,
    publishedAt: doc.publishedAt,
    isPreorder: doc.isPreorder,
  };

  return (
    <main className="min-h-screen bg-[#08080a] text-foreground pb-32">
      <TrackContentRead
        id={String(book._id)}
        slug={book.slug}
        title={book.title}
        author={book.authorName}
        type="book"
        collection="publications"
      />
      <div className="max-w-6xl mx-auto px-6 pt-12">
        <div className="flex items-center justify-between mb-12 flex-wrap gap-4">
          <Link
            href="/unveiler/books"
            className="inline-flex items-center gap-2 text-brand-primary hover:text-white transition-colors text-sm font-bold uppercase tracking-widest"
          >
            <ChevronLeft size={16} /> Back to Library
          </Link>
          <ShareBookButton title={book.title} slug={book.slug} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-16 items-start">
          {/* Cover Section */}
          <div className="relative aspect-3/4 rounded-3xl overflow-hidden bg-linear-to-br from-red-950/30 to-red-900/40 border border-white/10 shadow-2xl shadow-red-950/50">
            {book.imageUrl ? (
              <Image
                src={book.imageUrl}
                alt={book.title}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 400px"
                className="object-cover"
              />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-8 text-center">
                <BookOpen className="w-24 h-24 text-brand-primary/20" />
                <span className="text-xs uppercase tracking-widest text-gray-500 font-bold">
                  Treasures Unveiler Publication
                </span>
              </div>
            )}
          </div>

          {/* Details Section */}
          <div className="space-y-8 py-4">
            <div className="space-y-4">
              <span className={`inline-block px-4 py-1.5 rounded-full border text-[10px] font-black uppercase tracking-[0.3em] ${book.isPreorder ? 'border-amber-400/30 text-amber-400 bg-amber-400/10' : 'border-brand-primary/30 text-brand-primary'}`}>
                {book.isPreorder ? 'Pre-Order Available' : 'Publication'}
              </span>
              <h1 className="text-4xl md:text-5xl font-black text-white leading-tight">
                {book.title}
              </h1>
              
              <div className="flex flex-wrap items-center gap-6 text-sm">
                {book.authorName && (
                  <div className="flex items-center gap-2 text-gray-300 font-medium bg-white/5 px-4 py-2 rounded-full border border-white/10">
                    <User size={16} className="text-brand-primary" />
                    By {book.authorName}
                  </div>
                )}
                {book.publishedAt && (
                  <div className="flex items-center gap-2 text-gray-500 font-bold uppercase tracking-widest">
                    <Calendar size={16} />
                    {new Date(book.publishedAt).getFullYear()}
                  </div>
                )}
              </div>
            </div>

            <div className="w-16 h-[2px] bg-white/10" />

            <div className="prose prose-invert prose-lg max-w-none text-gray-400 font-light leading-relaxed">
              <p>{book.description}</p>
            </div>

            {/* Interactive Purchase/Download Section */}
            <BookPurchaseForm book={book} />
          </div>
        </div>
      </div>
    </main>
  );
}
