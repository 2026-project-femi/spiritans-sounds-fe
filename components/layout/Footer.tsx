import Image from "next/image";
import Link from "next/link";
import React from "react";

const navLinks = [
	{ href: "/", label: "Home" },
	{ href: "/homilies", label: "Homilies" },
	{ href: "/unveiler", label: "Unveiler Magazine" },
	{ href: "/about", label: "About" },
	{ href: "/contact", label: "Contact" },
];

const socialLinks = [
	{ href: "#", label: "FB", name: "Facebook" },
	{ href: "#", label: "TW", name: "Twitter" },
	{ href: "#", label: "IG", name: "Instagram" },
	{ href: "#", label: "YT", name: "YouTube" },
];

const Footer: React.FC = () => {
	return (
		<footer className="bg-[#1a1a1a] text-white pt-20 pb-10 px-6 md:px-12 border-t border-sacred-gold/20">
			<div className="max-w-7xl mx-auto">
				<div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
					<div className="col-span-1 md:col-span-1">
						{/* Logo and Mission */}
						<Link href="/" className="flex items-center gap-2 mb-4">
							<Image src="/assets/cropped-SpritansLogo.png" alt="Logo" width={40} height={40} />
							<span className="font-bold text-lg text-primary">Spiritans Sound</span>
						</Link>
						<p className="text-sm text-gray-400 mb-6 font-light leading-relaxed">
							Bringing you closer to the divine through homilies, reflections, and music.
						</p>
						<div className="flex space-x-6">
							{socialLinks.map((social) => (
								<a
									key={social.name}
									href={social.href}
									target="_blank"
									rel="noopener noreferrer"
									className="text-gray-500 hover:text-sacred-gold text-xs tracking-widest transition-gentle">
									{social.label}
								</a>
							))}
						</div>
					</div>

					<div>
						<h4 className="text-xs font-semibold tracking-widest uppercase mb-6 text-sacred-gold">Navigate</h4>
						<ul className="space-y-4">
							{navLinks.map((link) => (
								<li key={link.href}>
									<Link
										href={link.href}
										className="text-sm text-gray-400 hover:text-white transition-gentle font-light">
										{link.label}
									</Link>
								</li>
							))}
						</ul>
					</div>

					<div>
						<h4 className="text-xs font-semibold tracking-widest uppercase mb-6 text-sacred-gold">Resources</h4>
						<ul className="space-y-4">
							<li>
								<a
									href="#/prayers"
									className="text-sm text-gray-400 hover:text-white transition-gentle font-light">
									Prayers
								</a>
							</li>
							<li>
								<a
									href="#/music"
									className="text-sm text-gray-400 hover:text-white transition-gentle font-light">
									Sacred Music
								</a>
							</li>
							<li>
								<a
									href="#/archives"
									className="text-sm text-gray-400 hover:text-white transition-gentle font-light">
									Homily Archives
								</a>
							</li>
							<li>
								<a
									href="#/events"
									className="text-sm text-gray-400 hover:text-white transition-gentle font-light">
									Calendar
								</a>
							</li>
						</ul>
					</div>

					<div>
						<h4 className="text-xs font-semibold tracking-widest uppercase mb-6 text-sacred-gold">Newsletter</h4>
						<p className="text-xs text-gray-500 mb-6 font-light leading-relaxed">
							Get the latest updates and spiritual insights delivered to your inbox.
						</p>
						<div className="flex flex-col space-y-3">
							<input
								type="email"
								placeholder="Email Address"
								className="bg-transparent border-b border-gray-700 py-2 text-sm focus:outline-none focus:border-sacred-gold transition-gentle"
							/>
							<Link
								href="/newsletter"
								className="text-left text-xs uppercase tracking-widest text-sacred-gold hover:text-white transition-gentle pt-2">
								Subscribe →
							</Link>
						</div>
					</div>
				</div>

				<div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center text-[10px] tracking-[0.2em] uppercase text-gray-600">
					<p>© {new Date().getFullYear()} Spiritual Sound. All rights reserved.</p>
					<div className="flex space-x-8 mt-4 md:mt-0">
						<a href="#" className="hover:text-sacred-gold transition-gentle">
							Privacy Policy
						</a>
						<a href="#" className="hover:text-sacred-gold transition-gentle">
							Terms of Service
						</a>
					</div>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
