"use client";

import Image from "next/image";
import { BookOpen, Calendar, Download, Eye } from "lucide-react";

interface MagazineIssue {
  _id: string;
  title: string;
  slug: string;
  publishedAt: string;
  imageUrl?: string;
  fileUrl?: string;
  price?: string;
  description?: string;
}

export function IssueCard({ issue, index, isDummy }: { issue: MagazineIssue; index: number; isDummy: boolean }) {
  const isLatest = index === 0;
  const formattedDate = new Date(issue.publishedAt).toLocaleDateString("en-NG", {
    year: "numeric",
    month: "long",
  });

  return (
    <div className={`group relative flex flex-col rounded-2xl overflow-hidden border transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl hover:shadow-red-950/20 ${
      isLatest
        ? "border-brand-primary/50 bg-linear-to-br from-red-950/20 to-red-900/20"
        : "border-white/10 bg-white/3 hover:border-brand-primary/30"
    }`}>
      {isLatest && (
        <span className="absolute top-4 left-4 z-10 text-[10px] tracking-widest uppercase font-bold text-white bg-linear-to-r from-brand-primary to-red-700 px-3 py-1.5 rounded-full">
          Latest Issue
        </span>
      )}
      {isDummy && (
        <span className="absolute top-4 right-4 z-10 text-[10px] tracking-widest uppercase font-semibold text-gray-500 border border-gray-700 px-2 py-1 rounded-full">
          Sample
        </span>
      )}

      {/* Cover */}
      <div className="aspect-[3/4] relative bg-linear-to-br from-red-950/30 to-red-900/40 flex items-center justify-center overflow-hidden">
        {issue.imageUrl ? (
          <Image
            src={issue.imageUrl}
            alt={issue.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="flex flex-col items-center gap-3 text-center px-6">
            <BookOpen className="w-12 h-12 text-brand-primary/40" />
            <p className="text-xs text-gray-600 uppercase tracking-widest">Treasures Unveiler</p>
            <p className="text-sm font-black text-white/20">{issue.title}</p>
          </div>
        )}
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center p-6 pb-20">
             <div className="flex gap-4">
                {issue.fileUrl && (
                    <a 
                      href={`${issue.fileUrl}?dl=${issue.title}.pdf`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 bg-brand-primary text-white rounded-full hover:bg-red-700 transition-colors shadow-lg"
                      title="Download PDF"
                      onClick={(e) => e.stopPropagation()}
                    >
                        <Download size={18} />
                    </a>
                )}
                <div className="p-3 bg-white text-black rounded-full hover:bg-gray-200 transition-colors shadow-lg" title="Preview Cover">
                    <Eye size={18} />
                </div>
             </div>
        </div>
        <div className="absolute bottom-4 left-4 right-4">
          <p className="text-white font-black text-sm leading-tight line-clamp-2">{issue.title}</p>
        </div>
      </div>

      {/* Meta */}
      <div className="p-5 space-y-4">
        <div className="flex items-center justify-between text-[10px] text-gray-500 font-bold uppercase tracking-widest">
          <span className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" />
            {formattedDate}
          </span>
          <span className={`px-2 py-0.5 rounded-full border ${issue.price === 'Paid' ? 'border-amber-500/50 text-amber-500' : 'border-green-500/50 text-green-500'}`}>
            {issue.price || 'Free'}
          </span>
        </div>
        {issue.fileUrl ? (
            <a 
              href={`${issue.fileUrl}?dl=${issue.title}.pdf`}
              className={`block w-full text-center py-2.5 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${
                isLatest 
                  ? "bg-brand-primary text-white hover:bg-red-700" 
                  : "bg-white/10 text-white hover:bg-brand-primary"
              }`}
            >
              Download Issue
            </a>
        ) : (
             <div className="text-xs font-semibold uppercase tracking-widest text-gray-600 text-center py-2.5">
                Coming Soon
             </div>
        )}
      </div>
    </div>
  );
}
