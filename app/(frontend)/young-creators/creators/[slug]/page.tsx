import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCreatorBySlug } from "@/components/young-creators/api";
import { CreatorProfile } from "@/components/young-creators/components/CreatorProfile";
import { FinalCTA } from "@/components/young-creators/components/FinalCTA";

interface Props {
	params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const { slug } = await params;
	const creator = await getCreatorBySlug(slug);

	if (!creator) {
		return { title: "Creator not found", robots: { index: false, follow: false } };
	}

	const title = creator.publicDisplayName;
	return {
		title,
		description: creator.tagline,
		robots: creator.isMinor ? { index: false, follow: true } : undefined,
		openGraph: {
			title,
			description: creator.tagline,
			images: [{ url: creator.portrait.src, alt: creator.portrait.alt }],
		},
	};
}

export default async function CreatorProfilePage({ params }: Props) {
	const { slug } = await params;
	const creator = await getCreatorBySlug(slug);

	if (!creator) notFound();

	return (
		<>
			<div className="pt-4">
				<CreatorProfile creator={creator} />
			</div>
			<div className="mt-16">
				<FinalCTA />
			</div>
		</>
	);
}
