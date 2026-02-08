import Link from "next/link";
import Image from "next/image";
import { Facebook, Twitter, Instagram, Youtube } from "lucide-react";

const navLinks = [
    { href: "/", label: "Home" },
    { href: "/homilies", label: "Homilies" },
    { href: "/unveiler", label: "Unveiler Magazine" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
];

const socialLinks = [
    { href: "#", icon: Facebook, name: "Facebook" },
    { href: "#", icon: Twitter, name: "Twitter" },
    { href: "#", icon: Instagram, name: "Instagram" },
    { href: "#", icon: Youtube, name: "YouTube" },
];

export default function Footer() {
	return (
		<footer className="bg-gray-100 dark:bg-gray-900 border-t border-border/40">
			<div className="container py-12">
				<div className="grid grid-cols-1 md:grid-cols-4 gap-8">
					{/* Logo and Mission */}
					<div className="md:col-span-1">
						<Link href="/" className="flex items-center gap-2 mb-4">
							<Image src="/assets/cropped-SpritansLogo.png" alt="Logo" width={40} height={40} />
							<span className="font-bold text-lg text-primary">Spiritual Sound</span>
						</Link>
						<p className="text-sm text-muted-foreground">
							Bringing you closer to the divine through homilies, reflections, and music.
						</p>
					</div>

					{/* Quick Links */}
					<div>
						<h3 className="font-semibold mb-4">Quick Links</h3>
						<ul className="space-y-2">
							{navLinks.map((link) => (
								<li key={link.href}>
									<Link href={link.href} className="text-sm text-muted-foreground hover:text-primary">
										{link.label}
									</Link>
								</li>
							))}
						</ul>
					</div>

					{/* Connect With Us */}
					<div>
						<h3 className="font-semibold mb-4">Connect With Us</h3>
                        <div className="flex space-x-4">
                            {socialLinks.map((social) => (
                                <a key={social.name} href={social.href} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary">
                                    <social.icon className="h-6 w-6" />
                                    <span className="sr-only">{social.name}</span>
                                </a>
                            ))}
                        </div>
					</div>

                    {/* Newsletter */}
                    <div>
                        <h3 className="font-semibold mb-4">Subscribe to our Newsletter</h3>
                        <p className="text-sm text-muted-foreground mb-4">
                            Get the latest updates and spiritual insights delivered to your inbox.
                        </p>
                        {/* I'm not implementing the newsletter form now, just a link to the page */}
                        <Link href="/newsletter" className="text-sm font-semibold text-primary hover:underline">
                            Subscribe
                        </Link>
                    </div>
				</div>

				<div className="mt-8 pt-8 border-t border-border/40 text-center text-sm text-muted-foreground">
					<p>&copy; {new Date().getFullYear()} Spiritual Sound. All rights reserved.</p>
				</div>
			</div>
		</footer>
	);
}
