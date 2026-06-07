"use client";

import Link from "next/link";
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button2";
import { DialogTitle } from "@radix-ui/react-dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

const navLinks = [
    { href: "/", label: "Home" },
    { href: "/homilies", label: "Homilies" },
    { href: "/articles", label: "Articles" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
];

const moreLinks = [
    { href: "/unveiler", label: "TUYDF Events" },
    { href: "/unveiler/issues", label: "Magazine Issues" },
    { href: "/unveiler/books", label: "Book Publishing" },
    { href: "/unveiler/radio", label: "Internet Radio" },
    { href: "/unveiler/adverts", label: "Advertising" },
    { href: "/unveiler/about", label: "About Foundation" },
    { href: "/newsletter", label: "Newsletter" },
];

export default function MobileNav() {
	return (
		<Sheet>
			<SheetTrigger asChild>
				<Button variant="ghost" size="icon" className="md:hidden">
					<Menu />
					<span className="sr-only">Open navigation menu</span>
				</Button>
			</SheetTrigger>

			<SheetContent side="right" className="w-full max-w-sm p-6 bg-background text-foreground">
				<VisuallyHidden>
					<DialogTitle>Mobile Navigation</DialogTitle>
				</VisuallyHidden>

                <div className="flex flex-col h-full">
                    <div className="space-y-4">
                        {navLinks.map((link) => (
                            <SheetClose key={link.href} asChild>
                                <Link href={link.href} className="block text-lg font-medium hover:text-primary transition-colors py-2">
                                    {link.label}
                                </Link>
                            </SheetClose>
                        ))}
                    </div>

                    <hr className="my-6" />

                    <div className="space-y-4">
                        <p className="text-sm font-semibold text-muted-foreground">More</p>
                        {moreLinks.map((link) => (
                            <SheetClose key={link.href} asChild>
                                <Link href={link.href} className="block text-base hover:text-primary transition-colors">
                                    {link.label}
                                </Link>
                            </SheetClose>
                        ))}
                    </div>

                    <div className="mt-auto pt-6">
                        <SheetClose asChild>
                            <Button asChild className="w-full">
                                <Link href="/donations">Donate</Link>
                            </Button>
                        </SheetClose>
                    </div>
                </div>
			</SheetContent>
		</Sheet>
	);
}
