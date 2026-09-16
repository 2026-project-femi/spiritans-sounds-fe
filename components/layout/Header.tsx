"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useState, useEffect } from "react";
import { useAuth } from "@/providers/AuthProvider";

const navLinks = [
	{ href: "/", label: "Home" },
	{ href: "/homilies", label: "Homilies" },
	{ href: "/articles", label: "Articles" },
	{ href: "/unveiler", label: "Treasures  Unveiler" },
	{ href: "/lyrics-of-light", label: "Lyrics of Light" },
	{ href: "/about", label: "About" },
];

const moreLinks = [
	{ href: "/contact", label: "Contact" },
	{ href: "/unveiler/issues", label: "Magazine Issues" },
	{ href: "/unveiler/books", label: "Book Store" },
	{ href: "/unveiler/publish", label: "Publish a Book" },
	{ href: "/unveiler/radio", label: "Internet Radio" },
	{ href: "/unveiler/login", label: "Author Login" },
	// { href: "/unveiler/adverts", label: "Advertising" },
];

const Header: React.FC = () => {
	const pathname = usePathname();
	const { user, refetchUser } = useAuth();
	const [isScrolled, setIsScrolled] = useState(false);
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

	const handleLogout = async () => {
		await fetch("/api/users/logout", { method: "POST" });
		await refetchUser();
		window.location.href = "/";
	};

	const dynamicMoreLinks = user 
		? moreLinks.map(link => 
			link.href === "/unveiler/login" 
				? { href: "/unveiler/dashboard", label: "Dashboard" } 
				: link
		  )
		: moreLinks;

	useEffect(() => {
		const handleScroll = () => {
			setIsScrolled(window.scrollY > 20);
		};
		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	// Lock body scroll and handle escape key when mobile menu is open
	useEffect(() => {
		if (isMobileMenuOpen) {
			document.body.style.overflow = "hidden";
			const handleKeyDown = (e: KeyboardEvent) => {
				if (e.key === "Escape") {
					setIsMobileMenuOpen(false);
				}
			};
			window.addEventListener("keydown", handleKeyDown);
			return () => {
				document.body.style.overflow = "";
				window.removeEventListener("keydown", handleKeyDown);
			};
		} else {
			document.body.style.overflow = "";
		}
	}, [isMobileMenuOpen]);

	const isActiveLink = (href: string) => {
		if (href === "/") {
			return pathname === "/";
		}
		return pathname.startsWith(href);
	};

	// Hide main site header on dedicated book launch funnel pages
	if (pathname?.startsWith("/unveiler/books/behind-the-veil") || pathname === "/behind-the-veil") {
		return null;
	}

	return (
		<header
			className={`fixed top-0 left-0 right-0 z-50 transition-gentle px-4 sm:px-6 md:px-12 py-3 sm:py-4 ${
				isScrolled ? "bg-white md:bg-white/80 md:backdrop-blur-md shadow-sm py-2.5 sm:py-3" : "bg-transparent py-4 sm:py-6"
			}`}>
			<div className="max-w-7xl mx-auto flex items-center justify-between">
				{/* Logo Section */}
				<Link href="/" className="flex items-center gap-2 shrink-0 min-w-0">
					<Image
						src="/assets/cropped-SpritansLogo.png"
						alt="Logo"
						width={36}
						height={36}
						className="shrink-0 w-8 h-8 sm:w-10 sm:h-10 object-contain"
					/>
					<span className="font-bold text-base sm:text-lg text-primary whitespace-nowrap truncate">
						Spiritans Sound
					</span>
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
						<button className="text-sm font-medium tracking-widest uppercase text-sacred-slate/70 hover:text-brand-primary transition-gentle ">
							More
						</button>
						<div className="absolute top-full left-0 w-56 bg-white shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-gentle border-t-2 border-brand-primary py-2 z-50 rounded-b-md">
							{dynamicMoreLinks.map((link) => {
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
							{user && (
								<button
									onClick={handleLogout}
									className="block w-full text-left px-4 py-2 text-xs uppercase tracking-widest transition-gentle text-red-500 hover:bg-red-50 font-medium"
								>
									Log Out
								</button>
							)}
						</div>
					</div>

					<Link
						href="/donations"
						className="px-6 py-2 border text-brand-primary text-xs font-semibold tracking-widest uppercase hover:bg-brand-primary transition-all duration-300 hover:text-white rounded-md">
						Donate
					</Link>
				</nav>

				{/* Mobile Menu Toggle */}
				<button
					aria-label="Toggle navigation menu"
					aria-expanded={isMobileMenuOpen}
					className="lg:hidden text-sacred-slate p-2 rounded-lg hover:bg-black/5 transition-colors focus:outline-none min-h-[44px] min-w-[44px] flex items-center justify-center"
					onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
					<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={1.75}
							d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"}
						/>
					</svg>
				</button>
			</div>

			{/* Mobile Menu Overlay */}
			<div
				role="dialog"
				aria-modal="true"
				aria-label="Mobile Navigation"
				className={`fixed inset-0 bg-white z-50 transition-gentle transform duration-300 lg:hidden flex flex-col ${
					isMobileMenuOpen ? "translate-x-0 opacity-100" : "translate-x-full opacity-0 pointer-events-none"
				}`}>
				<div className="flex flex-col h-full overflow-y-auto overscroll-contain p-5 sm:p-8">
					{/* Mobile Menu Header */}
					<div className="flex justify-between items-center pb-4 mb-4 border-b border-sacred-slate/10 shrink-0">
						<Link
							href="/"
							onClick={() => setIsMobileMenuOpen(false)}
							className="flex items-center gap-2 min-w-0"
						>
							<Image
								src="/assets/cropped-SpritansLogo.png"
								alt="Logo"
								width={32}
								height={32}
								className="shrink-0 w-8 h-8"
							/>
							<span className="serif text-base sm:text-lg font-bold tracking-wider uppercase truncate">
								Spiritans Sound
							</span>
						</Link>
						<button
							onClick={() => setIsMobileMenuOpen(false)}
							aria-label="Close navigation menu"
							className="p-2 text-sacred-slate hover:bg-black/5 rounded-lg min-h-[44px] min-w-[44px] flex items-center justify-center">
							<svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={1.5}
									d="M6 18L18 6M6 6l12 12"
								/>
							</svg>
						</button>
					</div>

					{/* Navigation Links (Scrollable body) */}
					<div className="space-y-4 sm:space-y-5 flex flex-col items-center justify-center my-auto py-4">
						{navLinks.map((item) => {
							const active = isActiveLink(item.href);
							return (
								<Link
									key={item.label}
									href={item.href}
									onClick={() => setIsMobileMenuOpen(false)}
									className={`text-xl sm:text-2xl serif font-light py-1 transition-gentle min-h-[44px] flex items-center ${
										active
											? "text-brand-primary font-medium"
											: "text-sacred-slate hover:text-brand-primary"
									}`}>
									{item.label}
								</Link>
							);
						})}

						{/* More Links in Mobile */}
						<div className="border-t border-sacred-slate/15 pt-5 w-full max-w-xs">
							<p className="text-xs uppercase tracking-widest text-sacred-slate/50 mb-3 text-center font-semibold">
								More
							</p>
							<div className="space-y-2.5">
								{dynamicMoreLinks.map((link) => {
									const active = isActiveLink(link.href);
									return (
										<Link
											key={link.label}
											href={link.href}
											onClick={() => setIsMobileMenuOpen(false)}
											className={`block text-sm text-center py-1 transition-gentle min-h-[36px] flex items-center justify-center ${
												active
													? "text-brand-primary font-medium"
													: "text-sacred-slate/75 hover:text-brand-primary"
											}`}>
											{link.label}
										</Link>
									);
								})}
								{user && (
									<button
										onClick={() => {
											setIsMobileMenuOpen(false);
											handleLogout();
										}}
										className="block w-full text-center text-sm text-red-500 hover:text-red-600 font-semibold py-1.5 transition-gentle min-h-[44px] flex items-center justify-center"
									>
										Log Out
									</button>
								)}
							</div>
						</div>

						{/* Donate Call to Action */}
						<div className="w-full max-w-xs pt-2">
							<Link
								href="/donations"
								onClick={() => setIsMobileMenuOpen(false)}
								className="block w-full text-center py-3.5 bg-brand-primary text-sm font-semibold text-white tracking-widest uppercase hover:bg-red-700 transition-colors rounded-xl shadow-sm min-h-[48px] flex items-center justify-center">
								Donate
							</Link>
						</div>
					</div>

					{/* Footer Copyright */}
					<div className="shrink-0 pt-4 pb-2 text-center text-xs text-sacred-slate/40 tracking-widest uppercase">
						© Spiritans Sound
					</div>
				</div>
			</div>
		</header>
	);
};

export default Header;
