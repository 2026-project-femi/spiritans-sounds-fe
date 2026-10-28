import type { Metadata } from "next";
import { getYcnSettings } from "@/components/young-creators/api";
import { ImpactSection } from "@/components/young-creators/components/ImpactSection";
import { SupportYoungCreators } from "@/components/young-creators/components/SupportYoungCreators";
import { SectionHeading } from "@/components/young-creators/components/primitives";

const title = "Support Young Creators";
const description = "Fund mentoring, creative materials and showcase stages for talented young people.";

export const metadata: Metadata = {
	title,
	description,
	openGraph: { title, description },
};

export default async function SupportPage() {
	const settings = await getYcnSettings();

	return (
		<>
			<section className="mx-auto grid max-w-7xl gap-12 px-5 pt-8 lg:grid-cols-[1fr_1.1fr]">
				<div className="lg:pt-8">
					<SectionHeading
						eyebrow="Support Young Creators"
						title="Help a gift become a future."
						intro="Your gift funds mentoring, tools and stages for young people who've shown extraordinary talent — so recognition becomes real opportunity."
					/>
					<ul className="mt-8 space-y-3 text-foreground/85">
						{[
							"Pair a creator with an experienced mentor",
							"Provide instruments, cameras, laptops and art materials",
							"Put young people on stages, in galleries and in print",
						].map((t) => (
							<li key={t} className="flex gap-3">
								<span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-primary" />
								{t}
							</li>
						))}
					</ul>
				</div>
				<SupportYoungCreators />
			</section>
			<ImpactSection stats={settings.impactStats} image={settings.workshopImage.src} />
		</>
	);
}
