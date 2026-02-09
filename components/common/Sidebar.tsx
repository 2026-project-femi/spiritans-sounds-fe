import Link from "next/link";
import Image from "next/image";
import { client } from "@/sanity/lib/client";
import { ALL_CATEGORIES_QUERY, LATEST_SIDEBAR_POSTS_QUERY } from "@/sanity/lib/queries";
import { SidebarProps, SidebarRecentPost } from "@/lib/types";
import React from "react";

// Helper function to combine and sort posts
async function getSidebarData() {
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

export const Sidebar: React.FC = async () => {
    const { categories, recentPosts } = await getSidebarData();

    return (
        <aside className="space-y-16 bg-background p-8 rounded-lg shadow-lg">
            {/* Search - Minimalist */}
            <div className="group border-b border-gray-200 pb-2 focus-within:border-primary transition-colors">
                <input
                    type="text"
                    placeholder="SEARCH THE SANCTUARY..."
                    className="bg-transparent w-full text-xs tracking-widest uppercase focus:outline-none placeholder:text-gray-400"
                />
            </div>

            {/* Categories */}
            <section>
                <h4 className="text-xs font-bold tracking-widest uppercase text-primary mb-8 border-l-2 border-primary pl-4">
                    Categories
                </h4>
                <ul className="space-y-4">
                    {categories.map((cat: string) => (
                        <li key={cat} className="group flex items-center justify-between cursor-pointer">
                            <Link href={`/homilies?category=${cat}`} className="text-sm font-light text-gray-700 group-hover:text-primary transition-colors">
                                {cat}
                            </Link>
                            <span className="text-xs text-gray-300 group-hover:text-primary transition-colors">
                                /
                            </span>
                        </li>
                    ))}
                </ul>
            </section>

            {/* Recent Posts with Artistic Thumbnails */}
            <section>
                <h4 className="text-xs font-bold tracking-widest uppercase text-primary mb-8 border-l-2 border-primary pl-4">
                    Recent Reflections
                </h4>
                <div className="space-y-8">
                    {recentPosts.map((post) => (
                        <Link href={`/${post.type === "homily" ? "homilies" : "articles"}/${post.slug}`} key={post._id} className="group flex items-start space-x-4 cursor-pointer">
                            <div className="w-16 h-16 flex-shrink-0 bg-gray-100 overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-300">
                                {post.imageUrl && (
                                    <Image
                                        src={post.imageUrl}
                                        alt={post.title}
                                        width={64}
                                        height={64}
                                        className="w-full h-full object-cover transform group-hover:scale-110 transition-all duration-300"
                                    />
                                )}
                            </div>
                            <div className="flex-1">
                                <span className="text-[9px] uppercase tracking-widest text-primary/60">
                                    {new Date(post.publishedAt).toLocaleDateString("en-US", { month: 'short', day: 'numeric', year: 'numeric' })}
                                </span>
                                <h5 className="text-sm serif leading-snug group-hover:text-primary transition-colors">
                                    {post.title}
                                </h5>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>

            {/* Newsletter Signup Card */}
            <section className="bg-gray-50 p-8 border border-primary/10">
                <h4 className="text-xs font-semibold tracking-widest uppercase mb-4 serif">Stay Inspired</h4>
                <p className="text-xs text-gray-600 leading-relaxed mb-6 italic">
                    &quot;The spirit flows where it will.&quot; Sign up for monthly meditations.
                </p>
                <div className="space-y-3">
                    <input
                        type="email"
                        placeholder="YOUR EMAIL"
                        className="w-full bg-white px-4 py-3 text-[10px] tracking-widest border border-gray-200 focus:outline-none focus:border-primary"
                    />
                    <button className="w-full bg-primary text-white py-3 text-[10px] tracking-widest uppercase font-bold hover:bg-primary/90 transition-colors">
                        Join
                    </button>
                </div>
            </section>
        </aside>
    );
};

export default Sidebar;
