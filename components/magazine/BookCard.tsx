"use client";

import Image from "next/image";
import { BookOpen, ShoppingCart, Download, Calendar } from "lucide-react";

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

export function BookCard({ book }: { book: Book }) {
  const isPaid = book.price && book.price !== 'Free' && !book.price.includes('0');
  
  return (
    <div className="group flex flex-col rounded-2xl bg-white/3 border border-white/10 hover:border-brand-primary/40 transition-all duration-300 overflow-hidden hover:shadow-2xl hover:shadow-red-950/20">
      {/* Book Cover */}
      <div className="aspect-[3/4] relative bg-linear-to-br from-red-950/30 to-red-900/40 flex items-center justify-center overflow-hidden border-b border-white/5">
        {book.imageUrl ? (
          <Image
            src={book.imageUrl}
            alt={book.title}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-700"
          />
        ) : (
          <div className="flex flex-col items-center gap-3 text-center px-6">
            < BookOpen className="w-16 h-16 text-brand-primary/30" />
            <span className="text-[10px] tracking-widest uppercase text-gray-600">Treasures Unveiler</span>
          </div>
        )}
        
        {/* Overlay for specific action */}
        {book.fileUrl && !isPaid && (
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <a 
                  href={`${book.fileUrl}?dl=${book.title}.pdf`}
                  className="p-4 bg-brand-primary text-white rounded-full hover:scale-110 transition-transform shadow-xl"
                  title="Download eBook"
                >
                    <Download size={24} />
                </a>
            </div>
        )}
      </div>

      <div className="p-6 flex flex-col flex-1 gap-4">
        <div className="space-y-2">
            <div className="flex justify-between items-start">
               <h2 className="text-xl font-bold text-white leading-tight group-hover:text-brand-primary transition-colors line-clamp-2">
                {book.title}
              </h2>
            </div>
            {book.publishedAt && (
                <div className="flex items-center gap-1.5 text-[10px] text-gray-500 uppercase tracking-widest font-bold">
                    <Calendar size={12} />
                    {new Date(book.publishedAt).getFullYear()}
                </div>
            )}
        </div>
        
        <p className="text-sm text-gray-400 leading-relaxed line-clamp-3 font-light flex-1">
          {book.description}
        </p>

        <div className="flex items-center justify-between pt-5 border-t border-white/5">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-1">Investment</span>
            <span className={`font-bold text-lg ${isPaid ? "text-white" : "text-green-500"}`}>
                {book.price || 'Free'}
            </span>
          </div>

          {isPaid ? (
            <a 
              href="/contact" 
              className="flex items-center gap-2 px-5 py-2.5 bg-white text-black text-xs font-black rounded-full hover:bg-brand-primary hover:text-white transition-all uppercase tracking-widest"
            >
              <ShoppingCart size={14} /> Order
            </a>
          ) : book.fileUrl ? (
            <a 
               href={`${book.fileUrl}?dl=${book.title}.pdf`}
               className="flex items-center gap-2 px-5 py-2.5 bg-linear-to-r from-brand-primary to-red-700 text-white text-xs font-black rounded-full hover:opacity-90 transition-all uppercase tracking-widest shadow-lg shadow-red-900/20"
            >
               <Download size={14} /> Download
            </a>
          ) : (
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-600 border border-white/10 px-4 py-2 rounded-full">
                Coming Soon
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
