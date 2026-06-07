import Link from "next/link";
import { getPayload } from "payload";
import configPromise from "@/payload.config";
import React from "react";
import Image from "next/image";
import { HomeCarousel } from "@/components/HomeCarousel";
import Sidebar from "@/components/common/Sidebar";
import { HomeData, HomilyItem, LatestPostItem, MusicItem, PrayerItem } from "@/lib/types";
import { HomeFAQ } from "@/components/HomeFAQ";
import { getSidebarData } from "@/lib/payload";
import { getImageUrlFromResponse } from "@/lib/utils";

export const revalidate = 3600;

const HomePage: React.FC = async () => {
	const payload = await getPayload({ config: configPromise });
	const homeGlobal: any = await payload.findGlobal({ slug: "home" });

	const [articlesRes, homilyRes, prayersRes, musicRes] = await Promise.all([
		payload.find({ collection: "article", sort: "-publishedAt", limit: 3 }),
		payload.find({ collection: "homily", sort: "-date", limit: 3 }),
		payload.find({ collection: "prayer", sort: "-publishedAt", limit: 3 }),
		payload.find({ collection: "music", sort: "-publishedAt", limit: 3 }),
	]);

	const data: any = {
		...homeGlobal,
		carouselImages: homeGlobal.carouselImages?.map((img: any) => ({
			image: { asset: { url: img.image?.url } }
		})),
		latestPosts: articlesRes.docs.map((doc: any) => ({
			...doc, _id: doc.id, type: "article",
			imageUrl: getImageUrlFromResponse(doc)
		})),
		latestHomilies: homilyRes.docs.map((doc: any) => ({
			...doc, _id: doc.id, type: "homily",
			imageUrl: getImageUrlFromResponse(doc)
		})),
		latestPrayers: prayersRes.docs.map((doc: any) => ({
			...doc, _id: doc.id, type: "prayer",
			imageUrl: getImageUrlFromResponse(doc)
		})),
		latestMusic: musicRes.docs.map((doc: any) => ({
			...doc, _id: doc.id, type: "music",
			imageUrl: getImageUrlFromResponse(doc)
		}))
	};

	const sidebarData = await getSidebarData(); // Fetch sidebar data
	if (!data) return null;

	return (
		<main className="pt-32 pb-20">
			{/* Hero Section */}
			<section className="px-6 md:px-12 mb-10">
				<div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
					{/* Left Content - Static */}
					<div className="lg:col-span-7 space-y-8 animate-fadeIn">
						<span className="text-xs font-bold tracking-[0.4em] uppercase text-brand-primary">
							A Spiritual Journey
						</span>
						<h1 className="text-5xl md:text-7xl lg:text-8xl serif leading-[1.1] text-foreground">{data.title}</h1>
						<p className="text-lg md:text-xl font-light text-foreground max-w-xl leading-relaxed">
							{data.heroText}
						</p>
						{data?.ctaSection?.buttonLink && (
							<div className="pt-6">
								<Link
									href={data?.ctaSection.buttonLink}
									className="inline-block px-10 py-4 bg-brand-primary  duration-500 text-white text-xs tracking-widest uppercase font-semibold hover:bg-transparent hover:text-brand-primary hover:border transition-colors">
									{data.ctaSection.buttonText}
								</Link>
							</div>
						)}
					</div>

					{/* Right Content - Image Carousel */}
					<div className="lg:col-span-5 relative">
						{data.carouselImages && data.carouselImages.length > 0 && (
							<HomeCarousel images={data.carouselImages} />
						)}
						{/* Decorative element */}
						<div className="absolute -bottom-10 -left-10 w-40 h-40 border border-primary/30 hidden md:block"></div>
					</div>
				</div>
			</section>

			<div className="max-w-475 mx-auto px-6 md:px-12">
				<div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
					{/* Main Content Area */}
					<div className="lg:col-span-8">
						{/* Latest Reflections */}
						{data.latestPosts && data.latestPosts.length > 0 && (
							<section className="px-6 md:px-12 mb-10 bg-gray-50 py-16">
								<div className="max-w-7xl mx-auto">
									<div className="flex justify-between items-end mb-16 border-b border-foreground/10 pb-8">
										<h2 className="text-4xl serif tracking-tight">Latest Reflections</h2>
										<Link
											href="/articles"
											className="text-xs tracking-widest uppercase text-brand-primary font-bold hover:text-foreground transition-colors">
											View All
										</Link>
									</div>

									<div className="grid grid-cols-1 md:grid-cols-3 gap-12">
										{data.latestPosts.map((post: LatestPostItem) => (
											<Link
												href={`/${post.type === "homily" ? "homily" : "articles"}/${post.slug}`}
												key={post._id}
												className="group cursor-pointer">
												<div className="aspect-video mb-8 overflow-hidden bg-gray-100 relative">
													{post.imageUrl && (
														<Image
															src={post.imageUrl}
															alt={post.title}
															fill
															sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
															className="w-full h-full object-cover   opacity-80 hover:scale-105 transition-all"
														/>
													)}
													<div className="absolute top-4 left-4 bg-white px-3 py-1 text-[9px] font-bold tracking-widest uppercase text-brand-primary">
														{post.type === "homily"
															? post.category || "Homily"
															: "Article"}
													</div>
												</div>
												<span className="text-[10px] tracking-[0.2em] uppercase text-foreground mb-3 block">
													{post.date &&
													!isNaN(new Date(post.date).getTime())
														? new Date(
																post.date,
															).toLocaleDateString(
																"en-US",
																{
																	year: "numeric",
																	month: "long",
																	day: "numeric",
																},
															)
														: post.publishedAt &&
															  !isNaN(
																	new Date(
																		post.publishedAt,
																	).getTime(),
															  )
															? new Date(
																	post.publishedAt,
																).toLocaleDateString(
																	"en-US",
																	{
																		year: "numeric",
																		month: "long",
																		day: "numeric",
																	},
																)
															: ""}
												</span>
												<h3 className="text-2xl serif mb-4 group-hover:text-primary transition-colors leading-snug">
													{post.title}
												</h3>
												<p className="text-sm text-foreground leading-relaxed line-clamp-2">
													{post.excerpt}
												</p>
												<div className="mt-6 pt-6 border-t border-foreground/5 opacity-0 group-hover:opacity-100 transition-all">
													<span className="text-[10px] uppercase tracking-widest font-bold">
														Read More →
													</span>
												</div>
											</Link>
										))}
									</div>
								</div>
							</section>
						)}

						{/* LATEST HOMILIES */}
						{data.latestHomilies && data.latestHomilies.length > 0 && (
							<section className="px-6 md:px-12 mb-10 py-16">
								<div className="max-w-7xl mx-auto">
									<div className="flex justify-between items-end mb-16 border-b border-foreground/10 pb-8">
										<h2 className="text-4xl serif tracking-tight">Latest Homilies</h2>
										<Link
											href="/homilies"
											className="text-xs tracking-widest uppercase text-brand-primary font-bold hover:text-foreground transition-colors">
											View All
										</Link>
									</div>

									<div className="grid grid-cols-1 md:grid-cols-3 gap-12">
										{data.latestHomilies.map((homily: HomilyItem) => (
											<Link
												href={`/homilies/${homily.slug}`}
												key={homily._id}
												className="group cursor-pointer">
												<div className="aspect-video mb-8 overflow-hidden bg-gray-100 relative">
													{homily.imageUrl && (
														<Image
															src={homily.imageUrl}
															alt={homily.title}
															fill
															sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
															className="w-full h-full object-cover   opacity-80 hover:scale-105 transition-all"
														/>
													)}
													<div className="absolute top-4 left-4  bg-white px-3 py-1 text-[9px] font-bold tracking-widest uppercase text-brand-primary">
														Homily
													</div>
												</div>
												<span className="text-[10px] tracking-[0.2em] uppercase text-foreground mb-3 block">
													{new Date(homily.date).toLocaleDateString(
														"en-US",
														{
															year: "numeric",
															month: "long",
															day: "numeric",
														},
													)}
												</span>
												<h3 className="text-2xl serif mb-4 group-hover:text-primary transition-colors leading-snug">
													{homily.title}
												</h3>
												<p className="text-sm text-foreground leading-relaxed line-clamp-2">
													{homily.excerpt}
												</p>
												<div className="mt-6 pt-6 border-t border-foreground/5 opacity-0 group-hover:opacity-100 transition-all">
													<span className="text-[10px] uppercase tracking-widest font-bold">
														Read More →
													</span>
												</div>
											</Link>
										))}
									</div>
								</div>
							</section>
						)}

						{/* LATEST PRAYERS */}
						{data.latestPrayers && data.latestPrayers.length > 0 && (
							<section className="px-6 md:px-12 mb-10 bg-gray-50 py-16">
								<div className="max-w-7xl mx-auto">
									<div className="flex justify-between items-end mb-16 border-b border-foreground/10 pb-8">
										<h2 className="text-4xl serif tracking-tight">Latest Prayers</h2>
										<Link
											href="/prayers"
											className="text-xs tracking-widest uppercase text-brand-primary font-bold hover:text-foreground transition-colors">
											View All
										</Link>
									</div>

									<div className="grid grid-cols-1 md:grid-cols-3 gap-12">
										{data.latestPrayers.map((prayer: PrayerItem) => (
											<Link
												href={`/prayers/${prayer.slug}`}
												key={prayer._id}
												className="group cursor-pointer">
												<div className="aspect-video mb-8 overflow-hidden bg-gray-100 relative">
													{prayer.imageUrl && (
														<Image
															src={prayer.imageUrl}
															alt={prayer.title}
															fill
															sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
															className="w-full h-full object-cover   opacity-80 hover:scale-105 transition-all"
														/>
													)}
													<div className="absolute top-4 left-4 bg-white px-3 py-1 text-[9px] font-bold tracking-widest uppercase text-brand-primary">
														Prayer
													</div>
												</div>
												<span className="text-[10px] tracking-[0.2em] uppercase text-foreground mb-3 block">
													{prayer.category && `${prayer.category}`}
												</span>
												<h3 className="text-2xl serif mb-4 group-hover:text-primary transition-colors leading-snug">
													{prayer.title}
												</h3>
												<p className="text-sm text-foreground leading-relaxed line-clamp-2">
													{prayer.excerpt}
												</p>
												<div className="mt-6 pt-6 border-t border-foreground/5 opacity-0 group-hover:opacity-100 transition-all">
													<span className="text-[10px] uppercase tracking-widest font-bold">
														Read More →
													</span>
												</div>
											</Link>
										))}
									</div>
								</div>
							</section>
						)}

						{/* Music & Worship */}
						{data.latestMusic && data.latestMusic.length > 0 && (
							<section className="px-6 md:px-12 mb-10 py-16">
								<div className="max-w-7xl mx-auto">
									<div className="flex justify-between items-end mb-16 border-b border-foreground/10 pb-8">
										<h2 className="text-4xl serif tracking-tight">Music & Worship</h2>
										<Link
											href="/music"
											className="text-xs tracking-widest uppercase text-brand-primary font-bold hover:text-foreground transition-colors">
											View All
										</Link>
									</div>

									<div className="grid grid-cols-1 md:grid-cols-3 gap-12">
										{data.latestMusic.map((track: MusicItem) => (
											<Link
												href={`/music/${track.slug}`}
												key={track._id}
												className="group cursor-pointer">
												<div className="aspect-video mb-8 overflow-hidden bg-gray-100 relative">
													{track.imageUrl && (
														<Image
															src={track.imageUrl}
															alt={track.title}
															fill
															sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
															className="w-full h-full object-cover opacity-80 hover:scale-105 transition-all"
														/>
													)}
													<div className="absolute top-4 left-4 bg-white px-3 py-1 text-[9px] font-bold tracking-widest uppercase text-brand-primary">
														Music
													</div>
												</div>
												<h3 className="text-2xl serif mb-2 group-hover:text-primary transition-colors leading-snug">
													{track.title}
												</h3>
												{track.artist && (
													<p className="text-sm text-foreground/60 mb-3">By {track.artist}</p>
												)}
												{track.excerpt && (
													<p className="text-sm text-foreground leading-relaxed line-clamp-2">
														{track.excerpt}
													</p>
												)}
												<div className="mt-6 pt-6 border-t border-foreground/5 opacity-0 group-hover:opacity-100 transition-all">
													<span className="text-[10px] uppercase tracking-widest font-bold">
														Listen →
													</span>
												</div>
											</Link>
										))}
									</div>
								</div>
							</section>
						)}

						{/* Quote / Meditation Section */}
						<section className="px-6 md:px-12 py-32 bg-white relative overflow-hidden">
							<div className="absolute top-0 right-0 w-1/3 h-full bg-gray-100/30 transform skew-x-12 translate-x-1/2"></div>
							<div className="max-w-4xl mx-auto text-center relative z-10">
								<div className="mb-12 inline-block">
									<svg
										className="w-12 h-12 text-primary opacity-30 mx-auto"
										fill="currentColor"
										viewBox="0 0 24 24">
										<path d="M14.017 21L14.017 18C14.017 16.8954 14.9124 16 16.017 16H19.017V14C19.017 11.7909 17.2261 10 15.017 10H14.017V8H15.017C18.3307 8 21.017 10.6863 21.017 14V21H14.017ZM3.017 21L3.017 18C3.017 16.8954 3.91243 16 5.017 16H8.017V14C8.017 11.7909 6.2261 10 4.017 10H3.017V8H4.017C7.3307 8 10.017 10.6863 10.017 14V21H3.017Z" />
									</svg>
								</div>
								<p className="text-3xl md:text-5xl serif italic leading-relaxed text-foreground mb-12">
									&quot;Silence is the root of everything. If you spiral into its center, you
									will find the source of your light.&quot;
								</p>
								<span className="text-xs tracking-[0.4em] uppercase font-bold text-primary">
									— Thomas Merton
								</span>
							</div>
						</section>
					</div>
					{/* Sidebar Area */}
					<div className="lg:col-span-4">
						<div className="sticky top-32 z-20">
							<Sidebar categories={sidebarData.categories} recentPosts={sidebarData.recentPosts} />
						</div>
					</div>
				</div>
			</div>

		<HomeFAQ />
		</main>
	);
};

export default HomePage;
