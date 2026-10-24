/**
 * Young Creators Network — data access layer.
 *
 * Server-side read layer for the Young Creators Network.
 * Write/checkout adapters live in ./actions.ts so client forms do not import the
 * demo catalogue. To go live, replace each read body with:
 *   - Payload Local API (`payload.find({ collection: "young-creators", ... })`)
 *   - or Drizzle queries in a Next.js server component.
 * Components never import demo data directly.
 */
import type { Creator, ImpactStat, LatestPost } from "../types";
import { DEMO_CREATORS, DEMO_LATEST } from "../data/demo-creators";
import { filterCreators, type CreatorQuery } from "../lib/filter";

export type { CreatorQuery };

export async function listCreators(q: CreatorQuery = {}): Promise<Creator[]> {
  // TODO(payload): payload.find({ collection: "young-creators", where: {...}, sort: "-classYear" })
  return filterCreators(DEMO_CREATORS, q);
}

export async function getCreatorBySlug(slug: string): Promise<Creator | null> {
  // TODO(payload): payload.find({ collection: "young-creators", where: { slug: { equals: slug } }, limit: 1 })
  return DEMO_CREATORS.find((c) => c.slug === slug) ?? null;
}

export async function listClassYears(): Promise<number[]> {
  return [...new Set(DEMO_CREATORS.map((c) => c.classYear))].sort((a, b) => b - a);
}

export async function getFeaturedCreators(): Promise<Creator[]> {
  return DEMO_CREATORS.filter((c) => c.featured);
}

export async function getLatestPosts(): Promise<LatestPost[]> {
  // TODO(payload): collection "ycn-updates" or reuse the site's existing posts collection filtered by tag
  return DEMO_LATEST;
}

export async function getImpactStats(): Promise<ImpactStat[]> {
  // TODO(payload): read verified figures from a "ycn-settings" global.
  // Empty list = the Impact section shows qualitative pillars, no numbers.
  return [];
}
