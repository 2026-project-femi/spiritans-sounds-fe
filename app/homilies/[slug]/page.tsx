import Image from "next/image";
import { client } from "@/sanity/lib/client";
import { HOMILY_QUERY } from "@/sanity/lib/queries";
import { PortableText } from "@portabletext/react";

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
        <div className="container py-12">
            <article className="max-w-3xl mx-auto">
                {homily.imageUrl && (
                    <div className="relative aspect-video rounded-lg overflow-hidden mb-8 shadow-lg">
                        <Image
                            src={homily.imageUrl}
                            alt={homily.title}
                            fill
                            className="object-cover"
                        />
                    </div>
                )}

                <header className="mb-8 text-center">
                    {homily.category && (
                        <p className="text-sm font-semibold text-primary uppercase mb-2">
                            {homily.category}
                        </p>
                    )}
                    <h1 className="text-4xl font-bold tracking-tight lg:text-5xl">
                        {homily.title}
                    </h1>
                    <div className="mt-4 text-sm text-muted-foreground flex justify-center items-center gap-4">
                        <p>
                            {new Date(homily.date).toLocaleDateString("en-US", {
                                year: 'numeric', month: 'long', day: 'numeric'
                            })}
                        </p>
                        {homily.scripture && (
                            <>
                                <span>&bull;</span>
                                <p>{homily.scripture}</p>
                            </>
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

                <div className="prose prose-lg dark:prose-invert max-w-none mx-auto">
                    <PortableText value={homily.content} />
                </div>
            </article>
        </div>
    );
}