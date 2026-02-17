import Image from "next/image";
import { client } from "@/sanity/lib/client";
import { HOMILY_QUERY } from "@/sanity/lib/queries";
import { PortableText } from "@portabletext/react";
import { Sidebar } from "@/components/common/Sidebar"; // Import the new Sidebar component
import Comments from "@/components/Comments";
import { Comment } from "@/lib/types";

export const revalidate = 60;

interface Homily {
    _id: string;
    title: string;
    slug: string;
    date: string;
    scripture: string;
    audio?: string;
    content: any; // PortableText
    category?: string;
    seo?: any;
    imageUrl?: string;
    publishedAt?: string;
    comments?: Comment[];
}

interface PageProps {
    params: {
        slug: string;
    };
}

export default async function SingleHomilyPage({ params }: { params: Promise<{ slug: string }> }) {
    const resolvedParams = await params;
    const homily: Homily = await client.fetch(HOMILY_QUERY, { slug: resolvedParams.slug });

    if (!homily) {
        return (
            <div className="container py-12 text-center">
                <h1 className="text-4xl font-bold">Homily not found</h1>
                <p className="mt-4 text-lg text-muted-foreground">
                    The requested homily could not be found.
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
                        {homily.imageUrl && (
                            // Image Section
                            <div className="aspect-[16/9] mb-12 bg-gray-100 overflow-hidden rounded-lg">
                                <Image
                                    src={homily.imageUrl}
                                    alt={homily.title}
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
                                    {homily.category && (
                                        <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-primary bg-primary/5 px-3 py-1 border border-primary/10">
                                            {homily.category}
                                        </span>
                                    )}
                                    {homily.date && (
                                        <span className="text-[10px] tracking-widest text-gray-800 uppercase">
                                            {new Date(homily.date).toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' })}
                                        </span>
                                    )}
                                </div>
                                <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight text-black mb-8">
                                    {homily.title}
                                </h1>
                                <div className="flex items-center space-x-4 pb-8 border-b border-gray-200 justify-center">
                                    {homily.scripture && (
                                        <p className="text-sm text-muted-foreground">
                                            {homily.scripture}
                                        </p>
                                    )}
                                </div>
                            </header>

                            {homily.audio && (
                                <div className="my-8">
                                    <audio controls className="w-full">
                                        <source src={homily.audio} type="audio/mpeg" />
                                        Your browser does not support the audio element.
                                    </audio>
                                </div>
                            )}

                            <div className="prose prose-lg dark:prose-invert max-w-none text-black space-y-8 font-light leading-loose text-lg">
                        
                                {homily.content && (
                                    <PortableText value={homily.content} />
                                )}
                            </div>
                        </div>
                        <Comments postId={homily._id} comments={homily.comments || []} />
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