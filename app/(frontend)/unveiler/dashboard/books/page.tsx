import { getPayload } from "payload";
import configPromise from "@/payload.config";
import { cookies, headers } from "next/headers";
import { BookOpen, ExternalLink, Calendar, PlusCircle } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default async function DashboardBooksPage() {
  const payload = await getPayload({ config: configPromise });
  const req = {
    headers: await headers(),
    cookies: await cookies(),
  };

  const { user } = await payload.auth(req as any);
  if (!user) return null;

  const booksRes = await payload.find({
    collection: "publications",
    where: { author: { equals: user.id } },
    sort: "-createdAt",
    limit: 100,
  });
  
  const books = booksRes.docs;

  return (
    <div className="p-8 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white">My Books</h1>
          <p className="text-gray-400 mt-2">Manage your publications and see their current status.</p>
        </div>
        <Link 
          href="/unveiler/publish" 
          className="inline-flex items-center gap-2 bg-brand-primary text-white font-bold py-3 px-6 rounded-xl hover:bg-red-700 transition-colors"
        >
          <PlusCircle size={18} />
          Publish New Book
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {books.map((book: any) => (
          <div key={book.id} className="bg-[#121214] border border-white/5 rounded-2xl overflow-hidden shadow-xl flex flex-col group">
            <div className="aspect-video relative bg-linear-to-br from-red-950/30 to-red-900/40 border-b border-white/5">
              {book.cover?.url ? (
                <Image 
                  src={book.cover.url} 
                  alt={book.title} 
                  fill 
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <BookOpen className="w-12 h-12 text-gray-700" />
                </div>
              )}
              
              <div className="absolute top-3 right-3">
                <span className={`text-[10px] uppercase tracking-widest font-black px-3 py-1 rounded-full shadow-lg backdrop-blur-md ${
                  book.publishingStatus === 'published' ? 'bg-green-500/80 text-white' : 
                  book.publishingStatus === 'under_review' ? 'bg-amber-500/80 text-white' : 
                  'bg-gray-800/80 text-white border border-white/10'
                }`}>
                  {book.publishingStatus?.replace('_', ' ') || 'Draft'}
                </span>
              </div>
            </div>
            
            <div className="p-6 flex flex-col flex-1 gap-4">
              <h3 className="text-xl font-bold text-white line-clamp-2">{book.title}</h3>
              
              <div className="flex-1">
                <p className="text-sm text-gray-400 line-clamp-3">{book.description}</p>
              </div>
              
              <div className="flex items-center justify-between text-xs font-bold text-gray-500 uppercase tracking-widest pt-4 border-t border-white/5">
                <div className="flex items-center gap-1.5">
                  <Calendar size={14} />
                  {new Date(book.createdAt).toLocaleDateString()}
                </div>
                <div>
                  <span className={book.price === 'paid' ? 'text-amber-400' : 'text-green-400'}>
                    {book.price === 'paid' ? `₦${book.priceAmount?.toLocaleString() || 0}` : 'Free'}
                  </span>
                </div>
              </div>
              
              {book.publishingStatus === 'published' && (
                <Link 
                  href={`/unveiler/books/${book.slug}`}
                  target="_blank"
                  className="mt-2 flex items-center justify-center gap-2 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-lg transition-colors text-sm font-bold uppercase tracking-widest"
                >
                  <ExternalLink size={14} /> View in Store
                </Link>
              )}
            </div>
          </div>
        ))}

        {books.length === 0 && (
          <div className="col-span-full text-center py-20 bg-[#121214] border border-white/5 rounded-2xl">
            <BookOpen className="w-16 h-16 text-gray-700 mx-auto mb-4" />
            <p className="text-gray-400 text-lg">No books found in your library.</p>
          </div>
        )}
      </div>
    </div>
  );
}
