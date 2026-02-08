import Image from "next/image";
import { client } from "@/sanity/lib/client";
import { SINGLE_MUSIC_QUERY } from "@/sanity/lib/queries";
import { PortableText } from "@portabletext/react";

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
            </div>
        );
    }

    return (
        <div className="container py-12">
            <article className="max-w-3xl mx-auto">
                {music.imageUrl && (
                    <div className="relative aspect-video rounded-lg overflow-hidden mb-8 shadow-lg">
                        <Image
                            src={music.imageUrl}
                            alt={music.title}
                            fill
                            className="object-cover"
                        />
                    </div>
                )}

                <header className="mb-8 text-center">
                    <h1 className="text-4xl font-bold tracking-tight lg:text-5xl mb-4">
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
                    <div className="prose prose-lg dark:prose-invert max-w-none mx-auto">
                        <PortableText value={music.lyrics || music.content} />
                    </div>
                )}
            </article>
        </div>
    );
}