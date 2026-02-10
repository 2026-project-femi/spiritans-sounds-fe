"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
	{ label: "About", href: "/unveiler" },
	{ label: "Issues", href: "/unveiler/issues" },
	{ label: "Articles", href: "/unveiler/articles" },
];

export default function MagazineNav() {
	const pathname = usePathname();

	const isActiveTab = (href: string) => {
		// Exact match for all tabs to avoid overlap
		// Since /unveiler/issues starts with /unveiler, we need exact matching
		if (href === "/unveiler") {
			return pathname === "/unveiler" || pathname === "/unveiler/";
		}
		// For sub-pages, check if pathname starts with the href
		return pathname === href || pathname.startsWith(href + "/");
	};

	return (
		<nav className="border-b border-sacred-gold/20 bg-[#413d3d] pt-20">
			<div className="text-center text-black font-bold text-4xl italic animate-pulse">UNVEILER MAGAZINE</div>
			<div className="max-w-6xl mx-auto px-6 md:px-12">
				<ul className="flex gap-8 py-6">
					{tabs.map((tab) => {
						const active = isActiveTab(tab.href);

						return (
							<li key={tab.href}>
								<Link
									href={tab.href}
									className={`text-xs font-medium uppercase tracking-[0.2em] transition-gentle pb-2 border-b-2 ${
										active
											? "text-sacred-gold border-sacred-gold"
											: "text-gray-400 border-transparent hover:text-white hover:border-sacred-gold/50"
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
