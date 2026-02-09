import Image from "next/image";
import { client } from "@/sanity/lib/client";
import { PRAYER_QUERY } from "@/sanity/lib/queries";
import { PortableText } from "@portabletext/react";
import { Sidebar } from "@/components/common/Sidebar"; // Import the new Sidebar component

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
                <p className="mt-4 text-lg text-muted-foreground">
                    The requested prayer could not be found.
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
                        {prayer.imageUrl && (
                            // Image Section
                            <div className="aspect-[16/9] mb-12 bg-gray-100 overflow-hidden rounded-lg">
                                <Image
                                    src={prayer.imageUrl}
                                    alt={prayer.title}
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
                                {prayer.category && (
                                    <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-primary bg-primary/5 px-3 py-1 border border-primary/10">
                                        {prayer.category}
                                    </span>
                                )}
                                <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight text-foreground mb-8">
                                    {prayer.title}
                                </h1>
                            </header>

                            <div className="prose prose-lg dark:prose-invert max-w-none text-foreground/80 space-y-8 font-light leading-loose text-lg">
                                <PortableText value={prayer.content} />
                            </div>
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