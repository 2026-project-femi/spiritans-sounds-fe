import Image from "next/image";
import { client } from "@/sanity/lib/client";
import { EVENT_QUERY } from "@/sanity/lib/queries";

export const revalidate = 60;

interface Event {
    _id: string;
    title: string;
    slug: string;
    date: string;
    location?: string;
    description?: string;
    imageUrl?: string;
}

interface PageProps {
    params: {
        slug: string;
    };
}

export default async function SingleEventPage({ params }: { params: Promise<{ slug: string }> }) {
    const resolvedParams = await params;
    const event: Event = await client.fetch(EVENT_QUERY, { slug: resolvedParams.slug });

    if (!event) {
        return (
            <div className="container py-12 text-center">
                <h1 className="text-4xl font-bold">Event not found</h1>
            </div>
        );
    }

    return (
        <div className="container py-12">
            <article className="max-w-3xl mx-auto">
                {event.imageUrl && (
                    <div className="relative aspect-video rounded-lg overflow-hidden mb-8 shadow-lg">
                        <Image
                            src={event.imageUrl}
                            alt={event.title}
                            fill
                            className="object-cover"
                        />
                    </div>
                )}

                <header className="mb-8 text-center">
                    <h1 className="text-4xl font-bold tracking-tight lg:text-5xl mb-4">
                        {event.title}
                    </h1>
                    <div className="mt-4 text-sm text-muted-foreground flex justify-center items-center gap-4">
                        {event.date && (
                            <p>
                                {new Date(event.date).toLocaleDateString("en-US", {
                                    year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric'
                                })}
                            </p>
                        )}
                        {event.location && (
                            <>
                                <span>&bull;</span>
                                <p>{event.location}</p>
                            </>
                        )}
                    </div>
                </header>

                {event.description && (
                    <div className="prose prose-lg dark:prose-invert max-w-none mx-auto">
                        <p>{event.description}</p>
                    </div>
                )}
            </article>
        </div>
    );
}