/* eslint-disable @next/next/no-img-element */

import { ArrowDown, ArrowRight, Sparkles } from "lucide-react";
import { YcnLink, YCN_PATHS, btn } from "./primitives";

export function YoungCreatorsHero({ image }: { image: string }) {
  return (
    <section className="mx-auto max-w-7xl px-4 pt-4 sm:px-5">
      <div className="yc-grain relative isolate min-h-[76svh] overflow-hidden rounded-[2rem] bg-ink md:min-h-[82svh] md:rounded-[2.5rem]">
        <img
          src={image}
          alt="Young creators laughing together in an art studio"
          width={1600}
          height={1008}
          className="absolute inset-0 h-full w-full object-cover object-[62%_center] opacity-65"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/85 to-ink/15" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-transparent to-ink/20" />

        <div aria-hidden="true" className="yc-float absolute -right-20 top-10 h-72 w-72 rounded-full bg-cobalt/35 blur-3xl" />
        <div aria-hidden="true" className="absolute -bottom-24 -left-20 h-80 w-80 rounded-full bg-teal/30 blur-3xl" />
        <div aria-hidden="true" className="absolute right-10 top-1/2 hidden h-24 w-24 rounded-full border border-sun/30 md:block" />

        <div className="relative flex min-h-[76svh] flex-col justify-between p-6 md:min-h-[82svh] md:p-14">
          <div className="flex items-start justify-between gap-4">
            <p className="yc-rise inline-flex items-center gap-2 rounded-full border border-ink-foreground/20 bg-ink/30 px-4 py-1.5 text-[10px] font-bold uppercase tracking-[0.24em] text-sun backdrop-blur md:text-xs">
              <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
              A TUYDEF programme
            </p>
            <span className="hidden text-[10px] uppercase tracking-[0.4em] text-ink-foreground/40 [writing-mode:vertical-rl] md:block">
              Vol. 01 — Young Creators
            </span>
          </div>

          <div className="max-w-4xl">
            <h1
              className="yc-rise text-[clamp(2.9rem,8.5vw,7.4rem)] font-extrabold leading-[0.92] tracking-[-0.045em] text-ink-foreground"
              style={{ animationDelay: "80ms" }}
            >
              Every gift
              <br />
              deserves{" "}
              <span className="relative inline-block whitespace-nowrap text-sun">
                a stage.
                <svg
                  aria-hidden="true"
                  viewBox="0 0 300 14"
                  preserveAspectRatio="none"
                  className="absolute -bottom-2 left-0 h-2.5 w-full text-primary md:-bottom-3 md:h-3.5"
                >
                  <path
                    d="M3 10C62 3 186 2 297 8"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="6"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </h1>

            <p
              className="yc-rise mt-7 max-w-2xl text-base leading-relaxed text-ink-foreground/80 md:mt-9 md:text-xl"
              style={{ animationDelay: "160ms" }}
            >
              The Young Creators Network discovers talented young people, recognises their gifts, and
              walks with them through mentoring, development and opportunity.
            </p>

            <div
              className="yc-rise mt-8 flex flex-wrap gap-3 md:mt-10"
              style={{ animationDelay: "240ms" }}
            >
              <YcnLink href={YCN_PATHS.directory} className={`${btn.primary} px-7 py-3.5 text-base`}>
                Meet the creators <ArrowRight className="h-4 w-4" />
              </YcnLink>
              <YcnLink href={YCN_PATHS.support} className={`${btn.light} bg-ink/20 px-7 py-3.5 text-base backdrop-blur`}>
                Support young creators
              </YcnLink>
            </div>
          </div>

          <div className="mt-10 flex flex-wrap items-end justify-between gap-4 border-t border-ink-foreground/15 pt-5 text-[11px] uppercase tracking-[0.16em] text-ink-foreground/55 md:text-xs">
            <span className="inline-flex items-center gap-2">
              <span aria-hidden="true" className="yc-pulse h-2 w-2 rounded-full bg-sun" />
              Discover · Mentor · Showcase
            </span>
            <a
              href="#journey"
              className="inline-flex items-center gap-1.5 font-semibold text-ink-foreground/75 transition-colors hover:text-sun"
            >
              Scroll to explore <ArrowDown className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
