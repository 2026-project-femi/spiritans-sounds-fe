import type { Creator, TalentCategory } from "../types";

export interface CreatorQuery {
  search?: string;
  category?: TalentCategory | "all";
  classYear?: number | "all";
}

/** Pure filter — usable client-side, or replace with a Payload `where` query server-side. */
export function filterCreators(list: Creator[], q: CreatorQuery): Creator[] {
  const s = q.search?.trim().toLowerCase();
  return list.filter((c) => {
    if (q.category && q.category !== "all" && c.primaryCategory !== q.category) return false;
    if (q.classYear && q.classYear !== "all" && c.classYear !== q.classYear) return false;
    if (s) {
      const hay = [c.publicDisplayName, c.tagline, c.location, ...c.talents].join(" ").toLowerCase();
      if (!hay.includes(s)) return false;
    }
    return true;
  });
}
