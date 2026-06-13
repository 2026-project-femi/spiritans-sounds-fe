import { getPayload } from "payload";
import configPromise from "@/payload.config";
import Image from "next/image";
import Link from "next/link";
import { Calendar, ArrowLeft, BookOpen, Download, ShieldCheck, FileText } from "lucide-react";
import { PurchaseButton } from "./PurchaseButton";
import type { Metadata } from "next";



export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const payload = await getPayload({ config: configPromise });
  const result = await payload.find({
    collection: "magazineIssues",
    where: {
      and: [
        { slug: { equals: slug } },
        { _status: { equals: 'published' } }
      ]
    },
  });
  const doc: any = result.docs[0];
  if (!doc) return {};
  const title = doc.title;
  const description = doc.excerpt || doc.description || "";
  const imageUrl = doc.imageUrl;
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      images: imageUrl ? [{ url: imageUrl, width: 1200, height: 630, alt: title }] : [],
    },
    twitter: { card: "summary_large_image", title, description, images: imageUrl ? [imageUrl] : [] },
  };
}

interface MagazineIssue {
  _id: string;
  title: string;
  slug: string;
  publishedAt: string;
  imageUrl?: string;
  fileUrl?: string;
  price?: string;
  priceAmount?: number;
  description?: string;
  excerpt?: string;
}

export default async function SingleIssuePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  let issue: MagazineIssue | null = null;
  try {
    const payload = await getPayload({ config: configPromise });
    const result = await payload.find({
      collection: "magazineIssues",
      where: {
        and: [
          { slug: { equals: slug } },
          { _status: { equals: 'published' } }
        ]
      },
    });
    const d: any = result.docs[0];
    if (d) {
        issue = {
            ...d,
            _id: d.id,
            imageUrl: d.coverImage && typeof d.coverImage === 'object' ? d.coverImage.url : undefined,
            fileUrl: d.pdfFile && typeof d.pdfFile === 'object' ? d.pdfFile.url : undefined,
        } as MagazineIssue;
    }
  } catch {
    // fall through
  }

  if (!issue) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-6">
        <BookOpen className="w-16 h-16 text-gray-800 mb-6" />
        <h1 className="text-3xl font-black text-white mb-4">Issue Not Found</h1>
        <p className="text-gray-500 mb-8">The magazine issue you are looking for might have been moved or archived.</p>
        <Link href="/unveiler/issues" className="px-8 py-3 bg-brand-primary text-white font-bold rounded-full hover:bg-red-700 transition-colors">
            Back to Magazine
        </Link>
      </div>
    );
  }

  const formattedDate = new Date(issue.publishedAt).toLocaleDateString("en-NG", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });

  const isPaid = issue.price === 'Paid';

  return (
    <main className="pb-24">
      {/* Back link */}
      <div className="max-w-6xl mx-auto px-6 pt-10">
        <Link href="/unveiler/issues"
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-brand-primary transition-colors group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Back to Catalog
        </Link>
      </div>

      {/* Issue Detail */}
      <section className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-16 items-start">
          {/* Left: Cover & Actions */}
          <div className="space-y-8">
            <div className="aspect-[3/4] relative rounded-2xl overflow-hidden bg-linear-to-br from-red-950/30 to-red-900/40 border border-white/10 shadow-2xl shadow-red-950/40">
              {issue.imageUrl ? (
                <Image src={issue.imageUrl} alt={issue.title} fill className="object-cover" />
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 text-center px-8 text-white/10">
                  <BookOpen size={80} />
                  <p className="text-sm font-black uppercase tracking-widest">{issue.title}</p>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-white/3 border border-white/5 text-center">
                    <span className="block text-[10px] text-gray-500 uppercase tracking-widest font-black mb-1">Access</span>
                    <span className={`text-sm font-bold ${isPaid ? 'text-amber-500' : 'text-green-500'}`}>{issue.price || 'Free'}</span>
                </div>
                <div className="p-4 rounded-xl bg-white/3 border border-white/5 text-center">
                    <span className="block text-[10px] text-gray-500 uppercase tracking-widest font-black mb-1">Format</span>
                    <span className="text-sm font-bold text-white">Digital PDF</span>
                </div>
            </div>

            {issue.fileUrl ? (
                isPaid ? (
                    <PurchaseButton
                      itemId={issue._id}
                      itemTitle={issue.title}
                      priceAmount={issue.priceAmount ?? 0}
                    />
                ) : (
                    <a href={`${issue.fileUrl}?dl=${issue.title}.pdf`} className="flex items-center justify-center gap-3 w-full py-4 bg-linear-to-r from-brand-primary to-red-700 text-white font-black rounded-xl hover:opacity-90 transition-all uppercase tracking-widest text-sm shadow-xl shadow-red-900/20">
                        <Download size={18} /> Download Now
                    </a>
                )
            ) : (
                <div className="text-center py-4 text-gray-500 font-bold uppercase tracking-widest text-xs border border-dashed border-white/10 rounded-xl">
                    Coming Soon
                </div>
            )}
          </div>

          {/* Right: Content */}
          <div className="space-y-10">
            <div className="space-y-4">
                <div className="flex items-center gap-2 text-brand-primary font-bold text-xs uppercase tracking-[0.2em]">
                    <span className="w-8 h-[1px] bg-brand-primary"></span>
                    Magazine Publication
                </div>
                <h1 className="text-4xl md:text-6xl font-black text-white leading-tight tracking-tighter">
                    {issue.title}
                </h1>
                <div className="flex flex-wrap gap-6 items-center pt-2">
                    <div className="flex items-center gap-2 text-gray-400 text-sm font-medium">
                        <Calendar className="w-4 h-4 text-brand-primary" />
                        {formattedDate}
                    </div>
                    <div className="flex items-center gap-2 text-gray-400 text-sm font-medium">
                        <ShieldCheck className="w-4 h-4 text-brand-primary" />
                        Verified Spiritans Sound Content
                    </div>
                </div>
            </div>

            <div className="h-[1px] bg-linear-to-r from-white/10 to-transparent"></div>

            <div className="space-y-6">
                <h3 className="text-xs uppercase tracking-widest font-black text-gray-500 flex items-center gap-2">
                    <FileText size={14} className="text-brand-primary" />
                    About This Issue
                </h3>
                {issue.description ? (
                    <div className="prose prose-invert prose-red max-w-none text-gray-400 text-lg leading-relaxed font-light">
                        {issue.description}
                    </div>
                ) : (
                    <p className="text-gray-400 text-lg font-light italic leading-relaxed">
                        {issue.excerpt || "No description available for this issue."}
                    </p>
                )}
            </div>

            <div className="bg-linear-to-br from-red-950/20 to-transparent p-8 rounded-3xl border border-white/5 space-y-4">
                <h4 className="text-white font-bold">Safe & Secure Publishing</h4>
                <p className="text-sm text-gray-400 leading-relaxed">
                    Treasures Unveiler is committed to providing holy and inspiring content. 
                    Every digital distribution is scanned and verified to be safe and true to our missionary values.
                </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}