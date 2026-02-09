import { SidebarProps } from "@/lib/types";
import React from "react";

export const Sidebar: React.FC<SidebarProps> = ({ categories, recentPosts }) => {
	return (
		<aside className="space-y-16">
			{/* Search - Minimalist */}
			<div className="group border-b border-sacred-slate/10 pb-2 focus-within:border-sacred-gold transition-gentle">
				<input
					type="text"
					placeholder="SEARCH THE SANCTUARY..."
					className="bg-transparent w-full text-xs tracking-widest uppercase focus:outline-none placeholder:text-sacred-slate/30"
				/>
			</div>

			{/* Categories */}
			<section>
				<h4 className="text-[10px] font-bold tracking-[0.3em] uppercase text-sacred-gold mb-8 border-l-2 border-sacred-gold pl-4">
					Categories
				</h4>
				<ul className="space-y-4">
					{categories.map((cat) => (
						<li key={cat} className="group flex items-center justify-between cursor-pointer">
							<span className="text-sm font-light text-sacred-slate/70 group-hover:text-sacred-gold transition-gentle">
								{cat}
							</span>
							<span className="text-[10px] text-sacred-slate/20 group-hover:text-sacred-gold transition-gentle">
								/
							</span>
						</li>
					))}
				</ul>
			</section>

			{/* Recent Posts with Artistic Thumbnails */}
			<section>
				<h4 className="text-[10px] font-bold tracking-[0.3em] uppercase text-sacred-gold mb-8 border-l-2 border-sacred-gold pl-4">
					Recent Reflections
				</h4>
				<div className="space-y-8">
					{recentPosts.slice(0, 3).map((post) => (
						<div key={post.id} className="group flex items-start space-x-4 cursor-pointer">
							<div className="w-16 h-16 flex-shrink-0 bg-sacred-ivory overflow-hidden grayscale group-hover:grayscale-0 transition-gentle">
								<img
									src={post.imageUrl}
									alt={post.title}
									className="w-full h-full object-cover transform group-hover:scale-110 transition-gentle"
								/>
							</div>
							<div className="flex-1">
								<span className="text-[9px] uppercase tracking-widest text-sacred-gold/60">
									{post.date}
								</span>
								<h5 className="text-sm serif leading-snug group-hover:text-sacred-gold transition-gentle">
									{post.title}
								</h5>
							</div>
						</div>
					))}
				</div>
			</section>

			{/* Newsletter Signup Card */}
			<section className="bg-sacred-slate/5 p-8 border border-sacred-gold/10">
				<h4 className="text-xs font-semibold tracking-widest uppercase mb-4 serif">Stay Inspired</h4>
				<p className="text-xs text-sacred-slate/60 leading-relaxed mb-6 italic">
					&quot;The spirit flows where it will.&quot; Sign up for monthly meditations.
				</p>
				<div className="space-y-3">
					<input
						type="email"
						placeholder="YOUR EMAIL"
						className="w-full bg-white px-4 py-3 text-[10px] tracking-widest border border-sacred-slate/10 focus:outline-none focus:border-sacred-gold"
					/>
					<button className="w-full bg-sacred-slate text-white py-3 text-[10px] tracking-widest uppercase font-bold hover:bg-sacred-gold transition-gentle">
						Join
					</button>
				</div>
			</section>
		</aside>
	);
};

export default Sidebar;
