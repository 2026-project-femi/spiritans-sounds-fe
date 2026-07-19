import Link from "next/link";
import { getPayload } from "payload";
import configPromise from "@/payload.config";
import type { Metadata } from "next";
import LyricsOfLightClient from "./LyricsOfLightClient";

export const metadata: Metadata = {
	title: "Lyrics of Light Series",
	description: "Evangelising Through Music and Reflection. A soul-stirring series of songs composed and sung by Fr Oluwafemi Victor Orilua CSSp.",
	openGraph: {
		title: "Lyrics of Light Series | Spiritans Sound",
		description: "Evangelising Through Music and Reflection.",
		images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
	},
};

export default async function LyricsOfLightPage() {
	const payload = await getPayload({ config: configPromise });
	
	// Fetch published songs ordered by newest first
	const result = await payload.find({
		collection: "lyrics-of-light",
		where: { _status: { equals: 'published' } },
		sort: "-publishedAt",
		limit: 100, // adjust as needed
	});

	const songs = result.docs;

	return (
		<main className="min-h-screen bg-foreground selection:bg-brand-primary selection:text-white pb-24">
			
			{/* ── 1. Top Section (Hero) ────────────────────────────────────────── */}
			<section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden px-6">
				{/* Background Glows & Orbs for "Light" Aesthetic */}
				<div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-primary/20 rounded-full blur-[120px] pointer-events-none" />
				<div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-sacred-gold/10 rounded-full blur-[100px] pointer-events-none" />
				
				<div className="relative z-10 max-w-4xl mx-auto text-center mt-20">
					<span className="inline-block py-1 px-3 rounded-full border border-brand-primary/20 bg-brand-primary/10 backdrop-blur-md text-xs font-bold tracking-[0.3em] uppercase text-brand-primary mb-6">
						A Spiritans Sound Series
					</span>
					
					<h1 className="text-6xl md:text-8xl serif text-transparent bg-clip-text bg-linear-to-b from-white via-white/90 to-white/60 mb-6 drop-shadow-sm">
						Lyrics of Light
					</h1>
					
					<p className="text-xl md:text-2xl font-light text-white/70 mb-10 max-w-2xl mx-auto leading-relaxed">
						Evangelising Through Music and Reflection. A soul-stirring series offering melodies birthed in prayer, Scripture, and missionary encounters.
					</p>
					
					<div className="flex flex-col sm:flex-row items-center justify-center gap-4">
						<Link 
							href="#featured"
							className="w-full sm:w-auto px-8 py-4 bg-brand-primary text-white font-medium tracking-widest uppercase text-sm rounded-full hover:bg-brand-primary/90 transition-all duration-300 shadow-[0_0_20px_rgba(var(--brand-primary),0.3)] hover:shadow-[0_0_30px_rgba(var(--brand-primary),0.5)] transform hover:-translate-y-1"
						>
							Listen Now
						</Link>
					</div>
				</div>

				<div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-50 animate-bounce">
					<span className="text-[10px] tracking-widest uppercase text-white">Scroll</span>
					<div className="w-px h-12 bg-linear-to-b from-white to-transparent" />
				</div>
			</section>

			<LyricsOfLightClient songs={songs} />

			{/* ── 4. YouTube Section ────────────────────────────────────────── */}
			<section className="py-24 px-6 md:px-12 bg-black/20 border-t border-white/5">
				<div className="max-w-7xl mx-auto text-center">
					<span className="text-white/50 uppercase tracking-[0.2em] text-xs font-bold mb-4 block">Visual Journey</span>
					<h2 className="text-4xl serif text-white mb-12">Watch on YouTube</h2>
					
					{songs.filter((s: any) => s.youtubeLink).length > 0 ? (
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
							{songs.filter((s: any) => s.youtubeLink).slice(0, 6).map((song: any) => {
								const link = song.youtubeLink as string;
								const embedUrl = link.includes('watch?v=') 
									? link.replace('watch?v=', 'embed/') 
									: link.includes('youtu.be/') 
										? link.replace('youtu.be/', 'youtube.com/embed/') 
										: link;
								
								return (
									<div key={song.id} className="flex flex-col gap-4 text-left">
										<div className="aspect-video w-full rounded-2xl overflow-hidden border border-white/10 shadow-lg bg-black">
											<iframe 
												src={embedUrl} 
												className="w-full h-full"
												allowFullScreen
												allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
											/>
										</div>
										<h3 className="text-lg serif text-white px-2">{song.title}</h3>
									</div>
								);
							})}
						</div>
					) : (
						<div className="text-white/40 border border-white/10 rounded-2xl py-12 bg-white/5 max-w-2xl mx-auto">
							<p>Music videos coming soon.</p>
						</div>
					)}
				</div>
			</section>

			{/* ── 5. Support Section ────────────────────────────────────────── */}
			<section className="py-24 px-6">
				<div className="max-w-3xl mx-auto bg-linear-to-br from-brand-primary/20 to-transparent border border-brand-primary/30 rounded-3xl p-12 text-center backdrop-blur-md relative overflow-hidden">
					<div className="absolute inset-0 bg-[url('/assets/noise.png')] opacity-10 mix-blend-overlay pointer-events-none" />
					
					<div className="relative z-10">
						<h2 className="text-3xl serif text-white mb-6">Support the Mission</h2>
						<p className="text-white/70 font-light mb-10 leading-relaxed">
							Spiritans Sound Outreach is dedicated to spreading the Gospel through sacred music and reflections. Let it be known that such support is meant to fund the youth ministry of the outreach, helping us continue producing "Lyrics of Light" and other soul-stirring resources.
						</p>
						<Link 
							href="/donations"
							className="inline-block px-10 py-4 bg-white text-brand-primary font-bold tracking-widest uppercase text-sm rounded-full hover:bg-sacred-gold  transition-colors shadow-xl"
						>
							Support Us
						</Link>
					</div>
				</div>
			</section>

		</main>
	);
}
