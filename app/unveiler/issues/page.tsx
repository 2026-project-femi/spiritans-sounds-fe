import { client } from "@/sanity/lib/client";
import { MAGAZINE_ISSUES_QUERY } from "@/sanity/lib/queries";
import Image from "next/image";
import Link from "next/link";
import { BookOpen, Calendar, FileText } from "lucide-react";

export const revalidate = 60;

interface MagazineIssue {
  _id: string;
  issueNumber: string;
  slug: string;
  publishDate: string;
  imageUrl?: string;
  articleCount?: number;
}

// Dummy fallback issues shown when no Sanity content exists yet
const DUMMY_ISSUES: MagazineIssue[] = [
  {
    _id: "dummy-1",
    issueNumber: "Vol. 1, Issue 1",
    slug: "vol-1-issue-1",
    publishDate: "2024-01-01",
    articleCount: 8,
  },
  {
    _id: "dummy-2",
    issueNumber: "Vol. 1, Issue 2",
    slug: "vol-1-issue-2",
    publishDate: "2024-04-01",
    articleCount: 10,
  },
  {
    _id: "dummy-3",
    issueNumber: "Vol. 1, Issue 3",
    slug: "vol-1-issue-3",
    publishDate: "2024-07-01",
    articleCount: 9,
  },
  {
    _id: "dummy-4",
    issueNumber: "Vol. 1, Issue 4",
    slug: "vol-1-issue-4",
    publishDate: "2024-10-01",
    articleCount: 11,
  },
  {
    _id: "dummy-5",
    issueNumber: "Vol. 2, Issue 1",
    slug: "vol-2-issue-1",
    publishDate: "2025-01-01",
    articleCount: 12,
  },
  {
    _id: "dummy-6",
    issueNumber: "Vol. 2, Issue 2",
    slug: "vol-2-issue-2",
    publishDate: "2025-04-01",
    articleCount: 10,
  },
];

function IssueCard({ issue, index, isDummy }: { issue: MagazineIssue; index: number; isDummy: boolean }) {
  const isLatest = index === 0;
  const formattedDate = new Date(issue.publishDate).toLocaleDateString("en-NG", {
    year: "numeric",
    month: "long",
  });

  const cardContent = (
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
            alt={issue.issueNumber}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="flex flex-col items-center gap-3 text-center px-6">
            <BookOpen className="w-12 h-12 text-brand-primary/40" />
            <p className="text-xs text-gray-600 uppercase tracking-widest">Treasures Unveiler</p>
            <p className="text-lg font-black text-white/20">{issue.issueNumber}</p>
          </div>
        )}
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent" />
        <div className="absolute bottom-4 left-4 right-4">
          <p className="text-white font-black text-lg leading-tight">{issue.issueNumber}</p>
        </div>
      </div>

      {/* Meta */}
      <div className="p-5 space-y-3">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" />
            {formattedDate}
          </span>
          {issue.articleCount !== undefined && (
            <span className="flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5" />
              {issue.articleCount} articles
            </span>
          )}
        </div>
        <div className={`text-xs font-semibold uppercase tracking-widest transition-colors ${
          isLatest ? "text-brand-primary" : "text-gray-600 group-hover:text-brand-primary"
        }`}>
          Read Issue →
        </div>
      </div>
    </div>
  );

  if (isDummy) {
    return <div className="opacity-60 cursor-not-allowed">{cardContent}</div>;
  }

  return (
    <Link href={`/unveiler/issues/${issue.slug}`}>
      {cardContent}
    </Link>
  );
}

export default async function MagazinePage() {
  let issues: MagazineIssue[] = [];
  try {
    issues = await client.fetch(MAGAZINE_ISSUES_QUERY);
  } catch {
    // Silently fall back to dummy content
  }

  const isDummy = issues.length === 0;
  const displayIssues = isDummy ? DUMMY_ISSUES : issues;

  return (
    <main className="pb-24">
      {/* Header */}
      <section className="px-6 py-20 text-center max-w-3xl mx-auto">
        <span className="inline-block text-[10px] tracking-[0.4em] uppercase text-brand-primary font-semibold border border-brand-primary/30 px-4 py-1.5 rounded-full mb-6">
          Treasures Unveiler Magazine
        </span>
        <h1 className="text-5xl font-extrabold text-white mb-6">
          Every Issue,{" "}
          <span className="text-transparent bg-clip-text bg-linear-to-r from-brand-primary to-red-600">
            A New Treasure
          </span>
        </h1>
        <p className="text-gray-400 text-lg leading-relaxed">
          The Treasures Unveiler Magazine — both print and online — shines a light on the talents 
          and challenges of the young, tells the story of Spiritans Sound Outreach, and shares news 
          from the missionary work of the Holy Ghost Fathers and Brothers.
        </p>
        {isDummy && (
          <div className="mt-6 inline-flex items-center gap-2 text-sm text-amber-400/80 bg-amber-400/10 border border-amber-400/20 px-4 py-2 rounded-full">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            Showing sample content — add issues in Sanity Studio to display real issues
          </div>
        )}
      </section>

      {/* Issues Grid */}
      <section className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
          {displayIssues.map((issue, i) => (
            <IssueCard key={issue._id} issue={issue} index={i} isDummy={isDummy} />
          ))}
        </div>
      </section>

      {/* Subscribe CTA */}
      <section className="max-w-3xl mx-auto px-6 py-20 text-center">
        <div className="p-10 rounded-2xl bg-linear-to-br from-red-950/20 to-red-900/20 border border-brand-primary/20">
          <h2 className="text-3xl font-bold text-white mb-4">Never Miss an Issue</h2>
          <p className="text-gray-400 mb-8 leading-relaxed">
            Subscribe to receive the Treasures Unveiler Magazine directly in your inbox 
            as soon as each new issue is published.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Your email address"
              className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-full text-white placeholder:text-gray-600 focus:outline-none focus:border-brand-primary/50 transition-colors text-sm"
            />
            <button className="px-6 py-3 bg-linear-to-r from-brand-primary to-red-700 text-white font-semibold rounded-full hover:opacity-90 transition-all whitespace-nowrap text-sm">
              Subscribe Free
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}