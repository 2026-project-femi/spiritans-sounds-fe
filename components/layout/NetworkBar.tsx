import Link from "next/link";

const BRANDS = [
	{ id: "spiritans", label: "Spiritans Sound", href: "/" },
	{ id: "unveiler", label: "Treasures Unveiler", href: "/unveiler" },
	{ id: "young-creators", label: "Young Creators", href: "/young-creators" },
] as const;

export type NetworkBrand = (typeof BRANDS)[number]["id"];

/**
 * Shared utility navigation for the Spiritans Sound family of sites.
 * Every brand keeps its own header; this bar is the consistent way to switch.
 */
export default function NetworkBar({ current }: { current: NetworkBrand }) {
	return (
		<div className="border-b border-white/10 bg-[#0c0c0e] text-[9px] sm:text-[11px]">
			<div className="mx-auto flex max-w-7xl items-center justify-center gap-3 px-4 py-1.5 sm:justify-between sm:px-6 md:px-12">
				<span className="hidden uppercase tracking-[0.2em] text-white/40 sm:block">
					Spiritans Sound Network
				</span>
				<nav aria-label="Spiritans Sound network" className="flex flex-wrap items-center justify-center gap-1 sm:gap-2">
					{BRANDS.map((brand, index) => (
						<div key={brand.id} className="flex flex-wrap items-center justify-center gap-1 sm:gap-2">
							{index > 0 && <span aria-hidden="true" className="hidden text-white/20 sm:inline">/</span>}
							<Link
								href={brand.href}
								aria-current={current === brand.id ? "page" : undefined}
								className={`inline-flex min-h-[30px] items-center rounded-full px-1 py-1 font-semibold uppercase tracking-[0.08em] transition-colors sm:px-2 sm:tracking-[0.12em] ${
									current === brand.id
										? "bg-white/10 text-white"
										: "text-white/55 hover:bg-white/5 hover:text-white"
								}`}
							>
								{brand.label}
							</Link>
						</div>
					))}
				</nav>
			</div>
		</div>
	);
}
