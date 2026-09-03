import { getPayload } from "payload";
import configPromise from "@/payload.config";
import { cookies, headers } from "next/headers";
import { BookOpen, DollarSign, TrendingUp, ShoppingBag } from "lucide-react";
import Link from "next/link";

export default async function DashboardOverviewPage() {
  const payload = await getPayload({ config: configPromise });
  const req = {
    headers: await headers(),
    cookies: await cookies(),
  };

  const { user } = await payload.auth(req as any);
  if (!user) return null;

  // Fetch Author's Books
  const booksRes = await payload.find({
    collection: "publications",
    where: { author: { equals: user.id } },
    limit: 100,
  });
  const books = booksRes.docs;

  // Calculate Metrics
  const totalBooks = books.length;
  let totalSales = 0;
  let grossRevenue = 0;

  books.forEach((b: any) => {
    totalSales += b.totalSales || 0;
    grossRevenue += b.grossRevenue || 0;
  });

  // Calculate Author's Total Earnings from Orders
  // We need to fetch all completed orders containing their books
  // Wait, payload doesn't easily allow querying orders by "items contains one of my books".
  // But we can query orders where `authorEarnings` is present, but actually `Orders` has no `author` field.
  // Instead, the author can just rely on a `totalEarnings` field that we could have added to `User`, or we can calculate it by iterating their books and querying orders for each book...
  // Wait! In the webhook, I didn't update the User's `totalEarnings`. I only updated `Order` and `Publication`.
  // To get exact earnings for THIS author, we can sum `authorEarnings` from all orders where `items` includes their books.
  const bookIds = books.map((b) => b.id);
  
  let authorTotalEarnings = 0;
  if (bookIds.length > 0) {
    const ordersRes = await payload.find({
      collection: "orders",
      where: {
        status: { equals: "completed" },
        "items.value": { in: bookIds },
      },
      limit: 1000,
    });
    
    ordersRes.docs.forEach((order: any) => {
      authorTotalEarnings += order.authorEarnings || 0;
    });
  }

  // Fetch Payouts to calculate what has already been paid/pending
  const payoutsRes = await payload.find({
    collection: "payouts",
    where: { author: { equals: user.id } },
    limit: 100,
  });
  let totalPaidOut = 0;
  payoutsRes.docs.forEach((p: any) => {
    if (['completed', 'processing', 'pending', 'paid'].includes(p.status)) {
      totalPaidOut += p.amount || 0;
    }
  });

  const availableBalance = authorTotalEarnings - totalPaidOut;

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-black text-white">Dashboard Overview</h1>
        <p className="text-gray-400 mt-2">Welcome back, {user.name}. Here's what's happening with your publications.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        <div className="bg-[#121214] border border-white/5 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-brand-primary/10 rounded-xl">
              <DollarSign className="w-6 h-6 text-brand-primary" />
            </div>
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Total Earnings</h3>
          </div>
          <p className="text-3xl font-black text-white">₦{authorTotalEarnings.toLocaleString()}</p>
        </div>

        <div className="bg-[#121214] border border-white/5 rounded-2xl p-6 shadow-xl relative overflow-hidden">
          <div className="absolute inset-0 bg-linear-to-br from-brand-primary/20 to-transparent pointer-events-none" />
          <div className="relative">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-red-500/10 rounded-xl">
                <DollarSign className="w-6 h-6 text-red-500" />
              </div>
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Available Balance</h3>
            </div>
            <p className="text-3xl font-black text-white">₦{availableBalance.toLocaleString()}</p>
          </div>
        </div>

        <div className="bg-[#121214] border border-white/5 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-green-500/10 rounded-xl">
              <ShoppingBag className="w-6 h-6 text-green-500" />
            </div>
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Total Sales</h3>
          </div>
          <p className="text-3xl font-black text-white">{totalSales}</p>
        </div>

        <div className="bg-[#121214] border border-white/5 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-purple-500/10 rounded-xl">
              <TrendingUp className="w-6 h-6 text-purple-500" />
            </div>
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Gross Revenue</h3>
          </div>
          <p className="text-3xl font-black text-white">₦{grossRevenue.toLocaleString()}</p>
        </div>

        <div className="bg-[#121214] border border-white/5 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-blue-500/10 rounded-xl">
              <BookOpen className="w-6 h-6 text-blue-500" />
            </div>
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Publications</h3>
          </div>
          <p className="text-3xl font-black text-white">{totalBooks}</p>
        </div>
      </div>

      <div className="bg-[#121214] border border-white/5 rounded-2xl p-8 shadow-xl">
        <h2 className="text-xl font-bold text-white mb-6">Recent Publications</h2>
        {books.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="pb-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Title</th>
                  <th className="pb-4 text-xs font-bold text-gray-500 uppercase tracking-widest">Status</th>
                  <th className="pb-4 text-xs font-bold text-gray-500 uppercase tracking-widest text-right">Sales</th>
                  <th className="pb-4 text-xs font-bold text-gray-500 uppercase tracking-widest text-right">Gross Rev</th>
                </tr>
              </thead>
              <tbody>
                {books.slice(0, 5).map((book: any) => (
                  <tr key={book.id} className="border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors">
                    <td className="py-4 font-bold text-white">
                      <Link href={`/unveiler/books/${book.slug}`} className="hover:text-brand-primary">
                        {book.title}
                      </Link>
                    </td>
                    <td className="py-4">
                      <span className={`text-[10px] uppercase tracking-widest font-bold px-2 py-1 rounded-full ${
                        book.publishingStatus === 'published' ? 'bg-green-500/20 text-green-400' : 
                        book.publishingStatus === 'under_review' ? 'bg-amber-500/20 text-amber-400' : 
                        'bg-gray-500/20 text-gray-400'
                      }`}>
                        {book.publishingStatus?.replace('_', ' ') || 'Draft'}
                      </span>
                    </td>
                    <td className="py-4 text-right text-gray-400 font-medium">{book.totalSales || 0}</td>
                    <td className="py-4 text-right text-gray-400 font-medium">₦{(book.grossRevenue || 0).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <BookOpen className="w-12 h-12 text-gray-700 mx-auto mb-4" />
            <p className="text-gray-500">You haven't published any books yet.</p>
            <Link href="/unveiler/publish" className="inline-block mt-4 text-brand-primary font-bold hover:underline">
              Submit your first manuscript
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
