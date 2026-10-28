import type { Metadata } from "next";
import {
	getFeaturedCreators,
	getLatestPosts,
	getYcnSettings,
	listCreators,
} from "@/components/young-creators/api";
import { YoungCreatorsHero } from "@/components/young-creators/components/YoungCreatorsHero";
import { JourneySection } from "@/components/young-creators/components/JourneySection";
import { CreatorSpotlight } from "@/components/young-creators/components/CreatorSpotlight";
import { CreatorCard } from "@/components/young-creators/components/CreatorCard";
import { LatestCreators } from "@/components/young-creators/components/LatestCreators";
import { GetInvolved } from "@/components/young-creators/components/GetInvolved";
import { ImpactSection } from "@/components/young-creators/components/ImpactSection";
import { FinalCTA } from "@/components/young-creators/components/FinalCTA";
import { SectionHeading, YcnLink, YCN_PATHS, btn } from "@/components/young-creators/components/primitives";

const title = "Young Creators Network — TUYDEF";
const description =
	"Discovering, mentoring and showcasing talented young writers, musicians, artists, dancers and innovators.";

export const metadata: Metadata = {
	title,
	description,
	openGraph: {
		title,
		description,
		images: [{ url: "/young-creators/hero.jpg", width: 1600, height: 1008 }],
	},
};

export default async function YoungCreatorsPage() {
	const [featured, creators, latest, settings] = await Promise.all([
		getFeaturedCreators(),
		listCreators(),
		getLatestPosts(),
		getYcnSettings(),
	]);

	return (
		<>
			<YoungCreatorsHero image={settings.heroImage.src} />
			<JourneySection />
			{featured[0] && <CreatorSpotlight creator={featured[0]} />}
			<section className="mx-auto max-w-7xl px-5 py-24">
				<div className="flex flex-wrap items-end justify-between gap-4">
					<SectionHeading eyebrow="Meet the creators" title="Young people with something to say." />
					<YcnLink href={YCN_PATHS.directory} className={btn.outline}>View all creators</YcnLink>
				</div>
				<div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
					{creators.slice(0, 4).map((c) => <CreatorCard key={c.id} creator={c} />)}
				</div>
			</section>
			<LatestCreators posts={latest} />
			<GetInvolved />
			<ImpactSection stats={settings.impactStats} image={settings.workshopImage.src} />
			<FinalCTA />
		</>
	);
}
