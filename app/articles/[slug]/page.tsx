import Image from "next/image";
import { client } from "@/sanity/lib/client";
import { ARTICLE_QUERY } from "@/sanity/lib/queries";
import { PortableText } from "@portabletext/react";

export const revalidate = 60;

interface Article {
    _id: string;
    title: string;
    slug: string;
    author: string;
    imageUrl?: string;
    publishedAt: string;
    content: any; // PortableText
}

interface PageProps {
    params: {
        slug: string;
    };
}

export default async function SingleArticlePage({ params }: { params: Promise<{ slug: string }> }) {
    const resolvedParams = await params;
    const article: Article = await client.fetch(ARTICLE_QUERY, { slug: resolvedParams.slug });

    if (!article) {
        return (
            <div className="container py-12 text-center">
                <h1 className="text-4xl font-bold">Article not found</h1>
            </div>
        );
    }

    return (
        <div className="container py-12">
            <article className="max-w-3xl mx-auto">
                {article.imageUrl && (
                    <div className="relative aspect-video rounded-lg overflow-hidden mb-8 shadow-lg">
                        <Image
                            src={article.imageUrl}
                            alt={article.title}
                            fill
                            className="object-cover"
                        />
                    </div>
                )}

                <header className="mb-8 text-center">
                    <h1 className="text-4xl font-bold tracking-tight lg:text-5xl mb-4">
                        {article.title}
                    </h1>
                    <div className="mt-4 text-sm text-muted-foreground flex justify-center items-center gap-4">
                        {article.author && <p>By {article.author}</p>}
                        {article.publishedAt && (
                            <>
                                <span>&bull;</span>
                                <p>
                                    Published on {new Date(article.publishedAt).toLocaleDateString("en-US", {
                                        year: 'numeric', month: 'long', day: 'numeric'
                                    })}
                                </p>
                            </>
                        )}
                    </div>
                </header>

                <div className="prose prose-lg dark:prose-invert max-w-none mx-auto">
                    <PortableText value={article.content} />
                </div>
            </article>
        </div>
    );
}