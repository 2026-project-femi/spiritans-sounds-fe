import type { Metadata } from "next";
import { Bricolage_Grotesque, DM_Sans } from "next/font/google";
import NetworkBar from "@/components/layout/NetworkBar";
import { getYcnSettings } from "@/components/young-creators/api";
import { YcnBreadcrumb, YcnFooter, YcnSubNav } from "@/components/young-creators/components/YcnShell";

const bricolage = Bricolage_Grotesque({
	subsets: ["latin"],
	weight: ["500", "600", "700", "800"],
	variable: "--font-bricolage",
	display: "swap",
});

const dmSans = DM_Sans({
	subsets: ["latin"],
	weight: ["400", "500", "600", "700"],
	variable: "--font-dm-sans",
	display: "swap",
});

export const metadata: Metadata = {
	title: {
		default: "Young Creators Network | TUYDEF",
		template: "%s | Young Creators Network",
	},
	description:
		"Discovering, mentoring and showcasing talented young writers, musicians, artists, dancers and innovators through the Treasures Unveiler Youth Development Foundation.",
	openGraph: {
		title: "Young Creators Network | TUYDEF",
		description:
			"Discovering, mentoring and showcasing talented young writers, musicians, artists, dancers and innovators.",
		images: [{ url: "/young-creators/hero.jpg", width: 1600, height: 1008 }],
	},
};

export default async function YoungCreatorsLayout({ children }: { children: React.ReactNode }) {
	const settings = await getYcnSettings();

	return (
		<section
			className={`ycn-theme flex min-h-screen flex-col bg-background text-foreground ${bricolage.variable} ${dmSans.variable}`}
		>
			<NetworkBar current="young-creators" />
			<YcnSubNav />
			<YcnBreadcrumb />
			<main className="flex-1">{children}</main>
			<YcnFooter contact={settings.contact} />
		</section>
	);
}
