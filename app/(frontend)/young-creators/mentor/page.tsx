import type { Metadata } from "next";
import { MentorForm } from "@/components/young-creators/components/MentorForm";
import { submitMentorApplicationAction } from "@/components/young-creators/server/actions";
import { Reveal } from "@/components/young-creators/components/Reveal";
import { Sticker } from "@/components/young-creators/components/primitives";
import { MessageCircle, ShieldCheck, Sparkles, Users } from "lucide-react";
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
		<Reveal>
			<section className="mx-auto grid max-w-7xl gap-12 px-5 pt-8 lg:grid-cols-[1fr_1.4fr]">
				<div>
					<SectionHeading
						eyebrow="Become a Mentor"
						title="Your experience could change a young life."
						tone="teal"
						intro="Mentors meet regularly with a creator to give feedback, share contacts and help them take the next step."
					/>
					<div className="mt-6"><Sticker tone="teal">Mentors wanted</Sticker></div>
					<div className="mt-8 rounded-3xl border border-border bg-card p-6 ring-1 ring-border">
						<div className="flex items-center justify-between gap-3">
							<p className="font-display text-lg font-bold">How it works</p>
							<span className="text-[10px] font-bold uppercase tracking-[0.18em] text-teal">4 steps</span>
						</div>
						<ol className="mt-5 space-y-3">
							{[
								{ icon: Users, title: "Apply below", text: "Tell us about your craft and how you like to work." },
								{ icon: MessageCircle, title: "Short conversation", text: "A relaxed call with the TUYDEF team." },
								{ icon: ShieldCheck, title: "Safeguarding checks", text: "Because some creators are under 18." },
								{ icon: Sparkles, title: "Get matched", text: "We pair you with a creator who needs your experience." },
							].map(({ icon: Icon, title, text }, index) => {
								const tones = ["bg-teal/15 text-teal", "bg-cobalt/10 text-cobalt", "bg-primary/10 text-primary", "bg-lilac/15 text-lilac"];
								return (
									<li key={title} className="flex gap-3">
										<span className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl ${tones[index % tones.length]}`}>
											<Icon className="h-4 w-4" />
										</span>
										<div>
											<p className="font-semibold">{title}</p>
											<p className="text-sm text-muted-foreground">{text}</p>
										</div>
									</li>
								);
							})}
						</ol>
					</div>
					<p className="mt-6 flex items-start gap-2 rounded-2xl bg-accent/60 p-4 text-sm text-foreground/80">
						<ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-teal" />
						All mentoring contact is arranged through TUYDEF. We never share a young person&apos;s personal details.
					</p>
				</div>
				<div className="relative">
					<div aria-hidden="true" className="pointer-events-none absolute -inset-4 rounded-[2.5rem] bg-teal/10 blur-2xl" />
					<div className="relative">
						<MentorForm onSubmit={submitMentorApplicationAction} />
					</div>
				</div>
			</section>
		</Reveal>
	);
}
