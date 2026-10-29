import type { Metadata } from "next";
import { listClassYears, listCreators } from "@/components/young-creators/api";
import { CreatorDirectory } from "@/components/young-creators/components/CreatorDirectory";
import { FinalCTA } from "@/components/young-creators/components/FinalCTA";
import { Reveal } from "@/components/young-creators/components/Reveal";
import { SectionHeading } from "@/components/young-creators/components/primitives";

const title = "Meet the Creators";
const description =
	"Browse young writers, musicians, artists, photographers, dancers and innovators by talent and class year.";

export const metadata: Metadata = {
	title,
	description,
	openGraph: { title, description },
};

export default async function CreatorDirectoryPage() {
	const [creators, years] = await Promise.all([listCreators(), listClassYears()]);

	return (
		<>
			<Reveal>
				<section className="mx-auto max-w-7xl px-5 pb-24 pt-8">
					<SectionHeading
						eyebrow="Creator directory"
						title="Meet the creators."
						intro="Every creator here was discovered, recognised and brought into the Network. Filter by talent or class year."
						tone="cobalt"
					/>
					<div className="mt-10">
						<CreatorDirectory creators={creators} classYears={years} />
					</div>
				</section>
			</Reveal>
			<Reveal>
				<FinalCTA />
			</Reveal>
		</>
	);
}
