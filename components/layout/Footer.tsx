"use client";

import { FacebookIcon, Instagram, X, YoutubeIcon, Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";

const navLinks = [
	{ href: "/", label: "Home" },
	{ href: "/homilies", label: "Homilies" },
	{ href: "/unveiler", label: "Unveiler Magazine" },
	{ href: "/about", label: "About" },
	{ href: "/contact", label: "Contact" },
];

const socialLinks = [
	{ href: "https://www.facebook.com/profile.php?id=100091452643400", icon: <FacebookIcon />, label: "FB", name: "Facebook" },
	{ href: "#", icon: <X />, label: "TW", name: "Twitter" },
	{ href: "#", icon: <Instagram />, label: "IG", name: "Instagram" },
	{ href: "https://www.facebook.com/share/18AwoC8rSw/", icon: <YoutubeIcon />, label: "YT", name: "YouTube" },
];

const Footer: React.FC = () => {
	const [email, setEmail] = useState("");
	const [firstName, setFirstName] = useState("");
	const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
	const [message, setMessage] = useState("");

	const handleSubscribe = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!email) return;

		setStatus("loading");
		try {
			const res = await fetch("/api/newsletter/subscribe", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ email, firstName: firstName || undefined }),
			});

			const data = await res.json();
			if (res.ok) {
				setStatus("success");
				setMessage(data.message);
				setEmail("");
				setFirstName("");
			} else {
				throw new Error(data.message || "Something went wrong");
			}
		} catch (err: any) {
			setStatus("error");
			setMessage(err.message);
		}
	};

	return (
		<footer className="bg-[#1a1a1a] text-white pt-20 pb-10 px-6 md:px-12 border-t ">
			<div className="max-w-7xl mx-auto">
				<div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
					<div className="col-span-1 md:col-span-1">
						{/* Logo and Mission */}
						<Link href="/" className="flex items-center gap-2 mb-4">
							<Image src="/assets/cropped-SpritansLogo.png" alt="Logo" width={40} height={40} />
							<span className="font-bold text-lg text-primary">Spiritans Sound</span>
						</Link>
						<p className="text-sm text-gray-200 mb-6 font-light leading-relaxed">
							Bringing you closer to the divine through homilies, reflections, and music.
						</p>
						<div className="flex space-x-6">
							{socialLinks.map((social) => (
								<a
									key={social.name}
									href={social.href}
									target="_blank"
									rel="noopener noreferrer"
									className="text-gray-500 hover:text-brand-primary text-xs tracking-widest transition-gentle">
									{social.label}
									{social.icon}
								</a>
							))}
						</div>
					</div>

					<div>
						<h4 className="text-xs font-semibold tracking-widest uppercase mb-6 text-brand-primary ">Navigate</h4>
						<ul className="space-y-4">
							{navLinks.map((link) => (
								<li key={link.href}>
									<Link
										href={link.href}
										className="text-sm text-gray-200 hover:text-white transition-gentle font-light">
										{link.label}
									</Link>
								</li>
							))}
						</ul>
					</div>

					<div>
						<h4 className="text-xs font-semibold tracking-widest uppercase mb-6 text-brand-primary">Resources</h4>
						<ul className="space-y-4">
							<li>
								<Link
									href={"/prayers"}
									className="text-sm text-gray-200 hover:text-white transition-gentle font-light">
									Prayers
								</Link>
							</li>
							<li>
								<Link
									href="/music"
									className="text-sm text-gray-200 hover:text-white transition-gentle font-light">
									Sacred Music
								</Link>
							</li>
							<li>
								<Link
									href="/homilies"
									className="text-sm text-gray-200 hover:text-white transition-gentle font-light">
									Homily Archives
								</Link>
							</li>
						</ul>
					</div>

					<div>
						<h4 className="text-xs font-semibold tracking-widest uppercase mb-6 text-brand-primary">
							Newsletter
						</h4>
						<p className="text-xs text-gray-200 mb-6 font-light leading-relaxed">
							Get the latest updates and spiritual insights delivered to your inbox.
						</p>
						<form onSubmit={handleSubscribe} className="flex flex-col space-y-3">
							<input
								type="text"
								value={firstName}
								onChange={(e) => setFirstName(e.target.value)}
								placeholder="First Name (optional)"
								className="bg-transparent border-b border-gray-700 py-2 text-sm focus:outline-none focus:text-brand-primary transition-gentle"
							/>
							<input
								type="email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								placeholder="Email Address"
								required
								className="bg-transparent border-b border-gray-700 py-2 text-sm focus:outline-none focus:text-brand-primary transition-gentle"
							/>
							<button
								type="submit"
								disabled={status === "loading"}
								className="text-left text-xs uppercase tracking-widest text-brand-primary hover:text-white transition-gentle pt-2 flex items-center gap-2">
								{status === "loading" ? (
									<>
										Subscribing <Loader2 className="w-3 h-3 animate-spin" />
									</>
								) : (
									"Subscribe →"
								)}
							</button>
							{status === "success" && <p className="text-[10px] text-green-500 mt-2">{message}</p>}
							{status === "error" && <p className="text-[10px] text-red-500 mt-2">{message}</p>}
						</form>
					</div>
				</div>

				<div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center text-[10px] tracking-[0.2em] uppercase text-gray-400">
					<p>© {new Date().getFullYear()} Spiritans Sound. All rights reserved.</p>
					<div className="flex space-x-8 mt-4 md:mt-0">
						<Link href="/privacy" className="hover:text-brand-primary transition-gentle">
							Privacy Policy
						</Link>
						<Link href="/terms" className="hover:text-brand-primary transition-gentle">
							Terms of Service
						</Link>
					</div>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
