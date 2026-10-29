import type { Metadata } from "next";
import { OpportunityForm } from "@/components/young-creators/components/OpportunityForm";
import { submitOpportunityAction } from "@/components/young-creators/server/actions";
import { Reveal } from "@/components/young-creators/components/Reveal";
import { Sticker } from "@/components/young-creators/components/primitives";
import { Briefcase, GraduationCap, Mic2, Palette, ShieldCheck } from "lucide-react";
import { SectionHeading } from "@/components/young-creators/components/primitives";

const title = "Offer an Opportunity";
const OPPORTUNITY_CARDS = [
	{ icon: Briefcase, label: "Internships" },
	{ icon: Mic2, label: "Performances" },
	{ icon: Palette, label: "Commissions" },
	{ icon: GraduationCap, label: "Scholarships" },
] as const;
const description = "Offer internships, commissions, stages or scholarships to young creators through TUYDEF.";

export const metadata: Metadata = {
	title,
	description,
	openGraph: { title, description },
};

export default function OpportunityPage() {
	return (
		<Reveal>
			<section className="mx-auto grid max-w-7xl gap-12 px-5 pt-8 lg:grid-cols-[1fr_1.4fr]">
				<div>
					<SectionHeading
						eyebrow="Offer an Opportunity"
						title="Open a door for young talent."
						tone="cobalt"
						intro="Internships, commissions, performances, exhibitions, scholarships — tell us what you can offer and we'll match it to the right creators."
					/>
					<div className="mt-6"><Sticker tone="cobalt">Open a door</Sticker></div>
					<div className="mt-8 grid grid-cols-2 gap-3">
						{OPPORTUNITY_CARDS.map(({ icon: Icon, label }, index) => {
							const tones = ["bg-cobalt/10 text-cobalt", "bg-lilac/15 text-lilac", "bg-primary/10 text-primary", "bg-teal/15 text-teal"];
							return (
								<div key={label} className="rounded-2xl border border-border bg-card p-4 ring-1 ring-border">
									<span className={`grid h-9 w-9 place-items-center rounded-xl ${tones[index % tones.length]}`}>
										<Icon className="h-4 w-4" />
									</span>
									<p className="mt-3 text-sm font-semibold">{label}</p>
								</div>
							);
						})}
					</div>
					<p className="mt-6 flex items-start gap-2 rounded-2xl bg-accent/60 p-4 text-sm text-foreground/80">
						<ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-teal" />
						For safeguarding, all contact with creators goes through TUYDEF. Parents or guardians are involved for anyone under 18.
					</p>
				</div>
				<div className="relative">
					<div aria-hidden="true" className="pointer-events-none absolute -inset-4 rounded-[2.5rem] bg-cobalt/10 blur-2xl" />
					<div className="relative">
						<OpportunityForm onSubmit={submitOpportunityAction} />
					</div>
				</div>
			</section>
		</Reveal>
	);
}
