import { BookOpen, ExternalLink, ShoppingCart } from "lucide-react";

const books = [
  {
    title: "Proclaiming Christ Through Art",
    author: "Rev. Fr. Oluwafemi Victor Orilua, CSSp",
    description: "A reflection on how creativity becomes a vehicle for the Gospel — exploring music, writing, and visual art as sacred expression.",
    category: "Spirituality & Art",
    available: true,
    price: "₦2,500",
  },
  {
    title: "Treasures Unveiled: Young Voices",
    author: "Various Contributors",
    description: "A compilation of writings, poems, and reflections from recipients of the Young Creators Award — voices that shine before others.",
    category: "Youth & Creativity",
    available: true,
    price: "₦1,800",
  },
  {
    title: "The Spiritan Charism in Mission",
    author: "Spiritans Sound Editorial",
    description: "An exploration of the Holy Ghost Fathers and Brothers' missionary tradition and how it continues to shape youth ministry today.",
    category: "Mission & History",
    available: false,
    price: "Coming Soon",
  },
];

export default function BooksPage() {
  return (
    <main className="pb-24">
      {/* Header */}
      <section className="px-6 py-20 text-center max-w-3xl mx-auto">
        <span className="inline-block text-[10px] tracking-[0.4em] uppercase text-pink-400 font-semibold border border-pink-400/30 px-4 py-1.5 rounded-full mb-6">
          Book Publishing
        </span>
        <h1 className="text-5xl font-extrabold text-white mb-6">
          Words That Form,<br />
          <span className="text-transparent bg-clip-text bg-linear-to-r from-pink-400 to-purple-400">
            Inspire & Send Forth
          </span>
        </h1>
        <p className="text-gray-400 text-lg leading-relaxed">
          Treasures Unveiler publishes books rooted in faith, creativity, and mission — 
          resources for young people, ministers, and all who seek to bring out what is new and old from the treasury.
        </p>
      </section>

      {/* Books Grid */}
      <section className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {books.map((book) => (
            <div key={book.title}
              className="group flex flex-col rounded-2xl bg-white/5 border border-white/10 hover:border-pink-500/40 transition-all duration-300 overflow-hidden">
              {/* Book Cover Placeholder */}
              <div className="aspect-3/4 bg-linear-to-br from-pink-900/40 to-purple-900/40 flex items-center justify-center border-b border-white/10">
                <BookOpen className="w-16 h-16 text-pink-400/50" />
              </div>
              <div className="p-6 flex flex-col flex-1 gap-3">
                <span className="text-[10px] tracking-widest uppercase text-pink-400 font-semibold">{book.category}</span>
                <h2 className="text-xl font-bold text-white leading-tight">{book.title}</h2>
                <p className="text-sm text-gray-500 italic">{book.author}</p>
                <p className="text-sm text-gray-400 leading-relaxed flex-1">{book.description}</p>
                <div className="flex items-center justify-between pt-4 border-t border-white/10">
                  <span className={`font-bold text-lg ${book.available ? "text-pink-400" : "text-gray-500"}`}>
                    {book.price}
                  </span>
                  {book.available ? (
                    <button className="flex items-center gap-2 px-4 py-2 bg-linear-to-r from-pink-600 to-purple-600 text-white text-sm font-semibold rounded-full hover:opacity-90 transition-all">
                      <ShoppingCart className="w-4 h-4" /> Order
                    </button>
                  ) : (
                    <span className="text-xs text-gray-500 border border-gray-700 px-3 py-1.5 rounded-full">Upcoming</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Publishing Submissions CTA */}
      <section className="max-w-3xl mx-auto px-6 py-20 text-center">
        <div className="p-10 rounded-2xl bg-linear-to-br from-pink-900/20 to-purple-900/20 border border-pink-500/20">
          <ExternalLink className="w-10 h-10 text-pink-400 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-white mb-4">Want to Publish With Us?</h2>
          <p className="text-gray-400 mb-8 leading-relaxed">
            Are you a young creative with a manuscript, a collection of poems, or a faith-filled story to tell? 
            We'd love to hear from you. Treasures Unveiler is committed to giving young voices a platform.
          </p>
          <a href="/contact"
            className="inline-block px-8 py-3 bg-linear-to-r from-pink-600 to-purple-600 text-white font-semibold rounded-full hover:opacity-90 transition-all duration-300 hover:scale-105">
            Submit Your Manuscript
          </a>
        </div>
      </section>
    </main>
  );
}
