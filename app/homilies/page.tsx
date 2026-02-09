import Link from "next/link";
import Image from "next/image";
import { client } from "@/sanity/lib/client";
import { HOMILIES_QUERY, HOMILIES_COUNT_QUERY } from "@/sanity/lib/queries";
import { Sidebar } from "@/components/common/Sidebar";

export const revalidate = 60;

const HOMILIES_PER_PAGE = 9;
const MAX_PAGE_BUTTONS = 5;

interface Homily {
	_id: string;
	title: string;
	slug: string;
	date: string;
	scripture: string;
	category: string;
	imageUrl?: string;
	excerpt?: string;
}

interface HomiliesPageProps {
	searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function HomiliesPage({ searchParams }: HomiliesPageProps) {
	const resolvedSearchParams = await searchParams;
	const currentPage = Math.max(1, parseInt((resolvedSearchParams.page as string) || "1", 10));
	const startIndex = (currentPage - 1) * HOMILIES_PER_PAGE;
	const endIndex = startIndex + HOMILIES_PER_PAGE;

	const [homilies, totalHomilies] = await Promise.all([
		client.fetch(HOMILIES_QUERY, { start: startIndex, end: endIndex }),
		client.fetch(HOMILIES_COUNT_QUERY),
	]);

	const totalPages = Math.ceil(totalHomilies / HOMILIES_PER_PAGE);
	const hasPreviousPage = currentPage > 1;
	const hasNextPage = currentPage < totalPages;

	// Generate page numbers with ellipsis
	const getPageNumbers = (): (number | string)[] => {
		const pages: (number | string)[] = [];

		if (totalPages <= MAX_PAGE_BUTTONS + 2) {
			// Show all pages if total is small
			for (let i = 1; i <= totalPages; i++) {
				pages.push(i);
			}
		} else {
			// Always show first page
			pages.push(1);

			const startWindow = Math.max(2, currentPage - Math.floor(MAX_PAGE_BUTTONS / 2));
			const endWindow = Math.min(totalPages - 1, currentPage + Math.floor(MAX_PAGE_BUTTONS / 2));

			// Add ellipsis after first page if needed
			if (startWindow > 2) {
				pages.push("...");
			}

			// Add middle pages
			for (let i = startWindow; i <= endWindow; i++) {
				pages.push(i);
			}

			// Add ellipsis before last page if needed
			if (endWindow < totalPages - 1) {
				pages.push("...");
			}

			// Always show last page
			if (totalPages > 1) {
				pages.push(totalPages);
			}
		}

		return pages;
	};

	const pageNumbers = getPageNumbers();

	return (
		<main className="pt-32 pb-20">
			<div className="max-w-475 mx-auto px-6 md:px-12">
				<div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
					{/* Main Content Area */}
					<div className="lg:col-span-8">
						<header className="text-center mb-12">
							<h1 className="text-4xl font-bold tracking-tight lg:text-5xl">Homilies & Reflections</h1>
							<p className="mt-4 text-lg text-muted-foreground">
								Explore our collection of homilies and reflections on the Word of God.
							</p>
						</header>

						{homilies.length > 0 ? (
							<>
								<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
									{homilies.map((homily: Homily) => (
										<Link
											href={`/homilies/${homily.slug}`}
											key={homily._id}
											className="block bg-white rounded-lg border shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 group">
											<article>
												{homily.imageUrl && (
													<div className="relative aspect-video rounded-t-lg overflow-hidden">
														<Image
															src={homily.imageUrl}
															alt={homily.title}
															fill
															className="object-cover"
														/>
													</div>
												)}
												<div className="p-6">
													{homily.category && (
														<p className="text-sm font-medium text-primary uppercase mb-2">
															{homily.category}
														</p>
													)}
													<h2 className="text-2xl font-semibold mb-2 group-hover:text-primary leading-snug">
														{homily.title}
													</h2>
													{homily.scripture && (
														<p className="text-sm text-muted-foreground mb-4">
															{homily.scripture}
														</p>
													)}
													<p className="text-sm text-muted-foreground">
														{new Date(
															homily.date,
														).toLocaleDateString("en-US", {
															year: "numeric",
															month: "long",
															day: "numeric",
														})}
													</p>
													{homily.excerpt && (
														<p className="mt-4 text-base text-muted-foreground line-clamp-3">
															{homily.excerpt}
														</p>
													)}
												</div>
											</article>
										</Link>
									))}
								</div>

								{/* Pagination Controls */}
								{totalPages > 1 && (
									<nav
										className="flex flex-wrap justify-center items-center gap-2 mt-16"
										aria-label="Pagination">
										{/* Previous Button */}
										{hasPreviousPage ? (
											<Link
												href={`/homilies?page=${currentPage - 1}`}
												className="px-4 py-2 border rounded-lg hover:bg-gray-100 transition-colors">
												Previous
											</Link>
										) : (
											<span className="px-4 py-2 border rounded-lg opacity-50 cursor-not-allowed">
												Previous
											</span>
										)}

										{/* Page Numbers */}
										{pageNumbers.map((page, index) =>
											page === "..." ? (
												<span
													key={`ellipsis-${index}`}
													className="px-4 py-2 text-gray-500">
													...
												</span>
											) : (
												<Link
													key={`page-${page}`}
													href={`/homilies?page=${page}`}
													className={`px-4 py-2 border rounded-lg transition-colors ${
														page === currentPage
															? "bg-primary text-white border-primary"
															: "hover:bg-gray-100"
													}`}
													aria-current={
														page === currentPage
															? "page"
															: undefined
													}>
													{page}
												</Link>
											),
										)}

										{/* Next Button */}
										{hasNextPage ? (
											<Link
												href={`/homilies?page=${currentPage + 1}`}
												className="px-4 py-2 border rounded-lg hover:bg-gray-100 transition-colors">
												Next
											</Link>
										) : (
											<span className="px-4 py-2 border rounded-lg opacity-50 cursor-not-allowed">
												Next
											</span>
										)}
									</nav>
								)}
							</>
						) : (
							<p className="text-center text-muted-foreground">No homilies found.</p>
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
