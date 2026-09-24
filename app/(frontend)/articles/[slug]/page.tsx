import Image from "next/image";
import { getPayload } from "payload";
import configPromise from "@/payload.config";
import RichText from '@/components/RichText';
import { YouTubeEmbed } from "@/components/PortableTextComponents";
import { Sidebar } from "@/components/common/Sidebar";
import Comments from "@/components/Comments";
import { ShareButtons } from "@/components/common/ShareButtons";
import { MediaCaption } from "@/components/common/MediaCaption";
import { Comment } from "@/lib/types";
import type { Metadata } from "next";
import { getOgImageUrl } from '@/lib/getOgImageUrl'
import { TrackContentRead } from "@/components/analytics/TrackContentRead";


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
		depth: 2,
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

    // Fetch approved comments for this article
    const commentsResult = await payload.find({
      collection: "comments",
      where: {
        and: [
          { 'post.value': { equals: rawDoc.id } },
          { 'post.relationTo': { equals: 'article' } },
          { approved: { equals: true } },
        ],
      },
      sort: '-createdAt',
      depth: 1,
    });

    const comments: Comment[] = commentsResult.docs.map((c) => ({
      _id: String(c.id),
      name: c.name,
      email: c.email,
      comment: c.comment,
      createdAt: c.createdAt,
      parent:
        c.parent && typeof c.parent === 'object' && 'id' in c.parent
          ? String((c.parent as { id: string | number }).id)
          : c.parent
          ? String(c.parent)
          : null,
      reactions: (c.reactions as Record<string, number>) || {},
    }));


    const featuredImageDoc = rawDoc?.featuredImage && typeof rawDoc.featuredImage === 'object' ? rawDoc.featuredImage : null;
    const featuredCaption = featuredImageDoc?.caption;

    return (
        <main className="pt-32 pb-20">
            <TrackContentRead
                id={article._id}
                slug={article.slug}
                title={article.title}
                author={article.author}
                type="article"
                collection="article"
            />
            <div className="max-w-7xl mx-auto px-6 md:px-12">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
                    {/* Main Content Area */}
                    <article className="lg:col-span-8 relative z-0">
                        {article.imageUrl && (
                            // Image Section
                            <figure className="mb-12">
                                <div className="aspect-[16/9] bg-gray-100 overflow-hidden rounded-lg">
                                    <Image
                                        src={article.imageUrl}
                                        alt={featuredImageDoc?.alt || article.title}
                                        width={800} // Explicit width
                                        height={450} // Explicit height
                                        className="object-cover transition-opacity duration-300 w-full h-full"
                                        priority
                                    />
                                </div>
                                <MediaCaption caption={featuredCaption} />
                            </figure>
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
                                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-8 border-b border-gray-200">
                                    <div className="text-left">
                                        {article.author && (
                                            <p className="text-sm font-medium text-gray-700">
                                                By {article.author}
                                            </p>
                                        )}
                                    </div>
                                    <ShareButtons
                                        title={article.title}
                                        slug={article.slug}
                                        itemType="article"
                                        theme="light"
                                    />
                                </div>
                            </header>

                            {article.youtubeUrl && (
                                <YouTubeEmbed url={article.youtubeUrl} />
                            )}

                            <div className="prose prose-lg dark:prose-invert max-w-none text-black space-y-8 font-light leading-loose text-lg">
                                {article.content && <RichText data={article.content} />}
                            </div>

                            {/* Bottom Share Section */}
                            <div className="my-10 pt-6 pb-6 border-t border-b border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                                <span className="text-sm font-semibold text-gray-700">
                                    Enjoyed this article? Share it with others:
                                </span>
                                <ShareButtons
                                    title={article.title}
                                    slug={article.slug}
                                    itemType="article"
                                    theme="light"
                                />
                            </div>
                        </div>
                        <Comments postType="article" postId={article._id} comments={comments} />
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