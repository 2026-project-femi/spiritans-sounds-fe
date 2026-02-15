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
			ctaLink: "/about",
		},
		{
			image: { asset: { url: "/assets/about-hero-2.jpg" } },
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
									<div className="absolute inset-0 flex items-center justify-center text-white text-center p-4 bg-black/40 bg-opacity-40">
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
													className="inline-block rounded-full bg-white text-black px-8 py-4 font-semibold hover:bg-gray-200 transition-all duration-300 transform hover:scale-105 shadow-lg">
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

				<h1 className="serif text-4xl md:text-6xl leading-tight mb-8">
					A Sacred Journey of Faith, <br className="hidden md:block" />
					Sound & Reflection
				</h1>

				<p className="text-lg text-muted-foreground max-w-2xl leading-relaxed">
					Spiritans Sound exists as a digital sanctuary — a space where faith meets thoughtful reflection, sacred music,
					and meaningful community. We believe spirituality should not be distant, but lived — gently, daily, and
					intentionally.
				</p>
			</section>

			{/* ===============================
			   Mission Section
			=============================== */}
			<section id="mission" className="max-w-5xl mx-auto px-6 md:px-12 py-24 border-t border-border mt-24">
				<h2 className="serif text-3xl md:text-4xl mb-8">Our Mission</h2>

				<p className="text-lg leading-relaxed text-muted-foreground mb-6">
					To create a living archive of spiritual wisdom — where homilies, reflections, and sacred expression inspire
					deeper devotion and clarity of purpose.
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

						<h2 className="serif text-3xl md:text-4xl mb-6">A Journal of Reflection</h2>

						<p className="text-lg text-muted-foreground leading-relaxed mb-8">
							More than a magazine — Treasures Unveiler explores theological insight, lived experience, and
							spiritual discovery in contemporary life.
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
					href="/join-us"
					className="inline-block bg-brand-primary text-white px-10 py-4 text-sm uppercase tracking-widest hover:bg-brand-primary/90 transition-gentle">
					Become Part of the Journey
				</Link>
			</section>

			{/* ===============================
			   Team Section (Editorial Cards)
			=============================== */}
			<section className="max-w-6xl mx-auto px-6 md:px-12 py-24 border-t border-border">
				<h2 className="serif text-3xl md:text-4xl text-center mb-16">Those Who Guide the Vision</h2>

				<div className="grid md:grid-cols-3 gap-12">
					{[
						{
							name: "Rev. John Doe",
							role: "Founder & Lead Pastor",
							image: "/assets/team-member-1.webp",
						},
						{
							name: "Jane Smith",
							role: "Community Outreach",
							image: "/assets/team-member-2.webp",
						},
						{
							name: "Dr. Alex Lee",
							role: "Theological Advisor",
							image: "/assets/team-member-3.webp",
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
