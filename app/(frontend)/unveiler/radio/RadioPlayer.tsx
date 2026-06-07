"use client";

import { useState, useEffect } from "react";
import { Radio, Play, Volume2 } from "lucide-react";

export interface ScheduleItem {
  time: string;
  endTime?: string; // When the broadcast ends — no playback outside this range
  program: string;
  host?: string;
  type?: string;
  day?: string;
  audioUrl?: string; // Pre-recorded source
}

export function RadioPlayer({ streamUrl, schedule }: { streamUrl?: string, schedule: ScheduleItem[] }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeItem, setActiveItem] = useState<ScheduleItem | null>(null);

  useEffect(() => {
    const parseTimeToMinutes = (timeStr: string): number => {
      const match = timeStr.match(/(\d+):(\d+)\s*(AM|PM)/i);
      if (match) {
        let h = parseInt(match[1]);
        const m = parseInt(match[2]);
        const isPM = match[3].toUpperCase() === "PM";
        if (isPM && h !== 12) h += 12;
        if (!isPM && h === 12) h = 0;
        return h * 60 + m;
      }
      const itemHour = parseInt(timeStr.split(":")[0]) || 0;
      const isPM = timeStr.includes("PM");
      const h = isPM && itemHour !== 12 ? itemHour + 12 : (itemHour === 12 && !isPM ? 0 : itemHour);
      return h * 60;
    };

    const processed = schedule.map((item) => ({
      ...item,
      minutes: parseTimeToMinutes(item.time),
      endMinutes: item.endTime ? parseTimeToMinutes(item.endTime) : null,
    }));

    const updateActive = () => {
      const now = new Date();
      const currentMinutes = now.getHours() * 60 + now.getMinutes();

      let found: ScheduleItem | null = null;

      for (let i = 0; i < processed.length; i++) {
        const currentItem = processed[i];
        const nextItem = processed[i + 1];

        const withinStart = currentMinutes >= currentItem.minutes;
        const withinEnd = currentItem.endMinutes !== null
          ? currentMinutes < currentItem.endMinutes
          : (!nextItem || currentMinutes < nextItem.minutes);

        if (withinStart && withinEnd) {
          found = currentItem;
          break;
        }
      }
      setActiveItem(found);
      
      // Optional: Turn off playing if program changed and new program has no audio
      if (found && !found.audioUrl && !streamUrl) {
        setIsPlaying(false);
      }
    };

    updateActive();
    const interval = setInterval(updateActive, 60000); 
    return () => clearInterval(interval);
  }, [schedule, streamUrl]);

  // Priority: 1) Active schedule's pre-recorded audio 2) Fallback stream URL
  const currentAudioSource = activeItem?.audioUrl || streamUrl;
  const isAudioAvailable = !!currentAudioSource;

  const displayTitle = activeItem ? activeItem.program : "Spiritans Sound Radio";
  const displaySubtitle = activeItem 
      ? `On Air • ${activeItem.host || "Program"}` 
      : (isAudioAvailable ? "Live Stream Active" : "Currently Off Air");

  return (
    <div className="mt-6 md:mt-8 p-6 md:p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6 text-center sm:text-left">
        <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-linear-to-br from-brand-primary to-red-700 flex items-center justify-center shrink-0 mx-auto sm:mx-0">
          <Radio className="w-6 h-6 md:w-7 md:h-7 text-white" />
        </div>
        <div className="flex-1">
          <p className="text-white font-bold text-base md:text-lg line-clamp-1">{displayTitle}</p>
          <div className="flex items-center justify-center sm:justify-start gap-2 mt-1">
            <span className={`w-2 h-2 rounded-full ${isPlaying ? "bg-green-400 animate-pulse" : (isAudioAvailable ? "bg-amber-400" : "bg-gray-500")}`} />
            <span className="text-xs md:text-sm text-gray-400 line-clamp-1">{displaySubtitle}</span>
          </div>
        </div>
      </div>

      {isPlaying && (
        <div className="flex items-end justify-center gap-1 h-8 md:h-10 mb-6">
          {Array.from({ length: 20 }).map((_, i) => (
            <div key={i}
              className="w-1.5 bg-linear-to-t from-brand-primary to-red-500 rounded-full animate-pulse"
              style={{ height: `${Math.random() * 100}%`, animationDelay: `${i * 0.05}s` }}
            />
          ))}
        </div>
      )}

      {/* Actual audio element */}
      {isAudioAvailable && isPlaying && <audio src={currentAudioSource} autoPlay />}

      <div className="flex items-center justify-center gap-4">
        <button
          disabled={!isAudioAvailable}
          onClick={() => setIsPlaying(!isPlaying)}
          className={`flex items-center justify-center gap-2 md:gap-3 px-6 py-3 md:px-8 md:py-4 text-white font-bold rounded-full transition-all duration-300 text-sm sm:text-base md:text-lg w-full sm:w-auto ${
            isAudioAvailable 
              ? "bg-linear-to-r from-brand-primary to-red-700 hover:opacity-90 hover:scale-105 cursor-pointer" 
              : "bg-gray-700 cursor-not-allowed opacity-50"
          }`}
        >
          {isPlaying ? <Volume2 className="w-5 h-5 md:w-6 md:h-6" /> : <Play className="w-5 h-5 md:w-6 md:h-6" />}
          {!isAudioAvailable ? "Unavailable" : (isPlaying ? "Now Playing" : "Tune In")}
        </button>
      </div>

      {!isAudioAvailable && (
        <p className="text-[10px] md:text-xs text-brand-primary/80 mt-4 text-center sm:text-left">
          * Broadcast will be available here when the next program begins.
        </p>
      )}
    </div>
  );
}
