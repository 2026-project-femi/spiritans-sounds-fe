import type { Metadata } from "next";
import { listClassYears, listCreators } from "@/components/young-creators/api";
import { CreatorDirectory } from "@/components/young-creators/components/CreatorDirectory";
import { CATEGORIES } from "@/components/young-creators/constants";
import type { TalentCategory } from "@/components/young-creators/types";
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

interface Props {
	searchParams: Promise<{ q?: string | string[]; talent?: string | string[]; year?: string | string[] }>;
}

const first = (value: string | string[] | undefined) => (Array.isArray(value) ? value[0] : value);

export default async function CreatorDirectoryPage({ searchParams }: Props) {
	const [creators, years, params] = await Promise.all([
		listCreators(),
		listClassYears(),
		searchParams,
	]);
	const search = first(params.q)?.slice(0, 80) ?? "";
	const talent = first(params.talent);
	const category = CATEGORIES.some((item) => item.value === talent)
		? (talent as TalentCategory)
		: "all";
	const yearParam = Number(first(params.year));
	const classYear = years.includes(yearParam) ? yearParam : "all";

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
						<CreatorDirectory
							creators={creators}
							classYears={years}
							initial={{ search, category, classYear }}
						/>
					</div>
				</section>
			</Reveal>
			<Reveal>
				<FinalCTA />
			</Reveal>
		</>
	);
}
