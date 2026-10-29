import { JOURNEY } from "../constants";
import { SectionHeading } from "./primitives";

export function JourneySection() {
  return (
    <section id="journey" className="relative mx-auto max-w-7xl scroll-mt-24 px-5 py-24">
      <SectionHeading eyebrow="More than an award" title={<>From discovery to <span className="text-teal">lasting impact.</span></>} intro="Recognition is only the beginning. Every creator joins an ongoing network built to help their talent grow." />
      <ol className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {JOURNEY.map((j, i) => {
          const tones = ["bg-primary/10 text-primary", "bg-teal/15 text-teal", "bg-cobalt/10 text-cobalt", "bg-lilac/15 text-lilac"];
          return (
            <li key={j.step} className="group relative overflow-hidden rounded-3xl border border-border bg-card p-6 transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl">
              <span className="absolute right-5 top-4 font-display text-5xl font-extrabold text-foreground/5">{String(i + 1).padStart(2, "0")}</span>
              <span className={`grid h-10 w-10 place-items-center rounded-2xl font-display text-sm font-bold ${tones[i % tones.length]}`}>{String(i + 1).padStart(2, "0")}</span>
              <h3 className="mt-5 text-xl font-bold">{j.step}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{j.text}</p>
              {i < JOURNEY.length - 1 && <span className="absolute -right-3 top-1/2 hidden h-px w-6 bg-border lg:block" />}
            </li>
          );
        })}
      </ol>
    </section>
  );
}
