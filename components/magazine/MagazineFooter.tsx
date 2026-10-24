"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
	{ label: "Events", href: "/unveiler" },
	{ label: "Magazine", href: "/unveiler/issues" },
	{ label: "Books", href: "/unveiler/books" },
	{ label: "Radio", href: "/unveiler/radio" },
	{ label: "About", href: "/unveiler/about" },
];

export default function MagazineFooter() {
	const pathname = usePathname();

	if (pathname?.startsWith("/unveiler/books/behind-the-veil")) {
		return null;
	}

	return (
		<footer className="border-t border-white/10 bg-[#0c0c0e] text-white">
			<div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 md:grid-cols-[1.4fr_1fr_1fr]">
				<div>
					<p className="text-2xl font-black uppercase tracking-[0.15em]">
						<span className="bg-linear-to-r from-brand-primary to-brand-primary/80 bg-clip-text text-transparent">
							Treasures
						</span>{" "}
						Unveiler
					</p>
					<p className="mt-3 max-w-sm text-sm text-gray-400">
						A publication of Treasures Unveiler Youth Development Foundation, telling the stories that shape our communities.
					</p>
					<Link
						href="/"
						className="mt-5 inline-flex text-sm font-medium text-gray-300 underline decoration-white/20 underline-offset-4 transition-colors hover:text-brand-primary"
					>
						Visit Spiritans Sound
					</Link>
				</div>
				<div>
					<p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">Explore</p>
					<ul className="mt-4 space-y-2.5 text-sm">
						{links.map((link) => (
							<li key={link.href}>
								<Link href={link.href} className="text-gray-300 transition-colors hover:text-brand-primary">
									{link.label}
								</Link>
							</li>
						))}
					</ul>
				</div>
				<div>
					<p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">Connect</p>
					<p className="mt-4 text-sm text-gray-400">
						Stories, launches and opportunities from the Unveiler community.
					</p>
					<Link
						href="/contact"
						className="mt-4 inline-flex text-sm font-medium text-gray-300 underline decoration-white/20 underline-offset-4 transition-colors hover:text-brand-primary"
					>
						Contact the Unveiler team
					</Link>
				</div>
			</div>
			<div className="border-t border-white/10 px-6 py-5 text-xs text-gray-500">
				<div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 sm:flex-row">
					<span>© Treasures Unveiler Youth Development Foundation</span>
					<nav aria-label="Spiritans Sound network" className="flex flex-wrap items-center justify-center gap-4">
						<Link href="/" className="transition-colors hover:text-white">Spiritans Sound</Link>
						<Link href="/unveiler" className="text-white">Treasures Unveiler</Link>
						<Link href="/young-creators" className="transition-colors hover:text-white">Young Creators</Link>
					</nav>
				</div>
			</div>
		</footer>
	);
}
