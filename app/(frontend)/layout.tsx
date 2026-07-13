import type { Metadata } from "next";
import { Playfair_Display, Montserrat } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const playfair = Playfair_Display({
	subsets: ["latin"],
	weight: ["400", "500", "600", "700", "800", "900"],
	style: ["normal", "italic"],
	variable: "--font-playfair",
	display: "swap",
});

const montserrat = Montserrat({
	subsets: ["latin"],
	weight: ["300", "400", "500", "600"],
	variable: "--font-montserrat",
	display: "swap",
});

export const metadata: Metadata = {
	metadataBase: new URL("https://spiritanssound.com/"), // 🔁 replace with real domain

	title: {
		default: "Spiritans Sound | Faith, Reflection & Sacred Expression",
		template: "%s | Spiritans Sound",
	},

	description:
		"Spiritans Sound is a digital sanctuary of faith, sacred music, reflections, and spiritual growth. Journey deeper into devotion, theology, and community.",

	keywords: [
		"Spiritans Sound",
		"Christian reflections",
		"Sacred music",
		"Catholic spirituality",
		"Homilies",
		"Theological reflections",
		"Faith community",
		"Spiritual growth",
	],

	authors: [{ name: "Spiritans Sound Editorial Team" }],

	creator: "Spiritans Sound",
	publisher: "Spiritans Sound",

	openGraph: {
		type: "website",
		locale: "en_US",
		url: "https://spiritanssound.com/",
		siteName: "Spiritans Sound",
		title: "Spiritans Sound | Faith, Reflection & Sacred Expression",
		description:
			"Discover sacred reflections, Spiritan spirituality, and meaningful community rooted in faith.",
		images: [
			{
				url: "/og-image.jpg",
				width: 1200,
				height: 630,
				alt: "Spiritans Sound - Faith & Reflection",
			},
		],
	},

	twitter: {
		card: "summary_large_image",
		title: "Spiritans Sound | Faith, Reflection & Sacred Expression",
		description:
			"A digital sanctuary for Spiritan reflection and sacred expression.",
		images: ["/og-image.jpg"],
	},

	robots: {
		index: true,
		follow: true,
		googleBot: {
			index: true,
			follow: true,
			"max-video-preview": -1,
			"max-image-preview": "large",
			"max-snippet": -1,
		},
	},

	icons: {
		icon: "/favicon.ico",
		shortcut: "/favicon-16x16.png",
		apple: "/apple-touch-icon.png",
	},
};

export const viewport = {
	themeColor: "#000000",
};

import { CurrencyProvider } from "@/hooks/useCurrency";

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body className={`${playfair.variable} ${montserrat.variable}`}>
				<CurrencyProvider>
					<Header />
					{children}
					<Footer />
				</CurrencyProvider>
			</body>
		</html>
	);
}
