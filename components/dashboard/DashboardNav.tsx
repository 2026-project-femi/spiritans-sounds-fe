"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Book, Wallet, FileText, Menu, X, User } from "lucide-react";
import LogoutButton from "./LogoutButton";

interface DashboardNavProps {
  user: {
    name?: string | null;
    email?: string | null;
    role?: string | null;
  };
}

export default function DashboardNav({ user }: DashboardNavProps) {
  const pathname = usePathname();
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  const getRoleLabel = () => {
    if (user.role === "admin") return "Administrator";
    if (user.role === "publishing_admin") return "Publishing Admin";
    return "Author";
  };

  const navLinks = [
    {
      href: "/unveiler/dashboard",
      label: "Overview",
      icon: LayoutDashboard,
      exact: true,
    },
    {
      href: "/unveiler/dashboard/books",
      label: "My Books",
      icon: Book,
      exact: false,
    },
    {
      href: "/unveiler/dashboard/earnings",
      label: "Earnings & Payouts",
      icon: Wallet,
      exact: false,
    },
    {
      href: "/unveiler/dashboard/profile",
      label: "Profile Settings",
      icon: User,
      exact: false,
    },
  ];

  const isActive = (href: string, exact: boolean) => {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* Mobile Sticky Top Header */}
      <div className="md:hidden sticky top-0 z-40 bg-[#121214]/95 backdrop-blur-md border-b border-white/10 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
            aria-label="Toggle Dashboard Menu"
            className="p-2 -ml-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
          >
            {isMobileNavOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
          <div>
            <span className="text-[9px] tracking-[0.2em] uppercase text-brand-primary font-bold border border-brand-primary/30 px-2 py-0.5 rounded-full inline-block">
              {getRoleLabel()}
            </span>
            <h2 className="text-sm font-bold text-white line-clamp-1">
              {user.name || user.email}
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <LogoutButton variant="compact" />
        </div>
      </div>

      {/* Mobile Drawer Backdrop */}
      {isMobileNavOpen && (
        <div
          onClick={() => setIsMobileNavOpen(false)}
          className="md:hidden fixed inset-0 bg-black/70 backdrop-blur-xs z-40"
        />
      )}

      {/* Sidebar (Desktop Sticky / Mobile Drawer) */}
      <aside
        className={`fixed md:sticky top-0 bottom-0 left-0 z-50 md:z-10 w-72 md:w-64 bg-[#121214] border-r border-white/5 flex flex-col md:h-screen transition-transform duration-300 ease-in-out shrink-0 ${
          isMobileNavOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        {/* Header User Badge */}
        <div className="p-6 border-b border-white/5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] tracking-[0.25em] uppercase text-brand-primary font-black border border-brand-primary/30 px-3 py-1 rounded-full inline-block mb-3">
              Portal
            </span>
            <button
              onClick={() => setIsMobileNavOpen(false)}
              className="md:hidden p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-white/5 min-h-[40px] min-w-[40px] flex items-center justify-center"
            >
              <X size={20} />
            </button>
          </div>
          <h2 className="text-lg font-bold line-clamp-1 text-white">
            {user.name || user.email}
          </h2>
          <p className="text-xs text-gray-400 uppercase tracking-wider mt-1">
            {getRoleLabel()}
          </p>
        </div>

        {/* Scrollable Navigation Links */}
        <nav className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-1.5">
          {navLinks.map((item) => {
            const active = isActive(item.href, item.exact);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMobileNavOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 text-sm font-semibold rounded-xl transition-all ${
                  active
                    ? "bg-brand-primary text-white shadow-lg shadow-brand-primary/20"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <Icon size={18} className="shrink-0" />
                <span>{item.label}</span>
              </Link>
            );
          })}

          <div className="pt-3 mt-3 border-t border-white/5">
            <Link
              href="/unveiler/publish"
              onClick={() => setIsMobileNavOpen(false)}
              className="flex items-center gap-3 px-4 py-3 text-sm font-semibold text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-colors"
            >
              <FileText size={18} className="shrink-0" />
              <span>Submit New Book</span>
            </Link>
          </div>
        </nav>

        {/* Pinned Bottom Logout Footer */}
        <div className="p-4 border-t border-white/5 bg-[#121214] shrink-0 mt-auto">
          <LogoutButton />
        </div>
      </aside>
    </>
  );
}
