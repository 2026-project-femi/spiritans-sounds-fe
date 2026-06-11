import { getPayload } from "payload";
import configPromise from "@/payload.config";
import { IssueCard } from "@/components/magazine/IssueCard";
import type { Metadata } from "next";



export const metadata: Metadata = {
  title: "Treasures Unveiler Magazine",
  description: "Every issue, a new treasure. Browse all issues of the Treasures Unveiler Magazine.",
  openGraph: {
    title: "Treasures Unveiler Magazine | Spiritans Sound",
    description: "Every issue, a new treasure. Browse all issues of the Treasures Unveiler Magazine.",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
  },
  twitter: { card: "summary_large_image" },
};

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

// Dummy fallback issues shown when no Sanity content exists yet
const DUMMY_ISSUES: MagazineIssue[] = [
  {
    _id: "dummy-1",
    title: "Treasures Unveiler Vol. 1, Issue 1",
    slug: "vol-1-issue-1",
    publishedAt: "2024-01-01",
    description: "The maiden issue of our youth ministry magazine.",
  },
  {
    _id: "dummy-2",
    title: "Treasures Unveiler Vol. 1, Issue 2",
    slug: "vol-1-issue-2",
    publishedAt: "2024-04-01",
    description: "Exploring faith through the eyes of the young.",
  },
];

export default async function MagazinePage() {
  let issues: MagazineIssue[] = [];
  try {
    const payload = await getPayload({ config: configPromise });
    const result = await payload.find({ collection: 'magazineIssues', sort: '-publishedAt', limit: 100 });
    issues = result.docs.map((d: any) => ({
      ...d,
      _id: d.id,
      imageUrl: d.cover && typeof d.cover === 'object' ? d.cover.url : undefined,
      fileUrl: d.file && typeof d.file === 'object' ? d.file.url : undefined
    })) as MagazineIssue[];
  } catch {
    //
  }

  const isDummy = false;
  const displayIssues = issues;

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
      </section>

      {/* Issues Grid */}
      <section className="max-w-7xl mx-auto px-6">
        {displayIssues.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {displayIssues.map((issue, i) => (
              <IssueCard key={issue._id} issue={issue} index={i} isDummy={false} />
            ))}
          </div>
        ) : (
          <div className="py-24 text-center">
            <p className="text-gray-500 text-lg">No issues published yet — check back soon.</p>
          </div>
        )}
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