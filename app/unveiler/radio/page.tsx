"use client";

import { useState } from "react";
import { Radio, Play, Volume2, Clock, Music, Mic } from "lucide-react";

const schedule = [
  { time: "6:00 AM", program: "Morning Prayer & Lauds", host: "Fr. Victor Orilua, CSSp", type: "Prayer" },
  { time: "7:00 AM", program: "Sacred Music Hour", host: "Spiritans Sound Team", type: "Music" },
  { time: "9:00 AM", program: "Word & Reflection", host: "Guest Preachers", type: "Talk" },
  { time: "12:00 PM", program: "Angelus & Midday Prayer", host: "Community", type: "Prayer" },
  { time: "2:00 PM", program: "Youth Voices", host: "Young Creators Network", type: "Youth" },
  { time: "4:00 PM", program: "Spiritans Sound Classics", host: "Music Archive", type: "Music" },
  { time: "6:00 PM", program: "Evening Reflection", host: "Fr. Victor Orilua, CSSp", type: "Talk" },
  { time: "8:00 PM", program: "Night Prayer & Compline", host: "Community", type: "Prayer" },
];

const typeColors: Record<string, string> = {
  Prayer: "text-blue-400 bg-blue-400/10 border-blue-400/20",
  Music: "text-brand-primary bg-brand-primary/10 border-brand-primary/20",
  Talk: "text-red-500 bg-red-500/10 border-red-500/20",
  Youth: "text-amber-400 bg-amber-400/10 border-amber-400/20",
};

export default function RadioPage() {
  const [isPlaying, setIsPlaying] = useState(false);

  // Get current hour to highlight the current program
  const currentHour = new Date().getHours();

  return (
    <main className="pb-24">
      {/* Hero Player */}
      <section className="relative px-6 py-20 text-center overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-b from-red-950/20 to-transparent z-0" />
        <div className="relative z-10 max-w-2xl mx-auto space-y-6">
          <span className="inline-block text-[10px] tracking-[0.4em] uppercase text-brand-primary font-semibold border border-brand-primary/30 px-4 py-1.5 rounded-full">
            Spiritans Sound Internet Radio
          </span>
          <h1 className="text-5xl font-extrabold text-white">
            Listen. Pray. <span className="text-transparent bg-clip-text bg-linear-to-r from-brand-primary to-red-600">Be Renewed.</span>
          </h1>
          <p className="text-gray-400 leading-relaxed">
            Sacred music, spiritual talks, homilies, and prayer — streaming live 24 hours a day, 7 days a week.
          </p>

          {/* Player Card */}
          <div className="mt-8 p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 rounded-full bg-linear-to-br from-brand-primary to-red-700 flex items-center justify-center shrink-0">
                <Radio className="w-7 h-7 text-white" />
              </div>
              <div className="text-left">
                <p className="text-white font-bold text-lg">Spiritans Sound Radio</p>
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${isPlaying ? "bg-green-400 animate-pulse" : "bg-gray-500"}`} />
                  <span className="text-sm text-gray-400">{isPlaying ? "Live · On Air" : "Off Air"}</span>
                </div>
              </div>
            </div>

            {/* Waveform visual */}
            {isPlaying && (
              <div className="flex items-end justify-center gap-1 h-10 mb-6">
                {Array.from({ length: 20 }).map((_, i) => (
                  <div key={i}
                    className="w-1.5 bg-linear-to-t from-brand-primary to-red-500 rounded-full animate-pulse"
                    style={{ height: `${Math.random() * 100}%`, animationDelay: `${i * 0.05}s` }}
                  />
                ))}
              </div>
            )}

            <div className="flex items-center justify-center gap-4">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="flex items-center gap-3 px-8 py-4 bg-linear-to-r from-brand-primary to-red-700 text-white font-bold rounded-full hover:opacity-90 transition-all duration-300 hover:scale-105 text-lg"
              >
                {isPlaying ? <Volume2 className="w-6 h-6" /> : <Play className="w-6 h-6" />}
                {isPlaying ? "Now Playing" : "Tune In Live"}
              </button>
            </div>

            <p className="text-xs text-gray-600 mt-4">
              * Live stream integration requires a streaming URL to be configured in Sanity CMS
            </p>
          </div>
        </div>
      </section>

      {/* Schedule */}
      <section className="max-w-4xl mx-auto px-6 py-12">
        <div className="flex items-center gap-3 mb-10">
          <Clock className="w-6 h-6 text-pink-400" />
          <h2 className="text-3xl font-bold text-white">Today&apos;s Schedule</h2>
        </div>
        <div className="space-y-3">
          {schedule.map((item, i) => {
            const itemHour = parseInt(item.time.split(":")[0]);
            const isPM = item.time.includes("PM");
            const hour24 = isPM && itemHour !== 12 ? itemHour + 12 : itemHour;
            const isCurrent = currentHour >= hour24 && currentHour < hour24 + 2;

            return (
              <div key={i}
                className={`flex items-center gap-6 p-5 rounded-xl border transition-all duration-300 ${
                  isCurrent
                    ? "bg-red-950/20 border-brand-primary/40"
                    : "bg-white/3 border-white/8 hover:border-white/20"
                }`}>
                <div className="w-20 shrink-0">
                  <span className={`text-sm font-mono font-bold ${isCurrent ? "text-brand-primary" : "text-gray-500"}`}>
                    {item.time}
                  </span>
                  {isCurrent && <div className="text-[10px] text-brand-primary uppercase tracking-widest mt-0.5">On Air</div>}
                </div>
                <div className="flex-1">
                  <p className={`font-semibold ${isCurrent ? "text-white" : "text-gray-300"}`}>{item.program}</p>
                  <p className="text-sm text-gray-500 flex items-center gap-1.5 mt-0.5">
                    <Mic className="w-3 h-3" /> {item.host}
                  </p>
                </div>
                <span className={`text-[10px] tracking-widest uppercase font-semibold px-3 py-1 rounded-full border ${typeColors[item.type]}`}>
                  {item.type}
                </span>
              </div>
            );
          })}
        </div>
      </section>

      {/* Podcast Archive CTA */}
      <section className="max-w-3xl mx-auto px-6 py-12 text-center">
        <div className="p-10 rounded-2xl bg-linear-to-br from-red-950/20 to-red-900/20 border border-brand-primary/20">
          <Music className="w-10 h-10 text-brand-primary mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-white mb-4">Missed a Broadcast?</h2>
          <p className="text-gray-400 mb-8">
            Browse our archive of past programmes, homilies, and sacred music recordings.
          </p>
          <a href="/homilies"
            className="inline-block px-8 py-3 bg-linear-to-r from-brand-primary to-red-700 text-white font-semibold rounded-full hover:opacity-90 transition-all duration-300 hover:scale-105">
            Browse Homily Archive
          </a>
        </div>
      </section>
    </main>
  );
}
