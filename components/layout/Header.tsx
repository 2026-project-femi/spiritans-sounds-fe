"use client";

import Link from "next/link";
import Image from "next/image";
import {
	NavigationMenu,
	NavigationMenuItem,
	NavigationMenuList,
	NavigationMenuTrigger,
	NavigationMenuContent,
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import MobileNav from "./HeaderMobile";

const navLinks = [
    { href: "/", label: "Home" },
    { href: "/homilies", label: "Homilies" },
    { href: "/articles", label: "Articles" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
];

const moreLinks = [
    { href: "/prayers", label: "Prayers & Devotionals" },
    { href: "/music", label: "Music & Worship" },
    { href: "/news", label: "News / Events" },
    { href: "/radio", label: "🎙 Online Radio" },
    { href: "/newsletter", label: "Newsletter" },
    { href: "/publications", label: "📚 eBooks & Publications" },
];

export default function Header() {
	return (
		<header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
			<div className="container flex h-16 max-w-7xl items-center justify-between">
				{/* Logo */}
				<Link href="/" className="flex items-center gap-2">
					<Image src="/assets/cropped-SpritansLogo.png" alt="Logo" width={40} height={40} />
					<span className="font-bold text-lg text-primary">Spiritual Sound</span>
				</Link>

				{/* Desktop Navigation */}
				<NavigationMenu className="hidden md:flex">
					<NavigationMenuList>
                        {navLinks.map((link) => (
                            <NavLink key={link.href} href={link.href}>
                                {link.label}
                            </NavLink>
                        ))}

						{/* More Dropdown */}
						<NavigationMenuItem>
							<NavigationMenuTrigger>More</NavigationMenuTrigger>
							<NavigationMenuContent>
								<div className="grid w-56 gap-2 p-4">
                                    {moreLinks.map((link) => (
                                        <MenuLink key={link.href} href={link.href}>
                                            {link.label}
                                        </MenuLink>
                                    ))}
                                </div>
							</NavigationMenuContent>
						</NavigationMenuItem>
					</NavigationMenuList>
				</NavigationMenu>

				{/* CTA */}
				<div className="hidden md:flex items-center gap-4">
					<Button asChild>
						<Link href="/donations">Donate</Link>
					</Button>
				</div>

				{/* Mobile */}
				<MobileNav />
			</div>
		</header>
	);
}

/* -------------------------------- */

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
	return (
		<NavigationMenuItem>
			<Link href={href} className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50">
				{children}
			</Link>
		</NavigationMenuItem>
	);
}

function MenuLink({ href, children }: { href: string; children: React.ReactNode }) {
	return (
		<Link href={href} className="rounded-md px-3 py-2 text-sm hover:bg-muted">
			{children}
		</Link>
	);
}

