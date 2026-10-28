import type { Metadata } from "next";
import { MentorForm } from "@/components/young-creators/components/MentorForm";
import { submitMentorApplicationAction } from "@/components/young-creators/server/actions";
import { SectionHeading } from "@/components/young-creators/components/primitives";

const title = "Become a Mentor";
const description = "Share your craft and walk alongside a talented young creator through TUYDEF.";

export const metadata: Metadata = {
	title,
	description,
	openGraph: { title, description },
};

export default function MentorPage() {
	return (
		<section className="mx-auto grid max-w-7xl gap-12 px-5 pt-8 lg:grid-cols-[1fr_1.4fr]">
			<div>
				<SectionHeading
					eyebrow="Become a Mentor"
					title="Your experience could change a young life."
					tone="teal"
					intro="Mentors meet regularly with a creator to give feedback, share contacts and help them take the next step."
				/>
				<div className="mt-8 rounded-2xl bg-accent p-6 text-sm text-accent-foreground">
					<p className="font-semibold">How it works</p>
					<ol className="mt-3 list-decimal space-y-1.5 pl-5">
						<li>Apply below</li>
						<li>Short conversation with our team</li>
						<li>Safeguarding checks</li>
						<li>Matched with a creator</li>
					</ol>
				</div>
			</div>
			<MentorForm onSubmit={submitMentorApplicationAction} />
		</section>
	);
}
