import Link from "next/link";
import Image from "next/image";
import { client } from "@/sanity/lib/client";
import { PRAYERS_QUERY } from "@/sanity/lib/queries";

export const revalidate = 60;

interface Prayer {
    _id: string;
    title: string;
    slug: string;
    category?: string;
    imageUrl?: string;
    excerpt?: string;
}

export default async function PrayersPage() {
    const prayers: Prayer[] = await client.fetch(PRAYERS_QUERY);

    return (
        <div className="container py-12">
            <header className="text-center mb-12">
                <h1 className="text-4xl font-bold tracking-tight lg:text-5xl">
                    Prayers & Devotionals
                </h1>
                <p className="mt-4 text-lg text-muted-foreground">
                    Find solace and inspiration in our collection of prayers and devotionals.
                </p>
            </header>

            <main>
                {prayers.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {prayers.map((prayer) => (
                            <Link
                                href={`/prayers/${prayer.slug}`}
                                key={prayer._id}
                                className="block bg-white rounded-lg border shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 group"
                            >
                                <article>
                                    {prayer.imageUrl && (
                                        <div className="relative aspect-video rounded-t-lg overflow-hidden">
                                            <Image
                                                src={prayer.imageUrl}
                                                alt={prayer.title}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                    )}
                                    <div className="p-6">
                                        {prayer.category && (
                                            <p className="text-sm font-medium text-primary uppercase mb-2">
                                                {prayer.category}
                                            </p>
                                        )}
                                        <h2 className="text-xl font-semibold mb-2 group-hover:text-primary leading-snug">
                                            {prayer.title}
                                        </h2>
                                        {prayer.excerpt && (
                                            <p className="mt-4 text-base text-muted-foreground line-clamp-3">
                                                {prayer.excerpt}
                                            </p>
                                        )}
                                    </div>
                                </article>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <p className="text-center text-muted-foreground">No prayers found.</p>
                )}
            </main>
        </div>
    );
}