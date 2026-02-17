import Image from "next/image";
import { client } from "@/sanity/lib/client";
import { EVENT_QUERY } from "@/sanity/lib/queries";
import { Sidebar } from "@/components/common/Sidebar"; // Import the new Sidebar component
import { EventItem } from "@/lib/types";

export const revalidate = 60;

export default async function SingleEventPage({ params }: { params: Promise<{ slug: string }> }) {
	const resolvedParams = await params;
	const event: EventItem = await client.fetch(EVENT_QUERY, { slug: resolvedParams.slug });

	if (!event) {
		return (
			<div className="container py-12 text-center">
				<h1 className="text-4xl font-bold">Event not found</h1>
				<p className="mt-4 text-lg text-muted-foreground">The requested event could not be found.</p>
			</div>
		);
	}

	return (
		<main className="pt-32 pb-20">
			<div className="max-w-7xl mx-auto px-6 md:px-12">
				<div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
					{/* Main Content Area */}
					<article className="lg:col-span-8 relative z-0">
						{event.imageUrl && (
							// Image Section
							<div className="aspect-[16/9] mb-12 bg-gray-100 overflow-hidden rounded-lg">
								<Image
									src={event.imageUrl}
									alt={event.title}
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
								<div className="flex items-center justify-center space-x-4 mb-6">
									{event.date && (
										<p className="text-sm text-muted-foreground">
											{new Date(event.date).toLocaleDateString("en-US", {
												year: "numeric",
												month: "long",
												day: "numeric",
												hour: "numeric",
												minute: "numeric",
											})}
										</p>
									)}
								</div>
								<h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight text-black mb-8">
									{event.title}
								</h1>
								<div className="flex items-center space-x-4 pb-8 border-b border-gray-200 justify-center">
									{event.location && (
										<p className="text-sm text-muted-foreground">{event.location}</p>
									)}
								</div>
							</header>

							{event?.description && (
								<div className="prose prose-lg dark:prose-invert max-w-none text-black space-y-8 font-light leading-loose text-lg">
									<p>{event.description}</p>
								</div>
							)}
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
