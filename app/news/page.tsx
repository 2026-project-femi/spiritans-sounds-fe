import Link from "next/link";
import Image from "next/image";
import { client } from "@/sanity/lib/client";
import { EVENTS_QUERY } from "@/sanity/lib/queries";

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

export default async function EventsPage() {
    const events: Event[] = await client.fetch(EVENTS_QUERY);

    return (
        <div className="container py-12">
            <header className="text-center mb-12">
                <h1 className="text-4xl font-bold tracking-tight lg:text-5xl">
                    News & Events
                </h1>
                <p className="mt-4 text-lg text-muted-foreground">
                    Stay updated with our latest news and upcoming events.
                </p>
            </header>

            <main>
                {events.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {events.map((event) => (
                            <Link
                                href={`/news/${event.slug}`}
                                key={event._id}
                                className="block bg-white rounded-lg border shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 group"
                            >
                                <article>
                                    {event.imageUrl && (
                                        <div className="relative aspect-video rounded-t-lg overflow-hidden">
                                            <Image
                                                src={event.imageUrl}
                                                alt={event.title}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                    )}
                                    <div className="p-6">
                                        <h2 className="text-xl font-semibold mb-2 group-hover:text-primary leading-snug">
                                            {event.title}
                                        </h2>
                                        {event.date && (
                                            <p className="text-sm text-muted-foreground mb-1">
                                                {new Date(event.date).toLocaleDateString("en-US", {
                                                    year: 'numeric', month: 'long', day: 'numeric'
                                                })}
                                            </p>
                                        )}
                                        {event.location && (
                                            <p className="text-sm text-muted-foreground mb-4">
                                                {event.location}
                                            </p>
                                        )}
                                        {event.description && (
                                            <p className="mt-4 text-base text-muted-foreground line-clamp-3">
                                                {event.description}
                                            </p>
                                        )}
                                    </div>
                                </article>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <p className="text-center text-muted-foreground">No events found.</p>
                )}
            </main>
        </div>
    );
}