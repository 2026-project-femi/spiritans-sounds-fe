import { ArrowRight, Briefcase, HandHeart, Users } from "lucide-react";
import { SectionHeading, YcnLink, YCN_PATHS } from "./primitives";

const ITEMS = [
  { icon: HandHeart, title: "Support Young Creators", text: "Fund mentoring, materials and showcase stages.", href: YCN_PATHS.support, tone: "bg-primary text-primary-foreground" },
  { icon: Users, title: "Become a Mentor", text: "Share your craft and walk with a young creator.", href: YCN_PATHS.mentor, tone: "bg-teal text-ink-foreground" },
  { icon: Briefcase, title: "Offer an Opportunity", text: "Internships, commissions, stages and scholarships.", href: YCN_PATHS.opportunity, tone: "bg-sun text-ink" },
];

export function GetInvolved() {
  return (
    <section className="mx-auto max-w-7xl px-5 py-24">
      <SectionHeading eyebrow="Get involved" title="Three ways to open a door." />
      <div className="mt-12 grid gap-5 md:grid-cols-3">
        {ITEMS.map(({ icon: Icon, ...i }) => (
          <YcnLink key={i.title} href={i.href} className="group relative flex flex-col overflow-hidden rounded-3xl bg-gradient-to-br from-card via-card to-secondary/40 p-8 ring-1 ring-border transition-all hover:-translate-y-1 hover:shadow-2xl hover:ring-primary/30">
            <span aria-hidden="true" className={`pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full opacity-15 blur-2xl ${i.tone}`} />
            <span className={`relative grid h-12 w-12 place-items-center rounded-2xl ${i.tone}`}><Icon className="h-6 w-6" /></span>
            <h3 className="relative mt-6 text-2xl font-bold">{i.title}</h3>
            <p className="relative mt-2 flex-1 text-muted-foreground">{i.text}</p>
            <span className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-primary">Get started <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" /></span>
          </YcnLink>
        ))}
      </div>
    </section>
  );
}
