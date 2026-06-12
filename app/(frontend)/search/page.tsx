import Link from "next/link";
import Image from "next/image";
import { getPayload, type Where } from "payload"; // 1. Imported Where type
import configPromise from "@/payload.config";
import { Sidebar } from "@/components/common/Sidebar";



const RESULTS_PER_PAGE = 10;

interface SearchResult {
    _id: string;
    title: string;
    slug: string;
    excerpt?: string;
    imageUrl?: string;
    date: string;
    category?: string;
    scripture?: string;
    type: "homily" | "article" | "prayer";
}

interface SearchPageProps {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
    const resolvedParams = await searchParams;
    const query = (resolvedParams.q as string) || "";
    const currentPage = Math.max(1, parseInt((resolvedParams.page as string) || "1", 10));
    const startIndex = (currentPage - 1) * RESULTS_PER_PAGE;
    const endIndex = startIndex + RESULTS_PER_PAGE;

    const payload = await getPayload({ config: configPromise });

    let allResults: SearchResult[] = [];
    if (query) {
        // 2. Applied explicit Where type structure to bypass union verification errors
        const searchWhere: Where = {
            or: [
                { title: { like: query } },
                { excerpt: { like: query } }
            ]
        };
        
        const [homily, articles, prayers] = await Promise.all([
            payload.find({ collection: 'homily', where: searchWhere, limit: 50 }),
            payload.find({ collection: 'article', where: searchWhere, limit: 50 }),
            payload.find({ collection: 'prayer', where: searchWhere, limit: 50 }),
        ]);

        const mapResults = (docs: any[], type: "homily" | "article" | "prayer") => docs.map(d => ({
            _id: d.id,
            title: d.title,
            slug: d.slug,
            excerpt: d.excerpt,
            imageUrl: d.featuredImage && typeof d.featuredImage === 'object' ? d.featuredImage.url : undefined,
            date: d.date || d.publishedAt || d.createdAt,
            category: typeof d.category === 'object' ? d.category?.title : d.category,
            scripture: d.scriptureReference,
            type: type
        }));

        allResults = [
            ...mapResults(homily.docs, 'homily'),
            ...mapResults(articles.docs, 'article'),
            ...mapResults(prayers.docs, 'prayer')
        ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }

    const totalResults = allResults.length;
    const results = allResults.slice(startIndex, endIndex);
    const totalPages = Math.ceil(totalResults / RESULTS_PER_PAGE);
    const hasPreviousPage = currentPage > 1;
    const hasNextPage = currentPage < totalPages;

    // Generate page numbers for pagination
    const getPageNumbers = (): (number | string)[] => {
        const pages: (number | string)[] = [];
        const maxButtons = 5;

        if (totalPages <= maxButtons + 2) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            pages.push(1);

            const startWindow = Math.max(2, currentPage - Math.floor(maxButtons / 2));
            const endWindow = Math.min(totalPages - 1, currentPage + Math.floor(maxButtons / 2));

            if (startWindow > 2) {
                pages.push("...");
            }

            for (let i = startWindow; i <= endWindow; i++) {
                pages.push(i);
            }

            if (endWindow < totalPages - 1) {
                pages.push("...");
            }

            if (totalPages > 1) {
                pages.push(totalPages);
            }
        }

        return pages;
    };

    const pageNumbers = getPageNumbers();

    const homilyRes = await payload.find({ collection: 'homily', limit: 100 });
    const recentHomiliesRes = await payload.find({ collection: 'homily', sort: '-date', limit: 5 });
    const recentArticlesRes = await payload.find({ collection: 'article', sort: '-publishedAt', limit: 5 });

    // Safely extract names for sidebar tracking strings
    const categories = Array.from(new Set(
        homilyRes.docs
            .filter((h: any) => h.category)
            .map((h: any) => typeof h.category === 'object' ? h.category.title : h.category)
    ));

