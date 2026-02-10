import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Helper function to combine and sort posts for the sidebar
import { client } from "@/sanity/lib/client";
import { ALL_CATEGORIES_QUERY, LATEST_SIDEBAR_POSTS_QUERY } from "@/sanity/lib/queries";
import { SidebarRecentPost } from "@/lib/types";

export async function getSidebarData() {
    const [categories, { homilies, articles }] = await Promise.all([
        client.fetch(ALL_CATEGORIES_QUERY),
        client.fetch(LATEST_SIDEBAR_POSTS_QUERY)
    ]);

    const combinedPosts: SidebarRecentPost[] = [...homilies, ...articles]
        .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
        .slice(0, 3); // Get top 3 recent posts

    return {
        categories: categories,
        recentPosts: combinedPosts,
    };
}