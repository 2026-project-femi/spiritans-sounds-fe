import Link from "next/link";
import Image from "next/image";
import { getPayload } from "payload";
import configPromise from "@/payload.config";
import type { Metadata } from "next";

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
	const featuredSong = songs.length > 0 ? songs[0] : null;
	const librarySongs = songs.length > 1 ? songs.slice(1) : [];

	return (
		<main className="min-h-screen bg-foreground selection:bg-brand-primary selection:text-white pb-24">
			
			{/* ── 1. Top Section (Hero) ────────────────────────────────────────── */}
			<section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden px-6">
				{/* Background Glows & Orbs for "Light" Aesthetic */}
				<div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-primary/20 rounded-full blur-[120px] pointer-events-none" />
				<div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-sacred-gold/10 rounded-full blur-[100px] pointer-events-none" />
				
				<div className="relative z-10 max-w-4xl mx-auto text-center mt-20">
					<span className="inline-block py-1 px-3 rounded-full border border-white/10 bg-white/5 backdrop-blur-md text-xs font-bold tracking-[0.3em] uppercase text-sacred-ivory mb-6">
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
						<Link 
							href="#library"
							className="w-full sm:w-auto px-8 py-4 bg-white/10 backdrop-blur-md text-white font-medium tracking-widest uppercase text-sm rounded-full border border-white/20 hover:bg-white/20 transition-all duration-300 transform hover:-translate-y-1"
						>
							Get Booklet
						</Link>
					</div>
				</div>

				{/* Scroll indicator */}
				<div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-50 animate-bounce">
					<span className="text-[10px] tracking-widest uppercase text-white">Scroll</span>
					<div className="w-px h-12 bg-linear-to-b from-white to-transparent" />
				</div>
			</section>

			{/* ── 2. Featured Song Section ────────────────────────────────────────── */}
			<section id="featured" className="py-24 px-6 md:px-12">
				<div className="max-w-6xl mx-auto">
					<div className="mb-16 flex items-center gap-4">
						<div className="w-12 h-px bg-brand-primary" />
						<h2 className="text-3xl serif text-white tracking-wider">Latest Release</h2>
					</div>
					
					{featuredSong ? (
						<div className="bg-white/5 border border-white/10 rounded-3xl p-8 md:p-12 backdrop-blur-xl shadow-2xl relative overflow-hidden">
							{/* Subtle background element inside card */}
							<div className="absolute -top-24 -right-24 w-64 h-64 bg-brand-primary/10 rounded-full blur-3xl pointer-events-none" />
							
							<div className="grid grid-cols-1 lg:grid-cols-2 gap-12 relative z-10">
								{/* Left: Media Player / Video */}
								<div className="space-y-8">
									<div>
										<h3 className="text-4xl serif text-white mb-2">{featuredSong.title}</h3>
										<p className="text-brand-primary/80 uppercase tracking-widest text-sm font-semibold">Volume {(songs.length).toString().padStart(2, '0')}</p>
									</div>

									{/* YouTube Embed */}
									{featuredSong.youtubeLink && (
										<div className="aspect-video w-full rounded-2xl overflow-hidden border border-white/10 shadow-lg relative group bg-black">
											{featuredSong.youtubeLink.includes('youtube.com') || featuredSong.youtubeLink.includes('youtu.be') ? (
												<iframe 
													src={featuredSong.youtubeLink.replace('watch?v=', 'embed/').replace('youtu.be/', 'youtube.com/embed/')} 
													className="w-full h-full"
													allowFullScreen
													allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
												/>
											) : (
												<div className="absolute inset-0 flex items-center justify-center text-white/50 text-sm">
													Invalid Video Link
												</div>
											)}
										</div>
									)}

									{/* Audio Player & Download */}
									{featuredSong.audio && typeof featuredSong.audio === 'object' && (
										<div className="bg-white/10 rounded-2xl p-6 flex flex-col gap-4 border border-white/5">
											<audio controls className="w-full h-10 outline-none [&::-webkit-media-controls-panel]:bg-white/90">
												<source src={featuredSong.audio.url!} type={featuredSong.audio.mimeType!} />
												Your browser does not support the audio element.
											</audio>
											<div className="flex justify-end mt-2">
												<a 
													href={featuredSong.audio.url!} 
													download
													className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-white/70 hover:text-white transition-colors group"
												>
													<svg className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
													Download MP3
												</a>
											</div>
										</div>
									)}
								</div>

								{/* Right: Booklet Info */}
								<div className="flex flex-col justify-center">
									<div className="bg-black/20 rounded-3xl p-8 border border-white/5 flex flex-col items-center text-center">
										<span className="text-sacred-gold uppercase tracking-[0.2em] text-xs font-bold mb-6">Companion Booklet</span>
										
										{featuredSong.bookletImage && typeof featuredSong.bookletImage === 'object' ? (
											<div className="w-48 h-64 relative rounded-lg overflow-hidden shadow-2xl mb-8 transform -rotate-2 hover:rotate-0 transition-transform duration-500">
												<Image 
													src={featuredSong.bookletImage.url!} 
													alt={featuredSong.bookletTitle || "Booklet Cover"} 
													fill 
													className="object-cover"
												/>
											</div>
										) : (
											<div className="w-48 h-64 bg-white/5 rounded-lg flex items-center justify-center mb-8 border border-white/10">
												<span className="text-white/20 text-sm">No Image</span>
											</div>
										)}

										<h4 className="text-2xl serif text-white mb-4">{featuredSong.bookletTitle || featuredSong.title}</h4>
										
										{featuredSong.bookletDescription && (
											<p className="text-white/60 text-sm leading-relaxed mb-8 max-w-sm">
												{featuredSong.bookletDescription}
											</p>
										)}

										{featuredSong.bookletBuyLink && (
											<Link 
												href={featuredSong.bookletBuyLink}
												className="px-8 py-3 bg-white text-black font-semibold tracking-widest uppercase text-xs rounded-full hover:bg-sacred-gold hover:text-white transition-colors duration-300"
											>
												Request Copy
											</Link>
										)}
									</div>
								</div>
							</div>
						</div>
					) : (
						<div className="text-center text-white/50 py-20 border border-white/10 rounded-2xl bg-white/5">
							New releases coming soon.
						</div>
					)}
				</div>
			</section>

			{/* ── 3. Songs List (Library) ────────────────────────────────────────── */}
			<section id="library" className="py-24 px-6 md:px-12 bg-black/30 border-y border-white/5 relative">
				<div className="max-w-7xl mx-auto relative z-10">
					<div className="mb-16 flex flex-col items-center text-center">
						<span className="text-brand-primary uppercase tracking-[0.3em] text-xs font-bold mb-4">The Collection</span>
						<h2 className="text-4xl serif text-white">Volumes of Light</h2>
					</div>
					
					{librarySongs.length > 0 ? (
						<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
							{librarySongs.map((song: any) => (
								<div key={song.id} className="group relative bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-colors duration-300 overflow-hidden flex flex-col">
									{/* Background Hover Effect */}
									<div className="absolute inset-0 bg-linear-to-b from-brand-primary/0 to-brand-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
									
									<div className="relative z-10 flex gap-4 items-start mb-6">
										{/* Small Thumbnail */}
										{song.bookletImage && typeof song.bookletImage === 'object' ? (
											<div className="w-20 h-20 shrink-0 rounded-lg overflow-hidden relative shadow-lg">
												<Image src={song.bookletImage.url} alt={song.title} fill className="object-cover" />
											</div>
										) : (
											<div className="w-20 h-20 shrink-0 bg-white/10 rounded-lg" />
										)}
										
										<div>
											<h3 className="text-xl serif text-white mb-1">{song.title}</h3>
											<p className="text-white/50 text-xs uppercase tracking-widest">
												{song.bookletTitle ? `Booklet: ${song.bookletTitle}` : "Volume"}
											</p>
										</div>
									</div>

									{/* Audio Player */}
									{song.audio && typeof song.audio === 'object' && (
										<div className="mb-6">
											<audio controls className="w-full h-8 outline-none [&::-webkit-media-controls-panel]:bg-white/80 [&::-webkit-media-controls-panel]:scale-90">
												<source src={song.audio.url} type={song.audio.mimeType} />
											</audio>
										</div>
									)}

									<div className="mt-auto pt-6 border-t border-white/10 flex flex-wrap gap-2 items-center justify-between">
										<div className="flex gap-2">
											{song.audio && typeof song.audio === 'object' && (
												<a 
													href={song.audio.url} 
													download
													className="p-2 rounded-full bg-white/5 text-white/70 hover:bg-brand-primary hover:text-white transition-colors"
													title="Download MP3"
												>
													<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
												</a>
											)}
											{song.youtubeLink && (
												<a 
													href={song.youtubeLink}
													target="_blank"
													rel="noreferrer"
													className="p-2 rounded-full bg-white/5 text-white/70 hover:bg-red-600 hover:text-white transition-colors"
													title="Watch on YouTube"
												>
													<svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/></svg>
												</a>
											)}
										</div>
										
										{song.bookletBuyLink && (
											<Link 
												href={song.bookletBuyLink}
												className="text-[10px] font-bold uppercase tracking-widest text-brand-primary hover:text-white transition-colors"
											>
												Get Booklet →
											</Link>
										)}
									</div>
								</div>
							))}
						</div>
					) : (
						<div className="text-center text-white/40">
							No additional volumes found.
						</div>
					)}
				</div>
			</section>

			{/* ── 4. YouTube Section ────────────────────────────────────────── */}
			<section className="py-24 px-6 md:px-12">
				<div className="max-w-4xl mx-auto text-center">
					<span className="text-white/50 uppercase tracking-[0.2em] text-xs font-bold mb-4 block">Visual Journey</span>
					<h2 className="text-3xl serif text-white mb-10">Watch on YouTube</h2>
					<div className="aspect-video w-full rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-black">
						{/* Placeholder for YouTube Playlist if dynamic, or we can use the latest song's link. Assuming we embed a channel or playlist. I will embed a search/playlist placeholder for now, or just the latest song again if playlist is unavailable. */}
						<iframe 
							src="https://www.youtube.com/embed?listType=search&list=Spiritans+Sound+Fr+Oluwafemi" 
							className="w-full h-full"
							allowFullScreen
						/>
					</div>
				</div>
			</section>

			{/* ── 5. Support Section ────────────────────────────────────────── */}
			<section className="py-24 px-6">
				<div className="max-w-3xl mx-auto bg-linear-to-br from-brand-primary/20 to-transparent border border-brand-primary/30 rounded-3xl p-12 text-center backdrop-blur-md relative overflow-hidden">
					<div className="absolute inset-0 bg-[url('/assets/noise.png')] opacity-10 mix-blend-overlay pointer-events-none" />
					
					<div className="relative z-10">
						<h2 className="text-3xl serif text-white mb-6">Support the Mission</h2>
						<p className="text-white/70 font-light mb-10 leading-relaxed">
							Spiritans Sound Outreach is dedicated to spreading the Gospel through sacred music and reflections. Your support helps us continue producing "Lyrics of Light" and other soul-stirring resources.
						</p>
						<Link 
							href="/donations"
							className="inline-block px-10 py-4 bg-white text-brand-primary font-bold tracking-widest uppercase text-sm rounded-full hover:bg-sacred-gold hover:text-white transition-colors shadow-xl"
						>
							Support Us
						</Link>
					</div>
				</div>
			</section>

		</main>
	);
}
