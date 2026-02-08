import Image from "next/image";
import { client } from "@/sanity/lib/client";
import { PRAYER_QUERY } from "@/sanity/lib/queries";
import { PortableText } from "@portabletext/react";

export const revalidate = 60;

interface Prayer {
    _id: string;
    title: string;
    slug: string;
    category?: string;
    imageUrl?: string;
    content: any; // PortableText
}

interface PageProps {
    params: {
        slug: string;
    };
}

export default async function SinglePrayerPage({ params }: { params: Promise<{ slug: string }> }) {
    const resolvedParams = await params;
    const prayer: Prayer = await client.fetch(PRAYER_QUERY, { slug: resolvedParams.slug });

    if (!prayer) {
        return (
            <div className="container py-12 text-center">
                <h1 className="text-4xl font-bold">Prayer not found</h1>
            </div>
        );
    }

    return (
        <div className="container py-12">
            <article className="max-w-3xl mx-auto">
                {prayer.imageUrl && (
                    <div className="relative aspect-video rounded-lg overflow-hidden mb-8 shadow-lg">
                        <Image
                            src={prayer.imageUrl}
                            alt={prayer.title}
                            fill
                            className="object-cover"
                        />
                    </div>
                )}

                <header className="mb-8 text-center">
                    {prayer.category && (
                        <p className="text-sm font-semibold text-primary uppercase mb-2">
                            {prayer.category}
                        </p>
                    )}
                    <h1 className="text-4xl font-bold tracking-tight lg:text-5xl mb-4">
                        {prayer.title}
                    </h1>
                </header>

                <div className="prose prose-lg dark:prose-invert max-w-none mx-auto">
                    <PortableText value={prayer.content} />
                </div>
            </article>
        </div>
    );
}