import { redirect } from "next/navigation";
import { getPayload } from "payload";
import configPromise from "@/payload.config";
import { cookies, headers } from "next/headers";
import Link from "next/link";
import { LayoutDashboard, Book, Wallet, FileText } from "lucide-react";
import React from "react";
import LogoutButton from "@/components/dashboard/LogoutButton";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const payload = await getPayload({ config: configPromise });
  const req = {
    headers: await headers(),
    cookies: await cookies(),
  };

  // Verify authentication
  const { user } = await payload.auth(req as any);

  if (!user || (user.role !== "author" && user.role !== "publishing_admin" && user.role !== "admin")) {
    redirect("/unveiler/login");
  }

  return (
    <div className="min-h-screen bg-[#08080a] text-white flex flex-col md:flex-row">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-[#121214] border-r border-white/5 flex flex-col pt-8 pb-4 shrink-0">
        <div className="px-6 mb-8">
          <span className="text-[10px] tracking-[0.3em] uppercase text-brand-primary font-black border border-brand-primary/30 px-3 py-1 rounded-full inline-block mb-4">
            Author Portal
          </span>
          <h2 className="text-xl font-bold line-clamp-1">{user.name || user.email}</h2>
          <p className="text-xs text-gray-500 uppercase tracking-widest mt-1">
            {user.role === 'publishing_admin' ? 'Publishing Admin' : 'Author'}
          </p>
        </div>

        <nav className="flex-1 space-y-2 px-4">
          <Link
            href="/unveiler/dashboard"
            className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-colors"
          >
            <LayoutDashboard size={18} />
            Overview
          </Link>
          <Link
            href="/unveiler/dashboard/books"
            className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-colors"
          >
            <Book size={18} />
            My Books
          </Link>
          <Link
            href="/unveiler/dashboard/earnings"
            className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-colors"
          >
            <Wallet size={18} />
            Earnings & Payouts
          </Link>
          
          <div className="pt-4 mt-4 border-t border-white/5">
            <Link
              href="/unveiler/publish"
              className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-colors"
            >
              <FileText size={18} />
              Submit New Book
            </Link>
          </div>
        </nav>

        <div className="px-4 mt-auto">
          <LogoutButton />
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}
