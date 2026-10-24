import { YcnLink, YCN_PATHS, btn } from "./primitives";

export function FinalCTA() {
  return (
    <section className="mx-auto max-w-7xl px-5">
      <div className="relative overflow-hidden rounded-[2rem] bg-ink px-7 py-20 text-center text-ink-foreground md:px-16 md:py-28">
        <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-primary/30 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-teal/40 blur-3xl" />
        <div className="relative mx-auto max-w-3xl">
          <h2 className="text-4xl font-extrabold md:text-6xl">Talent Needs <span className="text-sun">Opportunity</span></h2>
          <p className="mt-8 text-lg leading-relaxed text-ink-foreground/85 md:text-xl">
            “Somewhere is a young writer waiting to be read, a musician waiting to be heard, an artist waiting to be seen, a dancer waiting for a stage, or an innovator waiting for the opportunity to build.”
          </p>
          <div className="mt-12 flex flex-wrap justify-center gap-3">
            <YcnLink href={YCN_PATHS.support} className={btn.primary}>Support Young Creators</YcnLink>
            <YcnLink href={YCN_PATHS.mentor} className={btn.light}>Become a Mentor</YcnLink>
            <YcnLink href={YCN_PATHS.opportunity} className={btn.light}>Offer an Opportunity</YcnLink>
            <YcnLink href={YCN_PATHS.directory} className={btn.light}>Meet the Creators</YcnLink>
          </div>
        </div>
      </div>
    </section>
  );
}
