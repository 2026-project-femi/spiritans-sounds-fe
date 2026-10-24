import { JOURNEY } from "../constants";
import { SectionHeading } from "./primitives";

export function JourneySection() {
  return (
    <section className="mx-auto max-w-7xl px-5 py-24">
      <SectionHeading eyebrow="More than an award" title={<>From discovery to <span className="text-teal">lasting impact.</span></>} intro="Recognition is only the beginning. Every creator joins an ongoing network built to help their talent grow." />
      <ol className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {JOURNEY.map((j, i) => (
          <li key={j.step} className="group relative rounded-2xl border border-border bg-card p-6 transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg">
            <span className="font-display text-sm font-bold text-primary">{String(i + 1).padStart(2, "0")}</span>
            <h3 className="mt-2 text-xl font-bold">{j.step}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{j.text}</p>
            {i < JOURNEY.length - 1 && <span className="absolute -right-3 top-1/2 hidden h-px w-6 bg-border lg:block" />}
          </li>
        ))}
      </ol>
    </section>
  );
}
