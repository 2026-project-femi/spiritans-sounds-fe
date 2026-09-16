/**
 * Shared external time store for real-time second-by-second updates.
 *
 * Safely caches the current timestamp so that React's useSyncExternalStore
 * getSnapshot returns an immutable value between ticks, preventing infinite re-render loops.
 */

let currentTime = typeof window !== "undefined" ? Date.now() : 0;
const listeners = new Set<() => void>();
let intervalId: ReturnType<typeof setInterval> | null = null;

export const timeStore = {
  subscribe(callback: () => void) {
    listeners.add(callback);
    if (listeners.size === 1 && typeof window !== "undefined") {
      currentTime = Date.now();
      intervalId = setInterval(() => {
        currentTime = Date.now();
        listeners.forEach((listener) => listener());
      }, 1000);
    }
    return () => {
      listeners.delete(callback);
      if (listeners.size === 0 && intervalId) {
        clearInterval(intervalId);
        intervalId = null;
      }
    };
  },
  getSnapshot() {
    return currentTime;
  },
  getServerSnapshot() {
    return 0;
  },
};
