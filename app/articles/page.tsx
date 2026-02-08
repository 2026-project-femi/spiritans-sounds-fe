import Link from "next/link";
import Image from "next/image";
import { client } from "@/sanity/lib/client";
import { ARTICLES_QUERY } from "@/sanity/lib/queries";

export const revalidate = 60;

interface Article {
    _id: string;
    title: string;
    slug: string;
    author: string;
    imageUrl?: string;
    publishedAt: string;
    excerpt?: string;
}

export default async function ArticlesPage() {
    const articles: Article[] = await client.fetch(ARTICLES_QUERY);

    return (
        <div className="container py-12">
            <header className="text-center mb-12">
                <h1 className="text-4xl font-bold tracking-tight lg:text-5xl">
                    All Articles
                </h1>
                <p className="mt-4 text-lg text-muted-foreground">
                    Explore insightful articles from our contributors.
                </p>
            </header>

            <main>
                {articles.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {articles.map((article) => (
                            <Link
                                href={`/articles/${article.slug}`}
                                key={article._id}
                                className="block bg-white rounded-lg border shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 group"
                            >
                                <article>
                                    {article.imageUrl && (
                                        <div className="relative aspect-video rounded-t-lg overflow-hidden">
                                            <Image
                                                src={article.imageUrl}
                                                alt={article.title}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                    )}
                                    <div className="p-6">
                                        <h2 className="text-xl font-semibold mb-2 group-hover:text-primary leading-snug">
                                            {article.title}
                                        </h2>
                                        {article.author && (
                                            <p className="text-sm text-muted-foreground mb-1">By {article.author}</p>
                                        )}
                                        {article.publishedAt && (
                                            <p className="text-sm text-muted-foreground">
                                                Published on {new Date(article.publishedAt).toLocaleDateString("en-US", {
                                                    year: 'numeric', month: 'long', day: 'numeric'
                                                })}
                                            </p>
                                        )}
                                        {article.excerpt && (
                                            <p className="mt-4 text-base text-muted-foreground line-clamp-3">
                                                {article.excerpt}
                                            </p>
                                        )}
                                    </div>
                                </article>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <p className="text-center text-muted-foreground">No articles found.</p>
                )}
            </main>
        </div>
    );
}