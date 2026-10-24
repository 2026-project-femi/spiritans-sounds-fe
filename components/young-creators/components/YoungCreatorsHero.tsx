/* eslint-disable @next/next/no-img-element */

import { ArrowRight } from "lucide-react";
import { YcnLink, YCN_PATHS, btn } from "./primitives";

export function YoungCreatorsHero({ image }: { image: string }) {
  return (
    <section className="mx-auto max-w-7xl px-5 pt-6">
      <div className="relative overflow-hidden rounded-[2rem] bg-ink">
        <img src={image} alt="Young creators laughing together in an art studio" width={1600} height={1008} className="absolute inset-0 h-full w-full object-cover opacity-60" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/80 to-transparent" />
        <div className="relative max-w-2xl px-7 py-20 md:px-14 md:py-28">
          <p className="yc-rise mb-5 inline-flex rounded-full border border-ink-foreground/25 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-sun">
            A TUYDEF programme
          </p>
          <h1 className="yc-rise text-4xl font-extrabold leading-[1.02] text-ink-foreground md:text-7xl" style={{ animationDelay: "80ms" }}>
            Every gift deserves <span className="text-primary">a stage.</span>
          </h1>
          <p className="yc-rise mt-6 text-lg text-ink-foreground/80 md:text-xl" style={{ animationDelay: "160ms" }}>
            The Young Creators Network discovers talented young people, recognises their gifts, and walks with them through mentoring, development and opportunity.
          </p>
          <div className="yc-rise mt-9 flex flex-wrap gap-3" style={{ animationDelay: "240ms" }}>
            <YcnLink href={YCN_PATHS.directory} className={btn.primary}>Meet the Creators <ArrowRight className="h-4 w-4" /></YcnLink>
            <YcnLink href={YCN_PATHS.support} className={btn.light}>Support Young Creators</YcnLink>
          </div>
        </div>
      </div>
    </section>
  );
}
