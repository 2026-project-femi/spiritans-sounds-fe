"use client";

import { useSyncExternalStore } from "react";
import { timeStore } from "@/lib/timeStore";

interface Props {
  targetISO: string;
  /** "light" for dark backgrounds, "dark" for light backgrounds */
  tone?: "light" | "dark";
  compact?: boolean;
}

export default function Countdown({ targetISO, tone = "light", compact = false }: Props) {
  const target = new Date(targetISO).getTime();

  // Snapshot function called by useSyncExternalStore with cached values
  const now = useSyncExternalStore(
    timeStore.subscribe,
    timeStore.getSnapshot,
    timeStore.getServerSnapshot
  );

  const diff = now > 0 ? Math.max(0, target - now) : 0;
  const days = Math.floor(diff / 86400000);
  const hours = Math.floor((diff / 3600000) % 24);
  const minutes = Math.floor((diff / 60000) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  const units = [
    { label: "Days", value: days },
    { label: "Hours", value: hours },
    { label: "Minutes", value: minutes },
    { label: "Seconds", value: seconds },
  ];

  const light = tone === "light";

  return (
    <div
      className={`grid grid-cols-4 ${compact ? "gap-1.5 sm:gap-3" : "gap-1.5 min-[400px]:gap-2.5 sm:gap-4"} w-full max-w-md`}
      role="timer"
      aria-label="Time remaining until the online book launch"
    >
      {units.map((u) => (
        <div
          key={u.label}
          className={`rounded-lg border text-center transition-all duration-300 ${
            compact ? "py-2 px-1" : "py-2.5 min-[400px]:py-3.5 sm:py-4 px-1"
          } ${
            light
              ? "border-white/15 bg-white/[0.06] backdrop-blur-md shadow-lg"
              : "border-border bg-card shadow-xs"
          }`}
        >
          <div
            className={`font-serif tabular-nums font-bold leading-none ${
              compact
                ? "text-lg min-[400px]:text-xl sm:text-2xl"
                : "text-xl min-[400px]:text-2xl sm:text-3xl md:text-[2.25rem]"
            } ${light ? "text-white" : "text-foreground"}`}
          >
            {String(u.value).padStart(2, "0")}
          </div>
          <div
            className={`mt-1 sm:mt-1.5 text-[0.48rem] min-[400px]:text-[0.55rem] sm:text-[0.6rem] font-semibold uppercase tracking-[0.15em] sm:tracking-[0.2em] ${
              light ? "text-white/60" : "text-muted-foreground"
            }`}
          >
            {u.label}
          </div>
        </div>
      ))}
    </div>
  );
}