    const recentPosts = [
        ...recentHomiliesRes.docs.map((d: any) => ({ ...d, _id: d.id, type: 'homily', imageUrl: typeof d.featuredImage === 'object' ? d.featuredImage?.url : undefined, publishedAt: d.date })),
        ...recentArticlesRes.docs.map((d: any) => ({ ...d, _id: d.id, type: 'article', imageUrl: typeof d.featuredImage === 'object' ? d.featuredImage?.url : undefined }))
    ].sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()).slice(0, 5);

    const sidebarData = { categories, recentPosts };

    return (
        <main className="pt-32 pb-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-20">
                    {/* Main Content Area */}
                    <div className="lg:col-span-8">
                        <header className="mb-8 md:mb-12">
                            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
                                Search Results
                            </h1>
                            {query && (
                                <p className="text-base md:text-lg text-muted-foreground">
                                    Results for:{" "}
                                    <span className="font-semibold text-foreground">&quot;{query}&quot;</span>
                                </p>
                            )}
                        </header>

                        {!query ? (
                            <div className="text-center py-12 md:py-20">
                                <p className="text-base md:text-lg text-muted-foreground">
                                    Enter a search term to find homily, articles, and prayers.
                                </p>
                            </div>
                        ) : results.length > 0 ? (
                            <>
                                <p className="text-sm text-muted-foreground mb-6 md:mb-8">
                                    Showing {startIndex + 1}-{Math.min(endIndex, totalResults)} of {totalResults}{" "}
                                    result
                                    {totalResults !== 1 ? "s" : ""}
                                </p>
                                <div className="space-y-6 md:space-y-8">
                                    {results.map((result) => (
                                        <Link
                                            href={`/${result.type === "homily" ? "homilies" : result.type === "article" ? "articles" : "prayers"}/${result.slug}`}
                                            key={result._id}
                                            className="block group bg-white rounded-lg border shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden">
                                            <article className="flex flex-col md:grid md:grid-cols-12 gap-0">
                                                {result.imageUrl && (
                                                    <div className="md:col-span-4 relative aspect-video md:aspect-square overflow-hidden">
                                                        <Image
                                                            src={result.imageUrl}
                                                            alt={result.title}
                                                            fill
                                                            className="object-cover transition-all duration-300"
                                                        />
                                                    </div>
                                                )}
                                                <div
                                                    className={`${result.imageUrl ? "md:col-span-8" : "md:col-span-12"} p-4 md:p-6`}>
                                                    <div className="flex flex-wrap items-center gap-2 md:gap-3 mb-2 md:mb-3">
                                                        <span className="text-xs font-medium text-primary uppercase">
                                                            {result.type === "homily"
                                                                ? result.category || "Homily"
                                                                : result.type}
                                                        </span>
                                                        <span className="text-xs text-muted-foreground">
                                                            {new Date(result.date).toLocaleDateString("en-US", {
                                                                year: "numeric",
                                                                month: "long",
                                                                day: "numeric",
                                                            })}
                                                        </span>
                                                    </div>
                                                    <h2 className="text-xl md:text-2xl font-semibold mb-2 md:mb-3 group-hover:text-primary transition-colors leading-snug">
                                                        {result.title}
                                                    </h2>
                                                    {result.scripture && (
                                                        <p className="text-sm text-muted-foreground mb-2 md:mb-3 italic">
                                                            {result.scripture}
                                                        </p>
                                                    )}
                                                    {result.excerpt && (
                                                        <p className="text-sm md:text-base text-muted-foreground line-clamp-2 md:line-clamp-3">
                                                            {result.excerpt}
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
                                        className="flex flex-wrap justify-center items-center gap-2 mt-12 md:mt-16"
                                        aria-label="Pagination">
                                        {/* Previous Button */}
                                        {hasPreviousPage ? (
                                            <Link
                                                href={`/search?q=${encodeURIComponent(query)}&page=${currentPage - 1}`}
                                                className="px-3 md:px-4 py-2 border rounded-lg hover:bg-gray-100 transition-colors text-sm md:text-base">
                                                Previous
                                            </Link>
                                        ) : (
                                            <span className="px-3 md:px-4 py-2 border rounded-lg opacity-50 cursor-not-allowed text-sm md:text-base">
                                                Previous
                                            </span>
                                        )}

                                        {/* Page Numbers */}
                                        {pageNumbers.map((page, index) =>
                                            page === "..." ? (
                                                <span
                                                    key={`ellipsis-${index}`}
                                                    className="px-2 md:px-4 py-2 text-gray-500 text-sm md:text-base">
                                                    ...
                                                </span>
                                            ) : (
                                                <Link
                                                    key={`page-${page}`}
                                                    href={`/search?q=${encodeURIComponent(query)}&page=${page}`}
                                                    className={`px-3 md:px-4 py-2 border rounded-lg transition-colors text-sm md:text-base ${
                                                        page === currentPage
                                                            ? "bg-primary text-white border-primary"
                                                            : "hover:bg-gray-100"
                                                    }`}
                                                    aria-current={page === currentPage ? "page" : undefined}>
                                                    {page}
                                                </Link>
                                            ),
                                        )}

                                        {/* Next Button */}
                                        {hasNextPage ? (
                                            <Link
                                                href={`/search?q=${encodeURIComponent(query)}&page=${currentPage + 1}`}
                                                className="px-3 md:px-4 py-2 border rounded-lg hover:bg-gray-100 transition-colors text-sm md:text-base">
                                                Next
                                            </Link>
                                        ) : (
                                            <span className="px-3 md:px-4 py-2 border rounded-lg opacity-50 cursor-not-allowed text-sm md:text-base">
                                                Next
                                            </span>
                                        )}
                                    </nav>
                                )}
                            </>
                        ) : (
                            <div className="text-center py-12 md:py-20">
                                <h2 className="text-xl md:text-2xl font-semibold mb-4">No results found</h2>
                                <p className="text-base md:text-lg text-muted-foreground mb-6 md:mb-8">
                                    We couldn&apos;t find anything matching &quot;{query}&quot;
                                </p>
                                <p className="text-sm md:text-base text-muted-foreground">
                                    Try searching with different keywords or browse our{" "}
                                    <Link href="/homilies" className="text-primary hover:underline">
                                        homily
                                    </Link>
                                    .
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Sidebar Area */}
                    <div className="lg:col-span-4">
                        <div className="lg:sticky lg:top-32 z-20">
                            <Sidebar categories={sidebarData.categories} recentPosts={sidebarData.recentPosts} />
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}

// Generate metadata for SEO
export async function generateMetadata({ searchParams }: SearchPageProps) {
    const resolvedParams = await searchParams;
    const query = (resolvedParams.q as string) || "";
    const page = (resolvedParams.page as string) || "1";

    return {
        title: query ? `Search Results for "${query}" - Page ${page}` : "Search",
        description: query
            ? `Search results for "${query}" in homily, articles, and prayers - Page ${page}.`
            : "Search our collection of homily, articles, and spiritual content.",
    };
}