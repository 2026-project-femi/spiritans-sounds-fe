import type { Metadata } from "next";
import { OpportunityForm } from "@/components/young-creators/components/OpportunityForm";
import { SectionHeading } from "@/components/young-creators/components/primitives";

const title = "Offer an Opportunity";
const description = "Offer internships, commissions, stages or scholarships to young creators through TUYDEF.";

export const metadata: Metadata = {
	title,
	description,
	openGraph: { title, description },
};

export default function OpportunityPage() {
	return (
		<section className="mx-auto grid max-w-7xl gap-12 px-5 pt-8 lg:grid-cols-[1fr_1.4fr]">
			<div>
				<SectionHeading
					eyebrow="Offer an Opportunity"
					title="Open a door for young talent."
					intro="Internships, commissions, performances, exhibitions, scholarships — tell us what you can offer and we'll match it to the right creators."
				/>
				<p className="mt-8 rounded-2xl bg-accent p-6 text-sm text-accent-foreground">
					For safeguarding, all contact with creators goes through TUYDEF. Parents or guardians are involved for anyone under 18.
				</p>
			</div>
			<OpportunityForm />
		</section>
	);
}
