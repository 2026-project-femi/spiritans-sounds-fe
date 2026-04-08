import Link from "next/link";
import Image from "next/image";
import { client } from "@/sanity/lib/client";
import { EVENTS_QUERY, EVENTS_COUNT_QUERY } from "@/sanity/lib/queries"; // Import EVENTS_COUNT_QUERY
import { Sidebar } from "@/components/common/Sidebar";
import { EventItem } from "@/lib/types";
import type { Metadata } from "next";

export const revalidate = 3600;

export const metadata: Metadata = {
	title: "News & Events",
	description: "Stay updated with the latest news and upcoming events from Spiritans Sound.",
	openGraph: {
		title: "News & Events | Spiritans Sound",
		description: "Stay updated with the latest news and upcoming events from Spiritans Sound.",
		images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
	},
	twitter: { card: "summary_large_image" },
};

const EVENTS_PER_PAGE = 9;
const MAX_PAGE_BUTTONS = 5;

export default async function EventsPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
	const resolvedSearchParams = await searchParams;
	const currentPage = parseInt((resolvedSearchParams.page as string) || "1", 10);
	const startIndex = (currentPage - 1) * EVENTS_PER_PAGE;
	const endIndex = startIndex + EVENTS_PER_PAGE;

	const [events, totalEvents] = await Promise.all([
		client.fetch(EVENTS_QUERY, { start: startIndex, end: endIndex }),
		client.fetch(EVENTS_COUNT_QUERY),
	]);

	const totalPages = Math.ceil(totalEvents / EVENTS_PER_PAGE);
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
							<h1 className="text-4xl font-bold tracking-tight lg:text-5xl">News & Events</h1>
							<p className="mt-4 text-lg text-muted-foreground">
								Stay updated with our latest news and upcoming events.
							</p>
						</header>

						{events.length > 0 ? (
							<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
								{events.map((event: EventItem) => (
									<Link
										href={`/news/${event.slug}`}
										key={event._id}
										className="block bg-white rounded-lg border shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 group">
										<article>
											{event.imageUrl && (
												<div className="relative aspect-video rounded-t-lg overflow-hidden">
													<Image
														src={event.imageUrl}
														alt={event.title}
														fill
														sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
														className="object-cover"
													/>
												</div>
											)}
											<div className="p-6">
												<h2 className="text-xl font-semibold mb-2 group-hover:text-primary leading-snug">
													{event.title}
												</h2>
												{event.date && (
													<p className="text-sm text-muted-foreground mb-1">
														{new Date(
															event.date,
														).toLocaleDateString("en-US", {
															year: "numeric",
															month: "long",
															day: "numeric",
														})}
													</p>
												)}
												{event.location && (
													<p className="text-sm text-muted-foreground mb-4">
														{event.location}
													</p>
												)}
												{event.excerpt && (
													<p className="mt-4 text-base text-muted-foreground line-clamp-3">
														{event.excerpt}
													</p>
												)}
											</div>
										</article>
									</Link>
								))}
							</div>
						) : (
							<p className="text-center text-muted-foreground">No events found.</p>
						)}

						{/* Pagination Controls */}
						{totalPages > 1 && (
							<nav className="flex justify-center space-x-4 mt-16">
								<Link
									href={`/news?page=${currentPage - 1}`}
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
											href={`/news?page=${page}`}
											className={`px-4 py-2 border rounded-lg ${page === currentPage ? "bg-primary text-white" : "hover:bg-gray-100"}`}>
											{page}
										</Link>
									),
								)}
								<Link
									href={`/news?page=${currentPage + 1}`}
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
