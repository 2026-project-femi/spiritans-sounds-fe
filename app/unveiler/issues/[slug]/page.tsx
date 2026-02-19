import { client } from "@/sanity/lib/client";
import { MAGAZINE_ISSUE_QUERY } from "@/sanity/lib/queries";
import Image from "next/image";
import Link from "next/link";
import { Calendar, ArrowLeft, User, BookOpen } from "lucide-react";

export const revalidate = 60;

interface Article {
  _id: string;
  title: string;
  slug: string;
  author?: string;
  excerpt?: string;
  publishedAt?: string;
  imageUrl?: string;
}

interface MagazineIssue {
  _id: string;
  issueNumber: string;
  slug: string;
  publishDate: string;
  imageUrl?: string;
  articles?: Article[];
}

// Dummy articles for fallback
const DUMMY_ARTICLES: Article[] = [
  {
    _id: "d1",
    title: "Finding God in the Creative Process",
    slug: "finding-god-in-creative-process",
    author: "Sr. Mary Okafor",
    excerpt: "How young artists are discovering that creativity is not just self-expression, but a participation in the ongoing work of the Creator.",
  },
  {
    _id: "d2",
    title: "The Young Creators Award: Stories of Grace",
    slug: "young-creators-award-stories",
    author: "Fr. Victor Orilua, CSSp",
    excerpt: "Reflections on the journeys of this year's award recipients and how their gifts are becoming a blessing to the Church.",
  },
  {
    _id: "d3",
    title: "Music as Mission: Spiritans Sound Outreach",
    slug: "music-as-mission",
    author: "Chukwuemeka Eze",
    excerpt: "A behind-the-scenes look at how the Spiritans Sound music ministry is reaching young people across Nigeria.",
  },
  {
    _id: "d4",
    title: "Writing the Word: Youth Voices in Faith",
    slug: "writing-the-word",
    author: "Adaeze Nwosu",
    excerpt: "Young writers share how putting faith into words has deepened their own relationship with God.",
  },
  {
    _id: "d5",
    title: "From the Editor's Desk",
    slug: "editors-desk",
    author: "Editorial Team",
    excerpt: "A reflection on the theme of this issue and the mission that drives every page of Treasures Unveiler Magazine.",
  },
  {
    _id: "d6",
    title: "Missionary News: Holy Ghost Fathers in Nigeria",
    slug: "missionary-news",
    author: "Spiritans Communications",
    excerpt: "Updates from the missionary work of the Congregation of the Holy Spirit across the South-West Province of Nigeria.",
  },
];

export default async function SingleIssuePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  let issue: MagazineIssue | null = null;
  try {
    issue = await client.fetch(MAGAZINE_ISSUE_QUERY, { slug });
  } catch {
    // fall through to dummy
  }

  const isDummy = !issue;
  const displayIssue: MagazineIssue = issue ?? {
    _id: "dummy",
    issueNumber: "Vol. 1, Issue 1",
    slug,
    publishDate: "2024-01-01",
    articles: DUMMY_ARTICLES,
  };

  const formattedDate = new Date(displayIssue.publishDate).toLocaleDateString("en-NG", {
    year: "numeric",
    month: "long",
  });

  return (
    <main className="pb-24">
      {/* Back link */}
      <div className="max-w-6xl mx-auto px-6 pt-10">
        <Link href="/unveiler/issues"
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-pink-400 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Magazine
        </Link>
      </div>

      {/* Issue Header */}
      <section className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex flex-col md:flex-row gap-10 items-start">
          {/* Cover */}
          <div className="w-full md:w-56 shrink-0">
            <div className="aspect-3/4 relative rounded-xl overflow-hidden bg-linear-to-br from-pink-900/30 to-purple-900/40 border border-white/10 shadow-2xl shadow-pink-900/20">
              {displayIssue.imageUrl ? (
                <Image src={displayIssue.imageUrl} alt={displayIssue.issueNumber} fill className="object-cover" />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-center px-4">
                  <BookOpen className="w-10 h-10 text-pink-400/40" />
                  <p className="text-xs text-gray-600 uppercase tracking-widest">Treasures Unveiler</p>
                  <p className="text-base font-black text-white/20">{displayIssue.issueNumber}</p>
                </div>
              )}
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 space-y-4">
            {isDummy && (
              <div className="inline-flex items-center gap-2 text-xs text-amber-400/80 bg-amber-400/10 border border-amber-400/20 px-3 py-1.5 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                Sample content — add this issue in Sanity Studio
              </div>
            )}
            <span className="text-[10px] tracking-[0.3em] uppercase text-pink-400 font-semibold">
              Treasures Unveiler Magazine
            </span>
            <h1 className="text-4xl md:text-5xl font-extrabold text-white">{displayIssue.issueNumber}</h1>
            <div className="flex items-center gap-2 text-gray-500 text-sm">
              <Calendar className="w-4 h-4" />
              {formattedDate}
            </div>
            <p className="text-gray-400 leading-relaxed max-w-xl">
              This issue of Treasures Unveiler Magazine features stories of faith, creativity, and mission — 
              shining a light on the gifts of young people and the work of Spiritans Sound Outreach.
            </p>
            <div className="flex gap-3 pt-2">
              <button className="px-6 py-2.5 bg-linear-to-r from-pink-600 to-purple-600 text-white text-sm font-semibold rounded-full hover:opacity-90 transition-all">
                Read Online
              </button>
              <button className="px-6 py-2.5 border border-white/20 text-white text-sm font-semibold rounded-full hover:bg-white/5 transition-all">
                Download PDF
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Articles in this Issue */}
      <section className="max-w-6xl mx-auto px-6">
        <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
          <span className="w-1 h-6 rounded-full bg-linear-to-b from-pink-500 to-purple-500 inline-block" />
          In This Issue
          <span className="text-sm text-gray-600 font-normal ml-1">
            ({displayIssue.articles?.length ?? 0} articles)
          </span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(displayIssue.articles ?? []).map((article, i) => (
            <div key={article._id}
              className={`group flex flex-col rounded-xl border transition-all duration-300 overflow-hidden ${
                isDummy
                  ? "border-white/8 bg-white/3 opacity-70 cursor-not-allowed"
                  : "border-white/10 bg-white/3 hover:border-pink-500/30 hover:bg-white/5"
              }`}>
              {/* Article image or placeholder */}
              <div className="aspect-video relative bg-linear-to-br from-pink-900/20 to-purple-900/20 flex items-center justify-center overflow-hidden">
                {article.imageUrl ? (
                  <Image src={article.imageUrl} alt={article.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <span className="text-4xl font-black text-white/5">{String(i + 1).padStart(2, "0")}</span>
                )}
              </div>
              <div className="p-5 flex flex-col flex-1 gap-2">
                <h3 className="font-bold text-white leading-tight group-hover:text-pink-300 transition-colors">
                  {article.title}
                </h3>
                {article.author && (
                  <p className="text-xs text-gray-500 flex items-center gap-1.5">
                    <User className="w-3 h-3" /> {article.author}
                  </p>
                )}
                {article.excerpt && (
                  <p className="text-sm text-gray-400 leading-relaxed line-clamp-3 flex-1">{article.excerpt}</p>
                )}
                {!isDummy && (
                  <Link href={`/articles/${article.slug}`}
                    className="text-xs text-pink-400 font-semibold mt-2 hover:text-pink-300 transition-colors">
                    Read Article →
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}