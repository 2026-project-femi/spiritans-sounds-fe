// "use client";

// import Link from "next/link";
// import Image from "next/image";
// import {
// 	NavigationMenu,
// 	NavigationMenuItem,
// 	NavigationMenuList,
// 	NavigationMenuTrigger,
// 	NavigationMenuContent,
// } from "@/components/ui/navigation-menu";
// import { Button } from "@/components/ui/button";
// import MobileNav from "./HeaderMobile";

// const navLinks = [
//     { href: "/", label: "Home" },
//     { href: "/homilies", label: "Homilies" },
//     { href: "/articles", label: "Articles" },
//     { href: "/about", label: "About" },
//     { href: "/contact", label: "Contact" },
// ];

// const moreLinks = [
//     { href: "/prayers", label: "Prayers & Devotionals" },
//     { href: "/music", label: "Music & Worship" },
//     { href: "/news", label: "News / Events" },
//     { href: "/radio", label: "🎙 Online Radio" },
//     { href: "/newsletter", label: "Newsletter" },
//     { href: "/publications", label: "📚 eBooks & Publications" },
// ];

// export default function Header() {
// 	return (
// 		<header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
// 			<div className="container flex h-16 max-w-7xl items-center justify-between">
// 				{/* Logo */}
// 				<Link href="/" className="flex items-center gap-2">
// 					<Image src="/assets/cropped-SpritansLogo.png" alt="Logo" width={40} height={40} />
// 					<span className="font-bold text-lg text-primary">Spiritual Sound</span>
// 				</Link>

// 				{/* Desktop Navigation */}
// 				<NavigationMenu className="hidden md:flex">
// 					<NavigationMenuList>
//                         {navLinks.map((link) => (
//                             <NavLink key={link.href} href={link.href}>
//                                 {link.label}
//                             </NavLink>
//                         ))}

// 						{/* More Dropdown */}
// 						<NavigationMenuItem>
// 							<NavigationMenuTrigger>More</NavigationMenuTrigger>
// 							<NavigationMenuContent>
// 								<div className="grid w-56 gap-2 p-4">
//                                     {moreLinks.map((link) => (
//                                         <MenuLink key={link.href} href={link.href}>
//                                             {link.label}
//                                         </MenuLink>
//                                     ))}
//                                 </div>
// 							</NavigationMenuContent>
// 						</NavigationMenuItem>
// 					</NavigationMenuList>
// 				</NavigationMenu>

// 				{/* CTA */}
// 				<div className="hidden md:flex items-center gap-4">
// 					<Button asChild>
// 						<Link href="/donations">Donate</Link>
// 					</Button>
// 				</div>

// 				{/* Mobile */}
// 				<MobileNav />
// 			</div>
// 		</header>
// 	);
// }

// /* -------------------------------- */

// function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
// 	return (
// 		<NavigationMenuItem>
// 			<Link href={href} className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50">
// 				{children}
// 			</Link>
// 		</NavigationMenuItem>
// 	);
// }

// function MenuLink({ href, children }: { href: string; children: React.ReactNode }) {
// 	return (
// 		<Link href={href} className="rounded-md px-3 py-2 text-sm hover:bg-muted">
// 			{children}
// 		</Link>
// 	);
// }
"use client";
import { NAV_ITEMS } from "@/lib/constants";
import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect } from "react";

const Header: React.FC = () => {
	const [isScrolled, setIsScrolled] = useState(false);
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

	useEffect(() => {
		const handleScroll = () => {
			setIsScrolled(window.scrollY > 20);
		};
		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	return (
		<header
			className={`fixed top-0 left-0 right-0 z-50 transition-gentle px-6 md:px-12 py-4 ${
				isScrolled ? "bg-white/80 backdrop-blur-md shadow-sm py-3" : "bg-transparent py-6"
			}`}>
			<div className="max-w-7xl mx-auto flex items-center justify-between">
				{/* Logo Section */}
				<Link href="/" className="flex items-center gap-2">
					<Image src="/assets/cropped-SpritansLogo.png" alt="Logo" width={40} height={40} />
					<span className="font-bold text-lg text-primary">Spiritans Sound</span>
				</Link>

				{/* Desktop Navigation */}
				<nav className="hidden lg:flex items-center space-x-8">
					{NAV_ITEMS.map((item) => (
						<div key={item.label} className="relative group">
							<a
								href={item.href}
								className="text-sm font-medium tracking-widest uppercase text-sacred-slate/70 hover:text-sacred-gold transition-gentle">
								{item.label}
							</a>
							{item.children && (
								<div className="absolute top-full left-0 mt-4 w-48 bg-white shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-gentle border-t-2 border-sacred-gold py-2">
									{item.children.map((child) => (
										<a
											key={child.label}
											href={child.href}
											className="block px-4 py-2 text-xs uppercase tracking-widest text-sacred-slate/60 hover:bg-sacred-ivory hover:text-sacred-gold transition-gentle">
											{child.label}
										</a>
									))}
								</div>
							)}
						</div>
					))}

					<a
						href="#/donate"
						className="px-6 py-2 border border-sacred-gold text-sacred-gold text-xs font-semibold tracking-widest uppercase hover:bg-sacred-gold hover:text-white transition-gentle">
						Donate
					</a>
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
				className={`fixed inset-0 bg-white z-[60] transition-gentle transform lg:hidden ${isMobileMenuOpen ? "translate-x-0" : "translate-x-full"}`}>
				<div className="flex flex-col h-full p-8">
					<div className="flex justify-between items-center mb-12">
						<span className="serif text-2xl tracking-widest uppercase">Spiritans</span>
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

					<div className="space-y-6 flex flex-col items-center justify-center flex-grow">
						{NAV_ITEMS.map((item) => (
							<a
								key={item.label}
								href={item.href}
								onClick={() => setIsMobileMenuOpen(false)}
								className="text-2xl serif font-light text-sacred-slate hover:text-sacred-gold transition-gentle">
								{item.label}
							</a>
						))}
						<a
							href="#/donate"
							onClick={() => setIsMobileMenuOpen(false)}
							className="mt-4 px-10 py-3 bg-sacred-gold text-white text-sm font-semibold tracking-widest uppercase hover:bg-sacred-gold/90 transition-gentle">
							Donate
						</a>
					</div>

					<div className="mt-auto text-center text-xs text-sacred-slate/40 tracking-widest uppercase">
						© Spiritans Contemplative Blog
					</div>
				</div>
			</div>
		</header>
	);
};

export default Header;
