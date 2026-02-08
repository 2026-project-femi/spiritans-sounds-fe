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

	return (
		<nav className="border-b border-neutral-800 bg-neutral-900">
			<ul className="flex gap-6 max-w-6xl mx-auto px-4 py-4">
				{tabs.map((tab) => {
					const active = pathname === tab.href || pathname.startsWith(tab.href + "/");

					return (
						<li key={tab.href}>
							<Link
								href={tab.href}
								className={`text-sm uppercase tracking-wide ${
									active
										? "text-yellow-400 border-b-2 border-yellow-400 pb-1"
										: "text-neutral-400 hover:text-white"
								}`}>
								{tab.label}
							</Link>
						</li>
					);
				})}
			</ul>
		</nav>
	);
}