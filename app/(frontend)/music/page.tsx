import Link from "next/link";
import Image from "next/image";
import { getPayload } from "payload";
import configPromise from "@/payload.config";
import { Sidebar } from "@/components/common/Sidebar";
import { MusicItem } from "@/lib/types";
import type { Metadata } from "next";

export const revalidate = 3600;

export const metadata: Metadata = {
	title: "Music & Worship",
	description: "Sacred music and worship recordings crafted to lift the spirit and glorify God.",
	openGraph: {
		title: "Music & Worship | Spiritans Sound",
		description: "Sacred music and worship recordings crafted to lift the spirit and glorify God.",
		images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
	},
	twitter: { card: "summary_large_image" },
};

const MUSIC_PER_PAGE = 9;
const MAX_PAGE_BUTTONS = 5;

export default async function MusicPage({
	searchParams,
}: {
	searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
	const resolvedSearchParams = await searchParams;
	const currentPage = parseInt((resolvedSearchParams.page as string) || "1", 10);
	const startIndex = (currentPage - 1) * MUSIC_PER_PAGE;
	const endIndex = startIndex + MUSIC_PER_PAGE;

	const payload = await getPayload({ config: configPromise });
	const result = await payload.find({
		collection: "music",
		limit: MUSIC_PER_PAGE,
		page: currentPage,
	});

	const musicItems = result.docs.map((doc: any) => ({
		...doc,
		_id: doc.id,
		imageUrl: doc.featuredImage && typeof doc.featuredImage === 'object' ? doc.featuredImage.url : null,
	})) as MusicItem[];

	const totalPages = result.totalPages;
	const hasPreviousPage = currentPage > 1;
	const hasNextPage = currentPage < totalPages;

	const pageNumbers: (number | string)[] = [];
	if (totalPages <= MAX_PAGE_BUTTONS + 2) {
		for (let i = 1; i <= totalPages; i++) pageNumbers.push(i);
	} else {
		pageNumbers.push(1);
		const startWindow = Math.max(2, currentPage - Math.floor(MAX_PAGE_BUTTONS / 2));
		const endWindow = Math.min(totalPages - 1, currentPage + Math.floor(MAX_PAGE_BUTTONS / 2));
		if (startWindow > 2) pageNumbers.push("...");
		for (let i = startWindow; i <= endWindow; i++) {
			if (i < totalPages) pageNumbers.push(i);
		}
		if (endWindow < totalPages - 1) pageNumbers.push("...");
		if (totalPages > 1 && !pageNumbers.includes(totalPages)) pageNumbers.push(totalPages);
	}

	return (
		<main className="pt-32 pb-20">

			{/* ── Hero Header ────────────────────────────────────────── */}
			<header className="relative mb-16 px-6 md:px-12 overflow-hidden">
				<div className="max-w-7xl mx-auto">
					<div className="relative bg-foreground rounded-2xl px-10 py-16 md:py-20 overflow-hidden">

						{/* Decorative waveform bars */}
						<div className="absolute right-10 top-1/2 -translate-y-1/2 hidden md:flex items-end gap-[3px] opacity-20">
							{[40, 64, 28, 80, 48, 96, 32, 72, 56, 88, 24, 60, 44, 76, 36].map((h, i) => (
								<div
									key={i}
									className="w-1.5 bg-brand-primary rounded-full"
									style={{ height: `${h}px` }}
								/>
							))}
						</div>

						{/* Large background music note */}
						<svg
							className="absolute -left-8 top-1/2 -translate-y-1/2 opacity-5 text-white"
							width="320"
							height="320"
							fill="currentColor"
							viewBox="0 0 24 24"
						>
							<path d="M9 3v10.55A4 4 0 1 0 11 17V7h4V3H9z" />
						</svg>

						<div className="relative z-10 max-w-xl">
							<span className="text-xs font-bold tracking-[0.4em] uppercase text-brand-primary block mb-4">
								Spiritans Sound
							</span>
							<h1 className="text-5xl md:text-7xl serif leading-[1.1] text-white mb-6">
								Music &<br />Worship
							</h1>
							<p className="text-white/60 text-lg font-light leading-relaxed">
								Songs crafted to lift the spirit, stir the soul, and glorify God.
							</p>

							{/* Sound wave decoration — small */}
							<div className="flex items-end gap-[3px] mt-8">
								{[12, 20, 8, 28, 16, 32, 10, 24, 18, 30].map((h, i) => (
									<div
										key={i}
										className="w-1 bg-brand-primary rounded-full opacity-70"
										style={{ height: `${h}px` }}
									/>
								))}
							</div>
						</div>
					</div>
				</div>
			</header>

			{/* ── Main Grid ──────────────────────────────────────────── */}
			<div className="max-w-7xl mx-auto px-6 md:px-12">
				<div className="grid grid-cols-1 lg:grid-cols-12 gap-20">

					{/* Content */}
					<div className="lg:col-span-8">

						{musicItems.length > 0 ? (
							<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
								{musicItems.map((music: MusicItem) => (
									<Link
										href={`/music/${music.slug}`}
										key={music._id}
										className="group block"
									>
										{/* Album art */}
										<div className="relative aspect-square overflow-hidden rounded-xl bg-gray-100 mb-4">
											{music.imageUrl ? (
												<Image
													src={music.imageUrl}
													alt={music.title}
													fill
													sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
													className="object-cover transition-transform duration-500 group-hover:scale-105"
												/>
											) : (
												/* Placeholder when no image */
												<div className="w-full h-full bg-linear-to-br from-foreground/10 to-foreground/30 flex items-center justify-center">
													<svg
														className="w-16 h-16 text-foreground/20"
														fill="currentColor"
														viewBox="0 0 24 24"
													>
														<path d="M9 3v10.55A4 4 0 1 0 11 17V7h4V3H9z" />
													</svg>
												</div>
											)}

											{/* Dark gradient overlay */}
											<div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

											{/* Play button */}
											<div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
												<div className="w-14 h-14 rounded-full bg-brand-primary flex items-center justify-center shadow-lg">
													<svg
														className="w-6 h-6 text-white ml-1"
														fill="currentColor"
														viewBox="0 0 24 24"
													>
														<path d="M8 5v14l11-7z" />
													</svg>
												</div>
											</div>

											{/* "Music" label */}
											<div className="absolute top-3 left-3">
												<span className="bg-brand-primary text-white text-[9px] font-bold tracking-widest uppercase px-2 py-1">
													Music
												</span>
											</div>
										</div>

										{/* Track info */}
										<div>
											<h2 className="text-base font-semibold leading-snug mb-1 group-hover:text-brand-primary transition-colors line-clamp-1">
												{music.title}
											</h2>
											{music.artist && (
												<p className="text-xs text-foreground/50 tracking-wide uppercase font-medium">
													{music.artist}
												</p>
											)}
										</div>
									</Link>
								))}
							</div>
						) : (
							<div className="text-center py-20">
								<svg
									className="w-16 h-16 text-foreground/20 mx-auto mb-4"
									fill="currentColor"
									viewBox="0 0 24 24"
								>
									<path d="M9 3v10.55A4 4 0 1 0 11 17V7h4V3H9z" />
								</svg>
								<p className="text-foreground/40 text-sm tracking-widest uppercase">No tracks yet</p>
							</div>
						)}

						{/* Pagination */}
						{totalPages > 1 && (
							<nav className="flex justify-center items-center gap-1 mt-16">
								<Link
									href={`/music?page=${currentPage - 1}`}
									className={`px-3 py-2 text-xs tracking-widest uppercase font-bold border border-foreground/10 rounded transition-colors ${!hasPreviousPage ? "opacity-30 pointer-events-none" : "hover:border-brand-primary hover:text-brand-primary"}`}
									aria-disabled={!hasPreviousPage}
									tabIndex={!hasPreviousPage ? -1 : undefined}
								>
									← Prev
								</Link>
								{pageNumbers.map((page, index) =>
									page === "..." ? (
										<span key={`ellipsis-${index}`} className="px-3 py-2 text-foreground/30">
											…
										</span>
									) : (
										<Link
											key={page}
											href={`/music?page=${page}`}
											className={`w-9 h-9 flex items-center justify-center text-sm font-bold rounded transition-colors ${page === currentPage ? "bg-brand-primary text-white" : "border border-foreground/10 hover:border-brand-primary hover:text-brand-primary"}`}
										>
											{page}
										</Link>
									),
								)}
								<Link
									href={`/music?page=${currentPage + 1}`}
									className={`px-3 py-2 text-xs tracking-widest uppercase font-bold border border-foreground/10 rounded transition-colors ${!hasNextPage ? "opacity-30 pointer-events-none" : "hover:border-brand-primary hover:text-brand-primary"}`}
									aria-disabled={!hasNextPage}
									tabIndex={!hasNextPage ? -1 : undefined}
								>
									Next →
								</Link>
							</nav>
						)}
					</div>

					{/* Sidebar */}
					<div className="lg:col-span-4">
						<div className="sticky top-32 z-20">
							<Sidebar />
						</div>
					</div>
				</div>
			</div>
		</main>
	);
}
