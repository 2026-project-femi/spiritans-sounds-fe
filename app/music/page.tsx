import Link from "next/link";
import Image from "next/image";
import { client } from "@/sanity/lib/client";
import { MUSIC_QUERY } from "@/sanity/lib/queries";

export const revalidate = 60;

interface Music {
    _id: string;
    title: string;
    slug: string;
    artist: string;
    imageUrl?: string;
    excerpt?: string;
}

export default async function MusicPage() {
    const musicItems: Music[] = await client.fetch(MUSIC_QUERY);

    return (
        <div className="container py-12">
            <header className="text-center mb-12">
                <h1 className="text-4xl font-bold tracking-tight lg:text-5xl">
                    Music & Worship
                </h1>
                <p className="mt-4 text-lg text-muted-foreground">
                    Explore our collection of worship music and songs.
                </p>
            </header>

            <main>
                {musicItems.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {musicItems.map((music) => (
                            <Link
                                href={`/music/${music.slug}`}
                                key={music._id}
                                className="block bg-white rounded-lg border shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 group"
                            >
                                <article>
                                    {music.imageUrl && (
                                        <div className="relative aspect-video rounded-t-lg overflow-hidden">
                                            <Image
                                                src={music.imageUrl}
                                                alt={music.title}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                    )}
                                    <div className="p-6">
                                        <h2 className="text-xl font-semibold mb-2 group-hover:text-primary leading-snug">
                                            {music.title}
                                        </h2>
                                        {music.artist && (
                                            <p className="text-sm text-muted-foreground mb-1">By {music.artist}</p>
                                        )}
                                        {music.excerpt && (
                                            <p className="mt-4 text-base text-muted-foreground line-clamp-3">
                                                {music.excerpt}
                                            </p>
                                        )}
                                    </div>
                                </article>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <p className="text-center text-muted-foreground">No music found.</p>
                )}
            </main>
        </div>
    );
}