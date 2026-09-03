"use client";

import { useState } from "react";
import { Search, X, BookOpen } from "lucide-react";
import { BookCard } from "@/components/magazine/BookCard";

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

export function BookSearchList({ books }: { books: Book[] }) {
  const [query, setQuery] = useState("");

  const filteredBooks = books.filter((book) => {
    const q = query.toLowerCase().trim();
    if (!q) return true;

    const titleMatch = book.title.toLowerCase().includes(q);
    const descMatch = book.description.toLowerCase().includes(q);
    const authorMatch = book.authorName ? book.authorName.toLowerCase().includes(q) : false;

    return titleMatch || descMatch || authorMatch;
  });

  return (
    <div className="space-y-10">
      {/* Search Input Bar */}
      <div className="max-w-2xl mx-auto relative">
        <div className="relative flex items-center">
          <Search className="absolute left-5 w-5 h-5 text-gray-400 pointer-events-none" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search books by title, author, or keywords..."
            className="w-full bg-[#121214] border border-white/10 rounded-full pl-14 pr-12 py-4 text-white placeholder:text-gray-500 text-sm focus:outline-none focus:border-brand-primary/60 focus:ring-2 focus:ring-brand-primary/20 transition-all shadow-xl"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="absolute right-4 p-2 text-gray-400 hover:text-white transition-colors"
              title="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
        {query && (
          <p className="text-xs text-gray-400 mt-3 text-center">
            Found <span className="font-bold text-white">{filteredBooks.length}</span> {filteredBooks.length === 1 ? "book" : "books"} matching &quot;{query}&quot;
          </p>
        )}
      </div>

      {/* Books Grid */}
      {filteredBooks.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {filteredBooks.map((book) => (
            <BookCard key={book._id} book={book} />
          ))}
        </div>
      ) : (
        <div className="py-20 text-center space-y-4 bg-[#121214]/50 border border-white/5 rounded-3xl p-12 max-w-xl mx-auto">
          <BookOpen className="w-12 h-12 text-gray-600 mx-auto" />
          <h3 className="text-xl font-bold text-white">No books found</h3>
          <p className="text-gray-400 text-sm max-w-md mx-auto">
            We couldn&apos;t find any books matching &quot;{query}&quot;. Try checking for spelling errors or using different keywords.
          </p>
          <button
            onClick={() => setQuery("")}
            className="inline-flex px-6 py-2.5 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-full transition-colors uppercase tracking-widest"
          >
            Clear Search
          </button>
        </div>
      )}
    </div>
  );
}
