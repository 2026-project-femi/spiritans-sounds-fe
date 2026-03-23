"use client";
import Image from "next/image";
import Link from "next/link";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

export default function AboutPage() {
	const heroSlides = [
		{
			image: { asset: { url: "/assets/about-hero-1.jpg" } },
			title: "About Spiritual Sound",
			description: "Journey with us through faith, music, and community.",
			ctaText: "Learn More",
			ctaLink: "/about#mission",
		},
		{
			image: { asset: { url: "/assets/team/about-hero-7.jpeg" } },
			title: "Our Mission",
			description: "Inspiring spiritual growth through meaningful content.",
			ctaText: "Discover Our Mission",
			ctaLink: "/about#mission",
		},
		{
			image: { asset: { url: "/assets/team/about-11.jpeg" } },
			title: "Our Mission",
			description: "Inspiring spiritual growth through meaningful content.",
			ctaText: "Discover Our Mission",
			ctaLink: "/about#mission",
		},
		{
			image: { asset: { url: "/assets/team/about-hero-4.jpeg" } },
			title: "Our Mission",
			description: "Inspiring spiritual growth through meaningful content.",
			ctaText: "Discover Our Mission",
			ctaLink: "/about#mission",
		},
	];
	return (
		<main className="pt-24 bg-background text-foreground">
			<Carousel
				opts={{ align: "start", loop: true }}
				plugins={[
					Autoplay({
						delay: 5000, // 5 seconds
						stopOnInteraction: false,
					}),
				]}
				className="max-w-400 mx-auto h-[80vh]">
				<CarouselContent>
					{heroSlides.map((slide, index) => (
						<CarouselItem key={index}>
							<div className="p-1">
								<div className="relative flex h-[80vh] items-center justify-center">
									<Image
										src={slide.image.asset.url}
										alt={slide.title}
										fill
										priority={index === 0}
										className="object-cover"
									/>
									<div className="absolute inset-0 flex items-center justify-center text-white text-center p-4 bg-black/60 bg-opacity-10">
										<div className="max-w-3xl">
											<h1 className="text-4xl md:text-6xl font-bold mb-4 drop-shadow-lg">
												{slide.title}
											</h1>
											<p className="text-lg md:text-xl text-gray-200 mb-8 drop-shadow">
												{slide.description}
											</p>
											{slide.ctaText && slide.ctaLink && (
												<Link
													href={slide.ctaLink}
													className="inline-block bg-white text-black px-8 py-4 font-semibold hover:bg-gray-200 transition-all duration-300 transform hover:scale-105 shadow-lg">
													{slide.ctaText}
												</Link>
											)}
										</div>
									</div>
								</div>
							</div>
						</CarouselItem>
					))}
				</CarouselContent>
				<CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-75 transition-all z-10" />
				<CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-75 transition-all z-10" />
			</Carousel>
			{/* ===============================
			   Hero Intro (Editorial Style)
			=============================== */}
			<section className="max-w-6xl mx-auto px-6 md:px-12 pt-12">
				<p className="text-xs tracking-[0.3em] uppercase text-brand-primary mb-6">Our Story</p>

				<h1 className="serif text-4xl md:text-6xl leading-tight mb-8">The Vision & The People</h1>

				<p className="text-lg text-muted-foreground max-w-2xl leading-relaxed">
					Spiritans Sound Outreach, founded on December 1st, 2018, by Rev. Fr. Oluwafemi Victor Orilua CSSp, operates as
					a dynamic arm of the youth apostolate within the Holy Ghost Fathers and Brothers, Province of Nigeria,
					Southwest.
				</p>
			</section>

			{/* ===============================
			   Mission Section
			=============================== */}
			<section id="mission" className="max-w-5xl mx-auto px-6 md:px-12 py-24 border-t border-border mt-24">
				<h2 className="serif text-3xl md:text-4xl mb-8">Our Mission and Vision</h2>

				<p className="text-lg leading-relaxed text-muted-foreground mb-6">
					At Spiritans Sound Outreach, our mission is twofold: to proclaim the message of faith and to nurture the
					creative talents of young individuals in the realms of music, art, and writing. We envision a community where
					spirituality and artistic expression harmoniously blend, inspiring our members to embody faith-driven
					leadership through their creative pursuits.
				</p>

				<p className="text-lg leading-relaxed text-muted-foreground">
					We envision a world where divine wisdom is accessible to all, fostering personal growth, peace, and collective
					harmony.
				</p>
			</section>

			{/* ===============================
			   Magazine Highlight (Split Layout)
			=============================== */}
			<section className="max-w-6xl mx-auto px-6 md:px-12 py-24 border-t border-border">
				<div className="grid md:grid-cols-2 gap-16 items-center">
					<div>
						<p className="text-xs tracking-[0.3em] uppercase text-brand-primary mb-4">Treasures Unveiler</p>
						<h2 className="serif text-3xl md:text-4xl mb-6">Our Magazine:</h2>
						<p className="text-lg text-muted-foreground leading-relaxed mb-8">
							“Treasures Unveiler” (TU) magazine, launched in December 2022, stands as a beacon for emerging
							artists, providing them with a platform to showcase their talents and offering indispensable
							resources for their development. With a primary focus on music, drama, arts, and crafts, TU
							magazine also serves as a conduit for news within the Spiritans Congregation, amplifying the
							voices and achievements of our outreach activities.
						</p>
						Beyond artistic expression, TU magazine engages in meaningful dialogue by featuring interviews with
						esteemed figures from both clergy and laity. These conversations not only highlight insights from
						within the Catholic Church but also explore perspectives on broader global issues, enriching our
						readers’ understanding of faith and society.
						<p className="text-lg text-muted-foreground leading-relaxed mb-8">
							Explore more about Spiritans Sound Outreach and discover the vibrant community of creative
							expression at{" "}
							<Link className="underline text-brand-primary" href={"unveiler"}>
								treasuresunveiler
							</Link>
						</p>
						<Link
							href="/unveiler/articles"
							className="inline-block border text-brand-primary px-8 py-3 text-sm uppercase tracking-widest text-brand-primary hover:bg-brand-primary hover:text-white transition-gentle">
							Explore the Journal
						</Link>
					</div>

					<div className="relative">
						<Image
							src="/assets/about-hero-2.jpg"
							alt="Magazine"
							width={600}
							height={750}
							className="object-cover"
						/>
					</div>
				</div>
			</section>

			{/* ===============================
			   Community Section
			=============================== */}
			<section className="max-w-4xl mx-auto px-6 md:px-12 py-24 border-t border-border text-center">
				<h2 className="serif text-3xl md:text-4xl mb-8">A Community of Devotion</h2>

				<p className="text-lg text-muted-foreground leading-relaxed mb-10">
					We are a fellowship of seekers — united not by noise, but by reflection. Through shared prayer, sacred music,
					and meaningful dialogue, we grow together.
				</p>

				<Link
					href="#subscribe"
					className="inline-block bg-brand-primary text-white px-10 py-4 text-sm uppercase tracking-widest hover:bg-brand-primary/90 transition-gentle">
					Become Part of the Journey
				</Link>
			</section>

			{/* ===============================
			   Team Section (Editorial Cards)
			=============================== */}
			<section className="max-w-6xl mx-auto px-6 md:px-12 py-24 border-t border-border">
				<h2 className="serif text-3xl md:text-4xl text-center mb-16">Those Who Guide the Vision</h2>

				<p className="text-lg text-muted-foreground leading-relaxed mb-8">
					Joining our community offers a transformative experience that goes beyond mere membership. It’s an opportunity
					to become part of a supportive and nurturing environment where your spiritual, emotional, and personal growth
					is prioritized. Here are some compelling reasons to join us:
				</p>

				<div className="grid md:grid-cols-3 gap-12">
					{[
						{
							name: "Rev. Fr. Femi Orilua CSSp",
							role: "Founder & Director", // No explicit role in filename
							image: "/assets/team/father-femi.jpeg",
						},
						{
							name: "Laura Nnana",
							role: "Secretary",
							image: "/assets/team/LauraNnana-secretary.jpeg",
						},
						{
							name: "Rev. Fr. Onyilo Willams",
							role: "Homilist & Columnist",
							image: "/assets/team/Rev Fr. Onyilo Willams- Homilist & Columnist.jpg",
						},
						{
							name: "Rev. Fr. Andrew Odeyemi",
							role: "Homilist & Columnist",
							image: "/assets/team/Rev-Fr-Andrew-Odeyemi-Homilist & columnist.jpg",
						},

						{
							name: "Rev. Fr. Jude Ekeshiri CSSp",
							role: "Homilist & Columnist",
							image: "/assets/team/Rev-Fr-Jude-Ekeshiri-CSSp-Homilist &Columnist.jpg",
						},
						{
							name: "Rev Sister Rosemary Etim, DHS",
							role: "Assistant Coordinator",
							image: "/assets/team/RevSr_Etim_Rosemary_DHS_Assistant_Coordinator.resized.jpeg",
						},
						{
							name: "Mr Martin Eichie",
							role: "Coordinator",
							image: "/assets/team/MrMart.jpeg",
						},
					].map((member) => (
						<div key={member.name} className="text-center">
							<Image
								src={member.image}
								alt={member.name}
								width={300}
								height={350}
								className="mx-auto mb-6 object-cover"
							/>

							<h3 className="serif text-xl mb-2">{member.name}</h3>

							<p className="text-sm uppercase tracking-widest text-brand-primary">{member.role}</p>
						</div>
					))}
				</div>
			</section>
		</main>
	);
}
