import Image from "next/image";
import { client } from "@/sanity/lib/client";
import { SINGLE_MUSIC_QUERY } from "@/sanity/lib/queries";
import { PortableText } from "@portabletext/react";
import { Sidebar } from "@/components/common/Sidebar"; // Import the new Sidebar component

export const revalidate = 60;

interface Music {
    _id: string;
    title: string;
    slug: string;
    artist: string;
    audioUrl?: string;
    lyrics?: any; // PortableText
    imageUrl?: string;
    content?: any; // Fallback if lyrics is not PortableText
}

interface PageProps {
    params: {
        slug: string;
    };
}

export default async function SingleMusicPage({ params }: { params: Promise<{ slug: string }> }) {
    const resolvedParams = await params;
    const music: Music = await client.fetch(SINGLE_MUSIC_QUERY, { slug: resolvedParams.slug });

    if (!music) {
        return (
            <div className="container py-12 text-center">
                <h1 className="text-4xl font-bold">Music not found</h1>
                <p className="mt-4 text-lg text-muted-foreground">
                    The requested music could not be found.
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
                        {music.imageUrl && (
                            // Image Section
                            <div className="aspect-[16/9] mb-12 bg-gray-100 overflow-hidden rounded-lg">
                                <Image
                                    src={music.imageUrl}
                                    alt={music.title}
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
                                <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight text-black mb-8">
                                    {music.title}
                                </h1>
                                {music.artist && (
                                    <p className="text-lg text-muted-foreground">By {music.artist}</p>
                                )}
                            </header>

                            {music.audioUrl && (
                                <div className="my-8">
                                    <audio controls className="w-full">
                                        <source src={music.audioUrl} type="audio/mpeg" />
                                        Your browser does not support the audio element.
                                    </audio>
                                </div>
                            )}

                            {(music.lyrics || music.content) && (
                                <div className="prose prose-lg dark:prose-invert max-w-none text-black space-y-8 font-light leading-loose text-lg">
                                    <PortableText value={music.lyrics || music.content} />
                                </div>
                            )}
                        </div>
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