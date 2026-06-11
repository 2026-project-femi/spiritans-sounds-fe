import Link from "next/link";
import Image from "next/image";
import { getPayload } from "payload";
import configPromise from "@/payload.config";
import { Sidebar } from "@/components/common/Sidebar";
import { PrayerItem } from "@/lib/types";
import type { Metadata } from "next";


export const metadata: Metadata = {
	title: "Prayers & Devotionals",
	description: "Find solace and inspiration in our collection of prayers and devotionals.",
	openGraph: {
		title: "Prayers & Devotionals | Spiritans Sound",
		description: "Find solace and inspiration in our collection of prayers and devotionals.",
		images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
	},
	twitter: { card: "summary_large_image" },
};

const PRAYERS_PER_PAGE = 9;
const MAX_PAGE_BUTTONS = 5;

interface Prayer {
	_id: string;
	title: string;
	slug: string;
	category?: string;
	imageUrl?: string;
	excerpt?: string;
}

interface PrayersPageProps {
	searchParams: { [key: string]: string | string[] | undefined };
}

export default async function PrayersPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
	const resolvedSearchParams = await searchParams;
	const currentPage = parseInt((resolvedSearchParams.page as string) || "1", 10);
	const startIndex = (currentPage - 1) * PRAYERS_PER_PAGE;
	const endIndex = startIndex + PRAYERS_PER_PAGE;

	const payload = await getPayload({ config: configPromise });
	const result = await payload.find({
		collection: "prayer",
		limit: PRAYERS_PER_PAGE,
		page: currentPage,
		sort: "-publishedAt",
	});

	const prayers = result.docs.map((doc: any) => ({
		...doc,
		_id: doc.id,
		imageUrl: doc.featuredImage && typeof doc.featuredImage === 'object' ? doc.featuredImage.url : null,
	})) as PrayerItem[];

	const totalPages = result.totalPages;
	const hasPreviousPage = currentPage > 1;
	const hasNextPage = currentPage < totalPages;

	const pageNumbers: (number | string)[] = [];
	if (totalPages <= MAX_PAGE_BUTTONS + 2) {
		for (let i = 1; i <= totalPages; i++) {
			pageNumbers.push(i);
		}
	} else {
		pageNumbers.push(1);

		const startWindow = Math.max(2, currentPage - Math.floor(MAX_PAGE_BUTTONS / 2));
		const endWindow = Math.min(totalPages - 1, currentPage + Math.floor(MAX_PAGE_BUTTONS / 2));

		if (startWindow > 2) {
			pageNumbers.push("...");
		}

		for (let i = startWindow; i <= endWindow; i++) {
			if (i < totalPages) pageNumbers.push(i);
		}

		if (endWindow < totalPages - 1) {
			pageNumbers.push("...");
		}
		if (totalPages > 1 && !pageNumbers.includes(totalPages)) {
			pageNumbers.push(totalPages);
		}
	}

	return (
		<main className="pt-32 pb-20">
			<div className="max-w-7xl mx-auto px-6 md:px-12">
				<div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
					{/* Main Content Area */}
					<div className="lg:col-span-8">
						<header className="text-center mb-12">
							<h1 className="text-4xl font-bold tracking-tight lg:text-5xl">Prayers & Devotionals</h1>
							<p className="mt-4 text-lg text-muted-foreground">
								Find solace and inspiration in our collection of prayers and devotionals.
							</p>
						</header>

						{prayers.length > 0 ? (
							<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
								{prayers.map((prayer: PrayerItem) => (
									<Link
										href={`/prayers/${prayer.slug}`}
										key={prayer._id}
										className="block bg-white rounded-lg border shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 group">
										<article>
											{prayer.imageUrl && (
												<div className="relative aspect-video rounded-t-lg overflow-hidden">
													<Image
														src={prayer.imageUrl}
														alt={prayer.title}
														fill
														sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
														className="object-cover"
													/>
												</div>
											)}
											<div className="p-6">
												{prayer.category && (
													<p className="text-sm font-medium text-primary uppercase mb-2">
														{prayer.category}
													</p>
												)}
												<h2 className="text-xl font-semibold mb-2 group-hover:text-primary leading-snug">
													{prayer.title}
												</h2>
												{prayer.excerpt && (
													<p className="mt-4 text-base text-muted-foreground line-clamp-3">
														{prayer.excerpt}
													</p>
												)}
											</div>
										</article>
									</Link>
								))}
							</div>
						) : (
							<p className="text-center text-muted-foreground">No prayers found.</p>
						)}

						{/* Pagination Controls */}
						{totalPages > 1 && (
							<nav className="flex justify-center space-x-4 mt-16">
								<Link
									href={`/prayers?page=${currentPage - 1}`}
									className={`px-4 py-2 border rounded-lg ${!hasPreviousPage ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-100"}`}
									aria-disabled={!hasPreviousPage}
									tabIndex={!hasPreviousPage ? -1 : undefined}>
									Previous
								</Link>
								{pageNumbers.map((page, index) =>
									page === "..." ? (
										<span key={`ellipsis-${index}`} className="px-4 py-2">
											...
										</span>
									) : (
										<Link
											key={page}
											href={`/prayers?page=${page}`}
											className={`px-4 py-2 border rounded-lg ${page === currentPage ? "bg-primary text-white" : "hover:bg-gray-100"}`}>
											{page}
										</Link>
									),
								)}
								<Link
									href={`/prayers?page=${currentPage + 1}`}
									className={`px-4 py-2 border rounded-lg ${!hasNextPage ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-100"}`}
									aria-disabled={!hasNextPage}
									tabIndex={!hasNextPage ? -1 : undefined}>
									Next
								</Link>
							</nav>
						)}
					</div>

					{/* Sidebar Area */}
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
