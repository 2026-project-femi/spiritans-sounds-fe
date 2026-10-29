import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
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
import { Marquee } from "@/components/young-creators/components/Marquee";
import { Reveal } from "@/components/young-creators/components/Reveal";
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
			<Marquee
				items={["Writers", "Musicians", "Visual artists", "Photographers", "Dancers", "Digital creators", "Innovators"]}
				className="mt-4"
			/>
			<Reveal>
				<JourneySection />
			</Reveal>
			{featured[0] && (
				<Reveal>
					<CreatorSpotlight creator={featured[0]} />
				</Reveal>
			)}
			<div className="relative border-y border-border bg-secondary/35">
				<div aria-hidden="true" className="yc-dot-grid pointer-events-none absolute inset-0 opacity-60" />
				<Reveal className="relative">
					<section className="mx-auto max-w-7xl px-5 py-24">
						<div className="flex flex-wrap items-end justify-between gap-5">
							<SectionHeading
								eyebrow="Meet the creators"
								title="Young people with something to say."
								tone="cobalt"
								intro="A growing collective of writers, musicians, artists, dancers, photographers and builders."
							/>
							<YcnLink href={YCN_PATHS.directory} className={btn.outline}>View all creators</YcnLink>
						</div>
						<div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
							{creators.slice(0, 3).map((c, index) => (
								<CreatorCard
									key={c.id}
									creator={c}
									feature={index === 0}
									className={index === 0 ? "sm:col-span-2 lg:col-span-2" : ""}
									imageClassName={index === 0 ? "aspect-[16/10] sm:aspect-[16/11]" : "aspect-[4/5]"}
								/>
							))}
							<YcnLink
								href={YCN_PATHS.directory}
								className="group relative flex min-h-[220px] flex-col justify-between overflow-hidden rounded-3xl bg-ink p-8 text-ink-foreground sm:col-span-2 lg:col-span-4 md:flex-row md:items-end"
							>
								<div aria-hidden="true" className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full bg-cobalt/35 blur-3xl" />
								<div aria-hidden="true" className="pointer-events-none absolute -bottom-24 left-1/3 h-64 w-64 rounded-full bg-lilac/25 blur-3xl" />
								<div className="relative max-w-2xl">
									<p className="text-[10px] font-bold uppercase tracking-[0.24em] text-sun">The full collective</p>
									<p className="mt-3 font-display text-3xl font-extrabold leading-[1.02] tracking-[-0.03em] md:text-5xl">
										There are more stories waiting to be seen.
									</p>
								</div>
								<span className={`${btn.sun} relative mt-6 shrink-0 md:mt-0`}>
									Meet all creators <ArrowUpRight className="h-4 w-4 transition-transform group-hover:rotate-45" />
								</span>
							</YcnLink>
						</div>
					</section>
				</Reveal>
			</div>
			<Reveal>
				<div className="bg-teal/5">
					<LatestCreators posts={latest} />
				</div>
			</Reveal>
			<Reveal>
				<div className="bg-sun/10">
					<GetInvolved />
				</div>
			</Reveal>
			<Reveal>
				<ImpactSection stats={settings.impactStats} image={settings.workshopImage.src} />
			</Reveal>
			<Reveal>
				<FinalCTA />
			</Reveal>
		</>
	);
}
