import Image from "next/image";
import { client } from "@/sanity/lib/client";
import { PAGE_QUERY } from "@/sanity/lib/queries";
import { PortableText } from "@portabletext/react";

export const revalidate = 60;

interface PageData {
    title: string;
    content: any; // PortableText
    image?: {
        asset: {
            url: string;
        };
    };
}

export default async function AboutPage() {
    const data: PageData = await client.fetch(PAGE_QUERY, { slug: "about" });

    if (!data) {
        return (
            <div className="container py-12 text-center">
                <h1 className="text-4xl font-bold">About Page Content Not Found</h1>
                <p className="mt-4 text-lg text-muted-foreground">
                    Please create an "About" page document in Sanity with the slug "about".
                </p>
            </div>
        );
    }

    return (
        <div className="container py-12">
            <article className="max-w-3xl mx-auto">
                <header className="mb-8 text-center">
                    <h1 className="text-4xl font-bold tracking-tight lg:text-5xl mb-4">
                        {data.title}
                    </h1>
                </header>

                {data.image && (
                    <div className="relative aspect-video rounded-lg overflow-hidden mb-8 shadow-lg">
                        <Image
                            src={data.image.asset.url}
                            alt={data.title}
                            fill
                            className="object-cover"
                        />
                    </div>
                )}

                <div className="prose prose-lg dark:prose-invert max-w-none mx-auto">
                    <PortableText value={data.content} />
                </div>
            </article>
        </div>
    );
}
