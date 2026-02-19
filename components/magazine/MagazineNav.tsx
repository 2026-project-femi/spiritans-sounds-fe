"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { label: "Events", href: "/unveiler" },
  { label: "Magazine", href: "/unveiler/issues" },
  { label: "Books", href: "/unveiler/books" },
  { label: "Radio", href: "/unveiler/radio" },
  { label: "Adverts", href: "/unveiler/adverts" },
  { label: "About", href: "/unveiler/about" },
];

export default function MagazineNav() {
  const pathname = usePathname();

  const isActiveTab = (href: string) => {
    // Events tab: exact match on /unveiler only (not sub-paths like /unveiler/about)
    if (href === "/unveiler") {
      return pathname === "/unveiler" || pathname === "/unveiler/";
    }
    return pathname === href || pathname.startsWith(href + "/");
  };

  return (
    <nav className="border-b border-brand-primary/10 bg-[#0c0c0e]/95 backdrop-blur-md pt-20 sticky top-0 z-40">
      <div className="text-center py-4 border-b border-white/5">
        <Link href="/unveiler" className="text-white font-black text-2xl tracking-[0.15em] uppercase hover:text-brand-primary transition-colors">
          <span className="text-transparent bg-clip-text bg-linear-to-r from-brand-primary to-brand-primary/80">TREASURES</span>{" "}
          UNVEILER
        </Link>
        <p className="text-[10px] tracking-[0.3em] uppercase text-gray-300 mt-1">Youth Development Foundation</p>
      </div>
      <div className="max-w-7xl mx-auto px-6 overflow-x-auto">
        <ul className="flex gap-1 py-3 min-w-max">
          {tabs.map((tab) => {
            const active = isActiveTab(tab.href);
            return (
              <li key={tab.href}>
                <Link
                  href={tab.href}
                  className={`text-xs font-semibold uppercase tracking-[0.15em] transition-all duration-200 px-4 py-2 rounded-full ${
                    active
                      ? "bg-linear-to-r from-brand-primary to-brand-primary/80 text-white"
                      : "text-gray-400 hover:text-white hover:bg-white/5"
                  }`}>
                  {tab.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
