// app/page.tsx
import Image from "next/image";
import Link from "next/link";
import { PortableText } from "@portabletext/react";
import { HOME_QUERY } from "@/sanity/lib/queries";
import { client } from "@/sanity/lib/client";

export const revalidate = 60;

interface BasicItem {
    _id: string;
    title: string;
    slug: string;
    imageUrl?: string;
    excerpt?: string;
}

interface HomilyItem extends BasicItem {
    date: string;
    scripture: string;
    category: string;
}

interface ArticleItem extends BasicItem {
    author: string;
    publishedAt: string;
}

interface EventItem extends BasicItem {
    date: string;
    location: string;
}

interface PrayerItem extends BasicItem {
    category: string;
}

interface MusicItem extends BasicItem {
    artist: string;
}

interface HomeData {
	title: string;
	heroText: string;
	heroImage: { asset: { url: string } };
	ctaText: string;
	aboutText: any; // PortableText
	aboutImage: { asset: { url: string } };
	ctaSection: {
		title: string;
		description: string;
		buttonText: string;
		buttonLink: string;
	};
    latestHomilies: HomilyItem[];
    latestArticles: ArticleItem[];
    latestEvents: EventItem[];
    latestPrayers: PrayerItem[];
    latestMusic: MusicItem[];
}

export default async function HomePage() {
	const data: HomeData = await client.fetch(HOME_QUERY);

	if (!data) return null;

	return (
		<main className="min-h-screen">
			{/* HERO */}
			<section className="relative h-[80vh] flex items-center justify-center text-white overflow-hidden">
				{data.heroImage && (
					<Image
						src={data.heroImage.asset.url}
						alt={data.title}
						fill
						priority
						className="object-cover brightness-50 transform scale-105 transition-transform duration-1000 ease-in-out"
					/>
				)}

				<div className="relative z-10 max-w-4xl text-center px-6 py-12 bg-black bg-opacity-40 rounded-xl backdrop-blur-sm">
					<h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight drop-shadow-lg">
						{data.title}
					</h1>
					<p className="text-xl md:text-2xl text-gray-200 mb-10 font-light leading-relaxed">
						{data.heroText}
					</p>
					{data.ctaText && (
						<Link
							href="/homilies"
							className="inline-block rounded-full bg-white text-black px-10 py-5 text-lg font-semibold hover:bg-gray-200 transition-all duration-300 transform hover:scale-105 shadow-lg"
						>
							{data.ctaText}
						</Link>
					)}
				</div>
			</section>

            {/* LATEST HOMILIES */}
            {data.latestHomilies && data.latestHomilies.length > 0 && (
                <section className="py-20 px-6 max-w-7xl mx-auto">
                    <h2 className="text-4xl font-bold text-center mb-16 text-gray-800">Latest Homilies</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {data.latestHomilies.map((item) => (
                            <Link
                                href={`/homilies/${item.slug}`}
                                key={item._id}
                                className="block bg-white rounded-lg border shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 group"
                            >
                                <article>
                                    {item.imageUrl && (
                                        <div className="relative aspect-video rounded-t-lg overflow-hidden">
                                            <Image src={item.imageUrl} alt={item.title} fill className="object-cover" />
                                        </div>
                                    )}
                                    <div className="p-6">
                                        {item.category && (
                                            <p className="text-sm font-medium text-primary uppercase mb-2">
                                                {item.category}
                                            </p>
                                        )}
                                        <h3 className="text-2xl font-semibold mb-2 group-hover:text-primary leading-snug">
                                            {item.title}
                                        </h3>
                                        {item.scripture && (
                                            <p className="text-sm text-muted-foreground mb-4">
                                                {item.scripture}
                                            </p>
                                        )}
                                        <p className="text-sm text-muted-foreground">
                                            {new Date(item.date).toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' })}
                                        </p>
                                        {item.excerpt && (
                                            <p className="mt-4 text-base text-muted-foreground line-clamp-3">
                                                {item.excerpt}
                                            </p>
                                        )}
                                    </div>
                                </article>
                            </Link>
                        ))}
                    </div>
                    <div className="text-center mt-16">
                        <Link href="/homilies" className="inline-block text-lg font-semibold text-primary hover:text-primary-foreground transition-colors duration-300">
                            View All Homilies &rarr;
                        </Link>
                    </div>
                </section>
            )}

            {/* LATEST ARTICLES */}
            {data.latestArticles && data.latestArticles.length > 0 && (
                <section className="bg-gray-50 py-20 px-6 max-w-7xl mx-auto">
                    <h2 className="text-4xl font-bold text-center mb-16 text-gray-800">Latest Articles</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {data.latestArticles.map((item) => (
                            <Link
                                href={`/articles/${item.slug}`}
                                key={item._id}
                                className="block bg-white rounded-lg border shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 group"
                            >
                                <article>
                                    {item.imageUrl && (
                                        <div className="relative aspect-video rounded-t-lg overflow-hidden">
                                            <Image src={item.imageUrl} alt={item.title} fill className="object-cover" />
                                        </div>
                                    )}
                                    <div className="p-6">
                                        <h3 className="text-2xl font-semibold mb-2 group-hover:text-primary leading-snug">
                                            {item.title}
                                        </h3>
                                        {item.author && (
                                            <p className="text-sm text-muted-foreground mb-1">By {item.author}</p>
                                        )}
                                        <p className="text-sm text-muted-foreground">
                                            Published on {new Date(item.publishedAt).toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' })}
                                        </p>
                                        {item.excerpt && (
                                            <p className="mt-4 text-base text-muted-foreground line-clamp-3">
                                                {item.excerpt}
                                            </p>
                                        )}
                                    </div>
                                </article>
                            </Link>
                        ))}
                    </div>
                    <div className="text-center mt-16">
                        <Link href="/articles" className="inline-block text-lg font-semibold text-primary hover:text-primary-foreground transition-colors duration-300">
                            View All Articles &rarr;
                        </Link>
                    </div>
                </section>
            )}

            {/* LATEST EVENTS */}
            {data.latestEvents && data.latestEvents.length > 0 && (
                <section className="py-20 px-6 max-w-7xl mx-auto">
                    <h2 className="text-4xl font-bold text-center mb-16 text-gray-800">Upcoming Events</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {data.latestEvents.map((item) => (
                            <Link
                                href={`/news/${item.slug}`}
                                key={item._id}
                                className="block bg-white rounded-lg border shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 group"
                            >
                                <article>
                                    {item.imageUrl && (
                                        <div className="relative aspect-video rounded-t-lg overflow-hidden">
                                            <Image src={item.imageUrl} alt={item.title} fill className="object-cover" />
                                        </div>
                                    )}
                                    <div className="p-6">
                                        <h3 className="text-2xl font-semibold mb-2 group-hover:text-primary leading-snug">
                                            {item.title}
                                        </h3>
                                        {item.date && (
                                            <p className="text-sm text-muted-foreground mb-1">
                                                {new Date(item.date).toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' })}
                                            </p>
                                        )}
                                        {item.location && (
                                            <p className="text-sm text-muted-foreground mb-4">
                                                {item.location}
                                            </p>
                                        )}
                                        {item.excerpt && (
                                            <p className="mt-4 text-base text-muted-foreground line-clamp-3">
                                                {item.excerpt}
                                            </p>
                                        )}
                                    </div>
                                </article>
                            </Link>
                        ))}
                    </div>
                    <div className="text-center mt-16">
                        <Link href="/news" className="inline-block text-lg font-semibold text-primary hover:text-primary-foreground transition-colors duration-300">
                            View All Events &rarr;
                        </Link>
                    </div>
                </section>
            )}

            {/* LATEST PRAYERS */}
            {data.latestPrayers && data.latestPrayers.length > 0 && (
                <section className="bg-gray-50 py-20 px-6 max-w-7xl mx-auto">
                    <h2 className="text-4xl font-bold text-center mb-16 text-gray-800">Latest Prayers</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {data.latestPrayers.map((item) => (
                            <Link
                                href={`/prayers/${item.slug}`}
                                key={item._id}
                                className="block bg-white rounded-lg border shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 group"
                            >
                                <article>
                                    {item.imageUrl && (
                                        <div className="relative aspect-video rounded-t-lg overflow-hidden">
                                            <Image src={item.imageUrl} alt={item.title} fill className="object-cover" />
                                        </div>
                                    )}
                                    <div className="p-6">
                                        {item.category && (
                                            <p className="text-sm font-medium text-primary uppercase mb-2">
                                                {item.category}
                                            </p>
                                        )}
                                        <h3 className="text-2xl font-semibold mb-2 group-hover:text-primary leading-snug">
                                            {item.title}
                                        </h3>
                                        {item.excerpt && (
                                            <p className="mt-4 text-base text-muted-foreground line-clamp-3">
                                                {item.excerpt}
                                            </p>
                                        )}
                                    </div>
                                </article>
                            </Link>
                        ))}
                    </div>
                    <div className="text-center mt-16">
                        <Link href="/prayers" className="inline-block text-lg font-semibold text-primary hover:text-primary-foreground transition-colors duration-300">
                            View All Prayers &rarr;
                        </Link>
                    </div>
                </section>
            )}

            {/* LATEST MUSIC */}
            {data.latestMusic && data.latestMusic.length > 0 && (
                <section className="py-20 px-6 max-w-7xl mx-auto">
                    <h2 className="text-4xl font-bold text-center mb-16 text-gray-800">Latest Music & Worship</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {data.latestMusic.map((item) => (
                            <Link
                                href={`/music/${item.slug}`}
                                key={item._id}
                                className="block bg-white rounded-lg border shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 group"
                            >
                                <article>
                                    {item.imageUrl && (
                                        <div className="relative aspect-video rounded-t-lg overflow-hidden">
                                            <Image src={item.imageUrl} alt={item.title} fill className="object-cover" />
                                        </div>
                                    )}
                                    <div className="p-6">
                                        {item.artist && (
                                            <p className="text-sm text-muted-foreground mb-1">By {item.artist}</p>
                                        )}
                                        <h3 className="text-2xl font-semibold mb-2 group-hover:text-primary leading-snug">
                                            {item.title}
                                        </h3>
                                        {item.excerpt && (
                                            <p className="mt-4 text-base text-muted-foreground line-clamp-3">
                                                {item.excerpt}
                                            </p>
                                        )}
                                    </div>
                                </article>
                            </Link>
                        ))}
                    </div>
                    <div className="text-center mt-16">
                        <Link href="/music" className="inline-block text-lg font-semibold text-primary hover:text-primary-foreground transition-colors duration-300">
                            View All Music &rarr;
                        </Link>
                    </div>
                </section>
            )}


			{/* ABOUT SECTION */}
			{data.aboutText && (
				<section className="bg-gray-50 py-20 px-6">
					<div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
						<div className={data.aboutImage ? "lg:order-2" : ""}>
							<h2 className="text-4xl font-bold mb-8 text-gray-800">Our Mission</h2>
							<div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
								<PortableText value={data.aboutText} />
							</div>
						</div>
						{data.aboutImage && (
							<div className="lg:order-1 relative rounded-2xl overflow-hidden shadow-xl h-96 w-full">
								<Image
									src={data.aboutImage.asset.url}
									alt="About Us"
									fill
									className="object-cover"
								/>
							</div>
						)}
					</div>
				</section>
			)}

			{/* CTA SECTION */}
			{data.ctaSection && (
				<section className="bg-indigo-700 text-white py-20 px-6">
					<div className="max-w-4xl mx-auto text-center">
						<h2 className="text-4xl font-bold mb-6">{data.ctaSection.title}</h2>
						<p className="text-xl text-indigo-100 mb-10 leading-relaxed">
							{data.ctaSection.description}
						</p>
						<Link
							href={data.ctaSection.buttonLink}
							className="inline-block rounded-full bg-white text-indigo-700 px-10 py-5 text-lg font-semibold hover:bg-gray-200 transition-all duration-300 transform hover:scale-105 shadow-lg"
						>
							{data.ctaSection.buttonText}
						</Link>
					</div>
				</section>
			)}
		</main>
	);
}