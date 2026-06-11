"use client";

import Link from "next/link";
import Image from "next/image";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { SidebarRecentPost } from "@/lib/types";
import { Search, Loader2 } from "lucide-react";

interface SidebarProps {
	categories?: string[];
	recentPosts?: SidebarRecentPost[];
}

export const Sidebar: React.FC<SidebarProps> = ({ categories = [], recentPosts = [] }) => {
	const [searchQuery, setSearchQuery] = useState("");
	const [newsletterEmail, setNewsletterEmail] = useState("");
	const [newsletterName, setNewsletterName] = useState("");
	const [subStatus, setSubStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
	const [subMessage, setSubMessage] = useState("");
	const router = useRouter();

	const handleSearch = (event: React.KeyboardEvent<HTMLInputElement>) => {
		if (event.key === "Enter" && searchQuery.trim()) {
			router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
		}
	};

	const handleSearchClick = () => {
		if (searchQuery.trim()) {
			router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
		}
	};

	const handleNewsletterSubscribe = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!newsletterEmail) return;

		setSubStatus("loading");
		try {
			const res = await fetch("/api/newsletter/subscribe", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ email: newsletterEmail, firstName: newsletterName || undefined }),
			});

			const data = await res.json();
			if (res.ok) {
				setSubStatus("success");
				setSubMessage(data.message);
				setNewsletterEmail("");
				setNewsletterName("");
			} else {
				throw new Error(data.message || "Something went wrong");
			}
		} catch (err: any) {
			setSubStatus("error");
			setSubMessage(err.message);
		}
	};

	return (
		<aside className="space-y-16 bg-background p-8 rounded-lg shadow-lg">
			{/* Search - Minimalist */}
			<div className="relative group border-b border-gray-200 pb-2 focus-within:border-primary transition-colors">
				<input
					type="text"
					placeholder="SEARCH THE SANCTUARY..."
					className="bg-transparent w-full text-xs tracking-widest uppercase focus:outline-none placeholder:text-gray-600pr-8"
					value={searchQuery}
					onChange={(e) => setSearchQuery(e.target.value)}
					onKeyDown={handleSearch}
				/>
				<button
					onClick={handleSearchClick}
					className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-800 hover:text-primary transition-colors"
					aria-label="Search">
					<Search size={16} />
				</button>
			</div>

			{/* Categories */}
			{categories && categories.length > 0 && (
				<section>
					<h4 className="text-xs font-bold tracking-widest uppercase text-primary mb-8 border-l-2 border-primary pl-4">
						Categories
					</h4>
					<ul className="space-y-4">
						{categories.map((cat: string) => (
							<li key={cat} className="group flex items-center justify-between cursor-pointer">
								<Link
									href={`/homilies?category=${cat}`}
									className="text-sm text-gray-700 group-hover:text-primary transition-colors">
									{cat}
								</Link>
								<span className="text-xs text-gray-300 group-hover:text-primary transition-colors">
									/
								</span>
							</li>
						))}
					</ul>
				</section>
			)}

			{/* Recent Posts with Artistic Thumbnails */}
			{recentPosts && recentPosts.length > 0 && (
				<section>
					<h4 className="text-xs font-bold tracking-widest uppercase text-primary mb-8 border-l-2 border-primary pl-4">
						Recent Reflections
					</h4>
					<div className="space-y-8">
						{recentPosts.map((post) => (
							<Link
								href={`/${post.type === "homily" ? "homilies" : "articles"}/${post.slug}`}
								key={post._id}
								className="group flex items-start space-x-4 cursor-pointer">
								<div className="w-16 h-16 shrink-0 bg-gray-100 overflow-hidden   transition-all duration-300">
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
										{new Date(post.publishedAt).toLocaleDateString("en-US", {
											month: "short",
											day: "numeric",
											year: "numeric",
										})}
									</span>
									<h5 className="text-sm serif leading-snug group-hover:text-primary transition-colors">
										{post.title}
									</h5>
								</div>
							</Link>
						))}
					</div>
				</section>
			)}

			{/* Newsletter Signup Card */}
			<section className="bg-gray-50 p-8 border border-primary/10">
				<h4 className="text-xs font-semibold tracking-widest uppercase mb-4 serif">Stay Inspired</h4>
				<p className="text-xs text-gray-800 leading-relaxed mb-6 italic">
					&quot;The spirit flows where it will.&quot; Sign up for monthly meditations.
				</p>
				<form onSubmit={handleNewsletterSubscribe} className="space-y-3">
					<input
						type="text"
						value={newsletterName}
						onChange={(e) => setNewsletterName(e.target.value)}
						placeholder="YOUR NAME (OPTIONAL)"
						className="w-full bg-white px-4 py-3 text-[10px] tracking-widest placeholder:text-gray-600 border border-gray-200 focus:outline-none focus:border-primary"
					/>
					<input
						type="email"
						value={newsletterEmail}
						onChange={(e) => setNewsletterEmail(e.target.value)}
						placeholder="YOUR EMAIL"
						required
						className="w-full bg-white px-4 py-3 text-[10px] tracking-widest placeholder:text-gray-600 border border-gray-200 focus:outline-none focus:border-primary"
					/>
					<button
						type="submit"
						disabled={subStatus === "loading"}
						className="w-full bg-gray-800 text-white py-3 text-[10px] tracking-widest uppercase font-bold hover:bg-gray-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
						{subStatus === "loading" ? (
							<>
								Joining <Loader2 className="w-3 h-3 animate-spin" />
							</>
						) : (
							"Join"
						)}
					</button>
					{subStatus === "success" && <p className="text-[10px] text-green-600 mt-2">{subMessage}</p>}
					{subStatus === "error" && <p className="text-[10px] text-red-600 mt-2">{subMessage}</p>}
				</form>
			</section>
		</aside>
	);
};

export default Sidebar;
