"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { captureEmailForEbook } from "./actions";

export default function LyricsOfLightClient({ songs }: { songs: any[] }) {
  const [activeSong, setActiveSong] = useState(songs[0] || null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const handleDownloadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage("");

    const result = await captureEmailForEbook(email);
    
    if (result.success) {
      setMessage("Success! Downloading your E-Book...");
      setIsModalOpen(false);
      setEmail("");
      setIsSubmitting(false);
      
      // Trigger native download
      if (activeSong?.bookletFile?.url) {
        const link = document.createElement("a");
        link.href = activeSong.bookletFile.url;
        link.download = activeSong.bookletFile.filename || "Lyrics-of-Light-Ebook.pdf";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } else {
      setMessage(result.error || "Something went wrong.");
      setIsSubmitting(false);
    }
  };

  const handlePlayClick = (song: any) => {
    setActiveSong(song);
    // Smooth scroll to top of featured section
    document.getElementById("featured")?.scrollIntoView({ behavior: "smooth" });
  };

  const librarySongs = songs.filter((s) => s.id !== activeSong?.id);

  return (
    <>
      {/* ── 2. Featured Song Section ────────────────────────────────────────── */}
      <section id="featured" className="py-24 px-6 md:px-12">
        <div className="max-w-6xl mx-auto">
          <div className="mb-16 flex items-center gap-4">
            <div className="w-12 h-px bg-brand-primary" />
            <h2 className="text-3xl serif text-white tracking-wider">Now Playing</h2>
          </div>
          
          {activeSong ? (
            <div className="bg-white/5 border border-white/10 rounded-3xl p-8 md:p-12 backdrop-blur-xl shadow-2xl relative overflow-hidden transition-all duration-500">
              {/* Subtle background element inside card */}
              <div className="absolute -top-24 -right-24 w-64 h-64 bg-brand-primary/10 rounded-full blur-3xl pointer-events-none" />
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 relative z-10">
                {/* Left: Media Player / Video */}
                <div className="space-y-8">
                  <div>
                    <h3 className="text-4xl serif text-white mb-2">{activeSong.title}</h3>
                    <p className="text-brand-primary/80 uppercase tracking-widest text-sm font-semibold">Featured Track</p>
                  </div>

                  {/* YouTube Embed */}
                  {activeSong.youtubeLink && (
                    <div className="aspect-video w-full rounded-2xl overflow-hidden border border-white/10 shadow-lg relative group bg-black">
                      {activeSong.youtubeLink.includes('youtube.com') || activeSong.youtubeLink.includes('youtu.be') ? (
                        <iframe 
                          src={activeSong.youtubeLink.replace('watch?v=', 'embed/').replace('youtu.be/', 'youtube.com/embed/')} 
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
                  {activeSong.audio && typeof activeSong.audio === 'object' && (
                    <div className="bg-white/10 rounded-2xl p-6 flex flex-col gap-4 border border-white/5">
                      <audio controls className="w-full h-10 outline-none [&::-webkit-media-controls-panel]:bg-white/90" key={activeSong.audio.url}>
                        <source src={activeSong.audio.url!} type={activeSong.audio.mimeType!} />
                        Your browser does not support the audio element.
                      </audio>
                      <div className="flex justify-end mt-2">
                        <a 
                          href={activeSong.audio.url!} 
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
                    
                    {activeSong.bookletImage && typeof activeSong.bookletImage === 'object' ? (
                      <div className="w-48 h-64 relative rounded-lg overflow-hidden shadow-2xl mb-8 transform -rotate-2 hover:rotate-0 transition-transform duration-500">
                        <Image 
                          src={activeSong.bookletImage.url!} 
                          alt={activeSong.bookletTitle || "Booklet Cover"} 
                          fill 
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-48 h-64 bg-white/5 rounded-lg flex items-center justify-center mb-8 border border-white/10">
                        <span className="text-white/20 text-sm">No Image</span>
                      </div>
                    )}

                    <h4 className="text-2xl serif text-white mb-4">{activeSong.bookletTitle || activeSong.title}</h4>
                    
                    {activeSong.bookletDescription && (
                      <p className="text-white/60 text-sm leading-relaxed mb-8 max-w-sm">
                        {activeSong.bookletDescription}
                      </p>
                    )}

                    {(activeSong.bookletBuyLink || activeSong.bookletFile) ? (
                      <button 
                        onClick={() => {
                          if (activeSong.bookletFile) {
                            setIsModalOpen(true);
                          } else if (activeSong.bookletBuyLink) {
                            window.open(activeSong.bookletBuyLink, "_blank");
                          }
                        }}
                        className="px-8 py-3 bg-brand-primary text-white font-bold tracking-widest uppercase text-xs rounded-full hover:bg-sacred-gold transition-colors duration-300"
                      >
                        Get Booklet
                      </button>
                    ) : (
                      <span className="text-white/40 text-xs italic">E-Book not available</span>
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
                  
                  <div className="relative z-10 flex gap-4 items-start mb-6 cursor-pointer" onClick={() => handlePlayClick(song)}>
                    {/* Small Thumbnail */}
                    {song.bookletImage && typeof song.bookletImage === 'object' ? (
                      <div className="w-20 h-20 shrink-0 rounded-lg overflow-hidden relative shadow-lg">
                        <Image src={song.bookletImage.url} alt={song.title} fill className="object-cover" />
                      </div>
                    ) : (
                      <div className="w-20 h-20 shrink-0 bg-white/10 rounded-lg" />
                    )}
                    
                    <div>
                      <h3 className="text-xl serif text-white mb-1 group-hover:text-brand-primary transition-colors">{song.title}</h3>
                      <p className="text-white/50 text-xs uppercase tracking-widest">
                        {song.bookletTitle ? `Booklet: ${song.bookletTitle}` : "Volume"}
                      </p>
                    </div>
                  </div>

                  {/* Audio Player quick access or just a play button */}
                  <div className="mb-6 flex items-center justify-between">
                    <button 
                      onClick={() => handlePlayClick(song)}
                      className="px-4 py-2 bg-brand-primary/20 text-brand-primary border border-brand-primary/30 rounded-full text-xs font-bold tracking-widest uppercase hover:bg-brand-primary hover:text-white transition-colors flex items-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                      Play Track
                    </button>
                    
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
                  </div>

                  <div className="mt-auto pt-4 border-t border-white/10 text-right">
                    {(song.bookletBuyLink || song.bookletFile) ? (
                      <button 
                        onClick={() => {
                          handlePlayClick(song);
                          if (song.bookletFile) setIsModalOpen(true);
                          else window.open(song.bookletBuyLink, "_blank");
                        }}
                        className="text-[10px] font-bold uppercase tracking-widest text-brand-primary hover:text-white transition-colors"
                      >
                        Get E-Book →
                      </button>
                    ) : null}
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

      {/* Modal for Email Capture */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm px-4">
          <div className="bg-foreground border border-white/10 rounded-2xl p-8 md:p-12 max-w-md w-full relative shadow-2xl">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>

            <h3 className="text-2xl serif text-white mb-2">Download E-Book</h3>
            <p className="text-white/60 text-sm mb-8 leading-relaxed">
              Enter your email address to download a free copy of the <strong>{activeSong?.bookletTitle || activeSong?.title}</strong> companion e-book.
            </p>

            <form onSubmit={handleDownloadSubmit} className="space-y-4">
              <div>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address" 
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-primary transition-colors"
                />
              </div>
              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full bg-brand-primary text-white font-bold tracking-widest uppercase text-sm py-4 rounded-xl hover:bg-brand-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Processing..." : "Get Free E-Book"}
              </button>
              {message && (
                <p className={`text-sm text-center ${message.includes("Success") ? "text-green-400" : "text-red-400"}`}>
                  {message}
                </p>
              )}
            </form>
          </div>
        </div>
      )}
    </>
  );
}
