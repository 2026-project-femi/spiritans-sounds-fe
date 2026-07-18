import Image from "next/image";
import { getPayload } from "payload";
import configPromise from "@/payload.config";
import RichText from '@/components/RichText';
import { YouTubeEmbed } from "@/components/PortableTextComponents";
import { Sidebar } from "@/components/common/Sidebar";
import Comments from "@/components/Comments";
import { Comment } from "@/lib/types";
import type { Metadata } from "next";
import { getOgImageUrl } from '@/lib/getOgImageUrl'


export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
	const payload = await getPayload({ config: configPromise });
	const result = await payload.find({
		collection: "article",
		where: {
			and: [
				{ slug: { equals: slug } },
				{ _status: { equals: 'published' } }
			]
		},
		depth: 1,
	});
    const doc = result.docs[0];
    if (!doc) return {};
    const title = doc.title;
    const description = doc.excerpt || "";
    const imageUrl = getOgImageUrl(doc);
    return {
        title,
        description,
        openGraph: {
            title,
            description,
            type: "article",
            images: imageUrl ? [{ url: imageUrl, width: 1200, height: 630, alt: title }] : [],
        },
        twitter: { card: "summary_large_image", title, description, images: imageUrl ? [imageUrl] : [] },
    };
}

interface Article {
    _id: string;
    title: string;
    slug: string;
    author: string;
    imageUrl?: string;
    publishedAt: string;
    youtubeUrl?: string;
    content: any; // PortableText
    comments?: Comment[];
}

interface PageProps {
    params: {
        slug: string;
    };
}

export default async function SingleArticlePage({ params }: { params: Promise<{ slug: string }> }) {
    const resolvedParams = await params;
	const payload = await getPayload({ config: configPromise });
	const result = await payload.find({
		collection: "article",
		where: {
			and: [
				{ slug: { equals: resolvedParams.slug } },
				{ _status: { equals: 'published' } }
			]
		},
	});
	const rawDoc = result.docs[0];
    
    let article: Article | null = null;
    if (rawDoc) {
        article = {
            ...rawDoc,
            _id: rawDoc.id,
            imageUrl: rawDoc.featuredImage && typeof rawDoc.featuredImage === 'object' ? rawDoc.featuredImage.url : undefined,
        } as Article;
    }

    if (!article) {
        return (
            <div className="container py-12 text-center">
                <h1 className="text-4xl font-bold">Article not found</h1>
                <p className="mt-4 text-lg text-muted-foreground">
                    The requested article could not be found.
                </p>
            </div>
        );
    }

    return (
        <main className="pt-32 pb-20">
            <div className="max-w-7xl mx-auto px-6 md:px-12">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
                    {/* Main Content Area */}
                    <article className="lg:col-span-8 relative z-0">
                        {article.imageUrl && (
                            // Image Section
                            <div className="aspect-[16/9] mb-12 bg-gray-100 overflow-hidden rounded-lg">
                                <Image
                                    src={article.imageUrl}
                                    alt={article.title}
                                    width={800} // Explicit width
                                    height={450} // Explicit height
                                    className="object-cover transition-opacity duration-300"
                                    priority
                                />
                            </div>
                        )}

                        {/* Title and Content Section (below the image) */}
                        <div className="pt-8">
                            <header className="mb-8 text-center">
                                <div className="flex items-center justify-center space-x-4 mb-6">
                                    {article.publishedAt && (
                                        <span className="text-[10px] tracking-widest text-gray-800 uppercase">
                                            {new Date(article.publishedAt).toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' })}
                                        </span>
                                    )}
                                </div>
                                <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight text-black mb-8">
                                    {article.title}
                                </h1>
                                <div className="flex items-center space-x-4 pb-8 border-b border-gray-200 justify-center">
                                    {article.author && (
                                        <p className="text-sm text-muted-foreground">
                                            By {article.author}
                                        </p>
                                    )}
                                </div>
                            </header>

                            {article.youtubeUrl && (
                                <YouTubeEmbed url={article.youtubeUrl} />
                            )}

                            <div className="prose prose-lg dark:prose-invert max-w-none text-black space-y-8 font-light leading-loose text-lg">
                                {article.content && <RichText data={article.content} />}
                            </div>
                        </div>
                        <Comments postType="article" postId={article._id} comments={article.comments || []} />
                    </article>

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