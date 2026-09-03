"use client";

import Link from "next/link";
import Image from "next/image";
import { Sparkles, BookOpen, Clock, HeartHandshake, ArrowRight, ShieldCheck } from "lucide-react";

export interface PreorderBook {
  _id: string;
  title: string;
  description?: string;
  slug: string;
  authorName?: string;
  imageUrl?: string;
  price?: string;
  priceAmount?: number;
}

interface PreorderBannerProps {
  book?: PreorderBook;
  books?: PreorderBook[];
}

export function PreorderBanner({ book, books }: PreorderBannerProps) {
  // Normalize books list
  const preorderList: PreorderBook[] = books && books.length > 0 ? books : book ? [book] : [];

  return (
    <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1a1208] via-[#0d0904] to-[#08080a] border border-amber-500/30 p-8 md:p-12 shadow-2xl shadow-amber-950/20">
      {/* Decorative ambient lighting */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-amber-600/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className={preorderList.length > 0 ? "lg:col-span-7 space-y-6" : "lg:col-span-12 space-y-6"}>
          {/* Tag */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-black uppercase tracking-[0.25em]">
            <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
            <span>{preorderList.length > 1 ? `Book Pre-Orders (${preorderList.length} Available)` : "Book Pre-Order"}</span>
          </div>

          {/* Heading & Subtitle */}
          <div className="space-y-3">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-white leading-tight tracking-tight">
              Reserve Your Copy Before Release
            </h2>
            <p className="text-gray-300 text-base md:text-lg font-light leading-relaxed max-w-3xl">
              Be among the first to receive this book when it is officially released. By pre-ordering, you secure your copy in advance and support the author and Spiritans Sound in promoting a culture of reading, writing and publishing.
            </p>
          </div>

          {/* Feature Highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            <div className="flex items-start gap-3 bg-white/5 border border-white/10 p-4 rounded-xl">
              <Clock className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-amber-300">Early Access</h4>
                <p className="text-xs text-gray-400 mt-1">Guaranteed copy immediately upon release</p>
              </div>
            </div>

            <div className="flex items-start gap-3 bg-white/5 border border-white/10 p-4 rounded-xl">
              <HeartHandshake className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-amber-300">Support Authors</h4>
                <p className="text-xs text-gray-400 mt-1">Empower Christian writing & literature</p>
              </div>
            </div>

            <div className="flex items-start gap-3 bg-white/5 border border-white/10 p-4 rounded-xl">
              <ShieldCheck className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-amber-300">Secured Order</h4>
                <p className="text-xs text-gray-400 mt-1">Instant confirmation & delivery notification</p>
              </div>
            </div>
          </div>

          {/* Single book CTA if exactly 1 book */}
          {preorderList.length === 1 && (
            <div className="pt-4 flex flex-wrap items-center gap-4">
              <Link
                href={`/unveiler/books/${preorderList[0].slug}`}
                className="inline-flex items-center gap-3 px-8 py-4 bg-amber-500 hover:bg-amber-400 text-black font-black text-xs uppercase tracking-widest rounded-full transition-all duration-300 shadow-xl shadow-amber-950/40 hover:scale-105"
              >
                <span>Pre-Order "{preorderList[0].title}"</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}
        </div>

        {/* Pre-order Book Showcase Grid */}
        {preorderList.length > 0 && (
          <div className="lg:col-span-5 flex flex-col gap-4">
            <div className="text-xs font-bold uppercase tracking-widest text-amber-400 flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              <span>{preorderList.length > 1 ? "Upcoming Pre-Order Titles:" : "Upcoming Release:"}</span>
            </div>

            <div className={`grid gap-4 ${preorderList.length > 1 ? "grid-cols-2 max-h-[360px] overflow-y-auto pr-1" : "grid-cols-1 max-w-[240px] mx-auto"}`}>
              {preorderList.map((item) => (
                <Link
                  key={item._id}
                  href={`/unveiler/books/${item.slug}`}
                  className="group relative flex flex-col rounded-2xl bg-white/5 border border-amber-500/20 p-3 hover:border-amber-500/60 transition-all duration-300 hover:bg-white/10"
                >
                  <div className="relative aspect-3/4 w-full rounded-xl overflow-hidden bg-gradient-to-br from-amber-950/40 to-amber-900/20 border border-white/10 mb-3 shadow-lg">
                    {item.imageUrl ? (
                      <Image
                        src={item.imageUrl}
                        alt={item.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 200px"
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
                        <BookOpen className="w-10 h-10 text-amber-500/30 mb-2" />
                        <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider line-clamp-2">
                          {item.title}
                        </span>
                      </div>
                    )}
                    <div className="absolute top-2 left-2 bg-amber-500 text-black text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full shadow-md">
                      Pre-Order
                    </div>
                  </div>

                  <h3 className="text-xs font-bold text-white leading-tight line-clamp-2 group-hover:text-amber-300 transition-colors">
                    {item.title}
                  </h3>
                  {item.authorName && (
                    <p className="text-[10px] text-gray-400 italic mt-1">
                      By {item.authorName}
                    </p>
                  )}
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest">
                      Pre-Order
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 text-amber-400 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
