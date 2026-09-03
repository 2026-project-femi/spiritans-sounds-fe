import { getPayload } from "payload";
import configPromise from "@/payload.config";
import { cookies, headers } from "next/headers";
import { Wallet, History, CreditCard, Building } from "lucide-react";
import { PayoutButton } from "@/components/dashboard/PayoutButton";

export default async function DashboardEarningsPage() {
  const payload = await getPayload({ config: configPromise });
  const req = {
    headers: await headers(),
    cookies: await cookies(),
  };

  const { user } = await payload.auth(req as any);
  if (!user) return null;

  // Fetch Author's Books to find their book IDs
  const booksRes = await payload.find({
    collection: "publications",
    where: { author: { equals: user.id } },
    limit: 100,
  });
  const bookIds = booksRes.docs.map((b) => b.id);
  
  let authorTotalEarnings = 0;
  let orderHistory: any[] = [];
  
  if (bookIds.length > 0) {
    const ordersRes = await payload.find({
      collection: "orders",
      where: {
        status: { equals: "completed" },
        "items.value": { in: bookIds },
      },
      sort: "-createdAt",
      limit: 100,
    });
    
    orderHistory = ordersRes.docs;
    orderHistory.forEach((order: any) => {
      authorTotalEarnings += order.authorEarnings || 0;
    });
  }

  // Fetch Payouts
  const payoutsRes = await payload.find({
    collection: "payouts",
    where: { author: { equals: user.id } },
    sort: "-createdAt",
    limit: 50,
  });
  
  const payouts = payoutsRes.docs;
  let totalPaidOut = 0;
  let hasPending = false;
  payouts.forEach((p: any) => {
    if (['completed', 'processing', 'pending', 'paid'].includes(p.status)) {
      totalPaidOut += p.amount || 0;
    }
    if (p.status === 'pending') {
        hasPending = true;
    }
  });

  const availableBalance = authorTotalEarnings - totalPaidOut;
  
  let minimumThreshold = 5000;
  try {
      const settings = await payload.findGlobal({ slug: 'commission-settings' });
      if (settings && settings.minimumPayoutThreshold) {
          minimumThreshold = settings.minimumPayoutThreshold;
      }
  } catch(e) {}

  // In a real app, this form would submit to a Server Action to request a payout
  // For this implementation, we just display the UI and the current bank details.
  const bankDetails = user.bankDetails || {};

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-black text-white">Earnings & Payouts</h1>
        <p className="text-gray-400 mt-2">Track your revenue and manage your bank details for payouts.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Balances */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-linear-to-br from-brand-primary to-red-900 border border-red-500/30 rounded-2xl p-8 shadow-xl shadow-red-900/20 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 p-6 opacity-20">
                <Wallet className="w-24 h-24" />
              </div>
              <h3 className="text-sm font-bold uppercase tracking-widest text-red-200 mb-2">Available Balance</h3>
              <p className="text-5xl font-black mb-6">₦{availableBalance.toLocaleString()}</p>
              
              <PayoutButton 
                availableBalance={availableBalance}
                minimumThreshold={minimumThreshold}
                hasPending={hasPending}
              />
            </div>

            <div className="bg-[#121214] border border-white/5 rounded-2xl p-8 shadow-xl flex flex-col justify-center">
              <h3 className="text-sm font-bold uppercase tracking-widest text-gray-500 mb-2">Total Paid Out</h3>
              <p className="text-4xl font-black text-white">₦{totalPaidOut.toLocaleString()}</p>
              
              <div className="mt-8 pt-6 border-t border-white/5">
                <h3 className="text-sm font-bold uppercase tracking-widest text-gray-500 mb-2">Lifetime Earnings</h3>
                <p className="text-2xl font-black text-gray-300">₦{authorTotalEarnings.toLocaleString()}</p>
              </div>
            </div>
          </div>

          {/* Earnings History */}
          <div className="bg-[#121214] border border-white/5 rounded-2xl p-8 shadow-xl">
            <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-4">
              <History className="text-brand-primary" />
              <h2 className="text-xl font-bold text-white">Recent Earnings</h2>
            </div>
            
            {orderHistory.length > 0 ? (
              <div className="space-y-4">
                {orderHistory.slice(0, 5).map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5">
                    <div>
                      <p className="font-bold text-white text-sm">Sale from {order.customerName}</p>
                      <p className="text-xs text-gray-500 mt-1">{new Date(order.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-black text-green-400">+ ₦{order.authorEarnings?.toLocaleString()}</p>
                      <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">Net Earning</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500">No earnings recorded yet.</p>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-[#121214] border border-white/5 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center gap-3 mb-6">
              <Building className="text-brand-primary" />
              <h2 className="text-lg font-bold text-white">Payout Account</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <p className="text-[10px] uppercase tracking-widest font-bold text-gray-500 mb-1">Bank Name</p>
                <p className="text-sm font-bold text-white">{bankDetails.bankName || "Not set"}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest font-bold text-gray-500 mb-1">Account Name</p>
                <p className="text-sm font-bold text-white">{bankDetails.accountName || "Not set"}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest font-bold text-gray-500 mb-1">Account Number</p>
                <p className="text-sm font-bold text-white">{bankDetails.accountNumber || "Not set"}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest font-bold text-gray-500 mb-1">Sort Code / Routing</p>
                <p className="text-sm font-bold text-white">{bankDetails.sortCodeOrRoutingNumber || "Not set"}</p>
              </div>
            </div>
            
            <div className="mt-6 pt-6 border-t border-white/5">
              <p className="text-xs text-gray-500">
                To update your bank details, please contact the publishing admin.
              </p>
            </div>
          </div>
          
          <div className="bg-[#121214] border border-white/5 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center gap-3 mb-6">
              <CreditCard className="text-brand-primary" />
              <h2 className="text-lg font-bold text-white">Recent Payouts</h2>
            </div>
            
            {payouts.length > 0 ? (
              <div className="space-y-4">
                {payouts.slice(0, 3).map((payout: any) => (
                  <div key={payout.id} className="p-3 bg-white/5 rounded-lg border border-white/5">
                    <div className="flex justify-between items-start mb-2">
                      <p className="font-bold text-white text-sm">₦{payout.amount?.toLocaleString()}</p>
                      <span className={`text-[9px] uppercase tracking-widest font-black px-2 py-0.5 rounded-full ${
                        payout.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                        payout.status === 'pending' ? 'bg-amber-500/20 text-amber-400' :
                        'bg-red-500/20 text-red-400'
                      }`}>
                        {payout.status}
                      </span>
                    </div>
                    <p className="text-[10px] text-gray-500">{new Date(payout.createdAt).toLocaleDateString()}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 text-center py-4">No past payouts.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
