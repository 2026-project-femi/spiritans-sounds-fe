"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState, useEffect } from "react";

const navLinks = [
	{ href: "/", label: "Home" },
	{ href: "/homilies", label: "Homilies" },
	{ href: "/articles", label: "Articles" },
	{ href: "/unveiler", label: "Unveiler Magazine" },
	{ href: "/about", label: "About" },
	// { href: "/contact", label: "Contact" },
];

const moreLinks = [
	{ href: "/prayers", label: "Prayers & Devotionals" },
	{ href: "/music", label: "Music & Worship" },
	{ href: "/news", label: "News / Events" },
	{ href: "/radio", label: "🎙 Online Radio" },
	{ href: "/newsletter", label: "Newsletter" },
	{ href: "/publications", label: "📚 eBooks & Publications" },
];

const Header: React.FC = () => {
	const pathname = usePathname();
	const [isScrolled, setIsScrolled] = useState(false);
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

	useEffect(() => {
		const handleScroll = () => {
			setIsScrolled(window.scrollY > 20);
		};
		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	const isActiveLink = (href: string) => {
		if (href === "/") {
			return pathname === "/";
		}
		return pathname.startsWith(href);
	};

	return (
		<header
			className={`fixed top-0 left-0 right-0 z-50 transition-gentle px-6 md:px-12 py-4 ${
				isScrolled ? "bg-white md:bg-white/80 md:backdrop-blur-md shadow-sm py-3" : "bg-transparent py-6"
			}`}>
			<div className="max-w-7xl mx-auto flex items-center justify-between">
				{/* Logo Section */}
				<Link href="/" className="flex items-center gap-2">
					<Image src="/assets/cropped-SpritansLogo.png" alt="Logo" width={40} height={40} />
					<span className="font-bold text-lg text-primary">Spiritans Sound</span>
				</Link>

				{/* Desktop Navigation */}
				<nav className="hidden lg:flex items-center space-x-8">
					{navLinks.map((item) => {
						const active = isActiveLink(item.href);
						return (
							<Link
								key={item.label}
								href={item.href}
								className={`text-sm font-medium tracking-widest uppercase transition-gentle ${
									active
										? "text-brand-primary"
										: "text-sacred-slate/70 hover:text-brand-primary"
								}`}>
								{item.label}
							</Link>
						);
					})}

					{/* More Dropdown */}
					<div className="relative group">
						<button className="text-sm font-medium tracking-widest uppercase text-sacred-slate/70 hover:text-brand-primary transition-gentle">
							More
						</button>
						<div className="absolute top-full left-0 mt-4 w-56 bg-white shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-gentle border-t-2 text-brand-primary py-2">
							{moreLinks.map((link) => {
								const active = isActiveLink(link.href);
								return (
									<Link
										key={link.label}
										href={link.href}
										className={`block px-4 py-2 text-xs uppercase tracking-widest transition-gentle ${
											active
												? "bg-sacred-ivory text-brand-primary"
												: "text-sacred-slate/60 hover:bg-sacred-ivory hover:text-brand-primary"
										}`}>
										{link.label}
									</Link>
								);
							})}
						</div>
					</div>

					<Link
						href="/donations"
						className="px-6 py-2 border text-brand-primary text-brand-primary text-xs font-semibold tracking-widest uppercase hover:bg-brand-primary transition-all duration-500 hover:text-white transition-gentle">
						Donate
					</Link>
				</nav>

				{/* Mobile Menu Toggle */}
				<button
					className="lg:hidden text-sacred-slate p-2 focus:outline-none"
					onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
					<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={1}
							d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"}
						/>
					</svg>
				</button>
			</div>

			{/* Mobile Menu Overlay */}
			<div
				className={`fixed inset-0 bg-white z-60 transition-gentle transform lg:hidden ${isMobileMenuOpen ? "translate-x-0" : "translate-x-full"}`}>
				<div className="flex flex-col h-full p-8">
					<div className="flex justify-between items-center mb-12">
						<Image src="/assets/cropped-SpritansLogo.png" alt="Logo" width={40} height={40} />

						<span className="serif text-2xl tracking-widest uppercase">Spiritans Sound</span>
						<button onClick={() => setIsMobileMenuOpen(false)} className="p-2">
							<svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={1}
									d="M6 18L18 6M6 6l12 12"
								/>
							</svg>
						</button>
					</div>

					<div className="space-y-6 flex flex-col items-center justify-center grow">
						{navLinks.map((item) => {
							const active = isActiveLink(item.href);
							return (
								<Link
									key={item.label}
									href={item.href}
									onClick={() => setIsMobileMenuOpen(false)}
									className={`text-2xl serif font-light transition-gentle ${
										active
											? "text-brand-primary"
											: "text-sacred-slate hover:text-brand-primary"
									}`}>
									{item.label}
								</Link>
							);
						})}

						{/* More Links in Mobile */}
						<div className="border-t border-sacred-slate/20 pt-6 w-full max-w-xs">
							<p className="text-xs uppercase tracking-widest text-sacred-slate/50 mb-4 text-center">
								More
							</p>
							<div className="space-y-3">
								{moreLinks.map((link) => {
									const active = isActiveLink(link.href);
									return (
										<Link
											key={link.label}
											href={link.href}
											onClick={() => setIsMobileMenuOpen(false)}
											className={`block text-sm text-center transition-gentle ${
												active
													? "text-brand-primary"
													: "text-sacred-slate/70 hover:text-brand-primary"
											}`}>
											{link.label}
										</Link>
									);
								})}
							</div>
						</div>

						<Link
							href="/donations"
							onClick={() => setIsMobileMenuOpen(false)}
							className="mt-4 px-10 py-3 bg-sacred-gold text-white text-sm font-semibold tracking-widest uppercase hover:bg-brand-primary transition-gentle">
							Donate
						</Link>
					</div>

					<div className="mt-auto text-center text-xs text-sacred-slate/40 tracking-widest uppercase">
						© Spiritans Sound
					</div>
				</div>
			</div>
		</header>
	);
};

export default Header;
