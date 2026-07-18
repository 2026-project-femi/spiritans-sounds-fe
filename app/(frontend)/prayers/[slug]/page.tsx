import Image from "next/image";
import { getPayload } from "payload";
import configPromise from "@/payload.config";
import RichText from '@/components/RichText';
import { Sidebar } from "@/components/common/Sidebar"; // Import the new Sidebar component
import { Prayer } from "@/lib/types";
import Comments from "@/components/Comments";
import type { Metadata } from "next";



export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
	const payload = await getPayload({ config: configPromise });
	const result = await payload.find({
		collection: "prayer",
		where: {
			and: [
				{ slug: { equals: slug } },
				{ _status: { equals: 'published' } }
			]
		},
		depth: 1,
	});
    const doc = result.docs[0];
    if (!doc) return {};
    const title = doc.title;
    const description = doc.excerpt || (doc.category ? `${doc.category} — Spiritans Sound` : "");
    const imageUrl = doc.featuredImage && typeof doc.featuredImage === 'object' ? doc.featuredImage.url : null;
    return {
        title,
        description,
        openGraph: {
            title,
            description,
            type: "article",
            images: imageUrl ? [{ url: imageUrl, width: 1200, height: 630, alt: title }] : [],
        },
        twitter: { card: "summary_large_image", title, description, images: imageUrl ? [imageUrl] : [] },
    };
}

export default async function SinglePrayerPage({ params }: { params: Promise<{ slug: string }> }) {
	const resolvedParams = await params;
	const payload = await getPayload({ config: configPromise });
	const result = await payload.find({
		collection: "prayer",
		where: {
			and: [
				{ slug: { equals: resolvedParams.slug } },
				{ _status: { equals: 'published' } }
			]
		},
	});
	const rawDoc = result.docs[0];
    
    let prayer: Prayer | null = null;
    if (rawDoc) {
        prayer = {
            ...rawDoc,
            _id: rawDoc.id,
            imageUrl: rawDoc.featuredImage && typeof rawDoc.featuredImage === 'object' ? rawDoc.featuredImage.url : undefined,
        } as Prayer;
    }

	if (!prayer) {
		return (
			<div className="container py-12 text-center">
				<h1 className="text-4xl font-bold">Prayer not found</h1>
				<p className="mt-4 text-lg text-muted-foreground">The requested prayer could not be found.</p>
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
								<h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight text-black mb-8">
									{prayer.title}
								</h1>
							</header>

							<div className="prose prose-lg dark:prose-invert max-w-none text-black space-y-8 font-light leading-loose text-lg">
								{prayer.content && <RichText data={prayer.content} />}
							</div>
						</div>
						<Comments postType="prayer" postId={prayer._id} comments={prayer.comments || []} />
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
