/* eslint-disable @next/next/no-img-element */

'use client'

import { useRef, useState } from 'react'
import { ArrowRight, ChevronLeft, ChevronRight, Quote } from 'lucide-react'
import type { Creator } from '../types'
import { categoryLabel } from '../constants'
import { DemoBadge, Eyebrow, Sticker, YcnLink, YCN_PATHS, btn } from './primitives'
import { TalentTags } from './TalentTags'

export function CreatorSpotlight({ creators }: { creators: Creator[] }) {
  const [index, setIndex] = useState(0)
  const startX = useRef<number | null>(null)
  const count = creators.length

  if (!count) return null

  const go = (delta: number) => setIndex((current) => (current + delta + count) % count)
  const active = creators[index] ?? creators[0]

  return (
    <section
      id="spotlight"
      aria-roledescription="carousel"
      aria-label="Featured creators"
      className="relative scroll-mt-24 overflow-hidden bg-ink py-20 text-ink-foreground md:py-24"
    >
      <div aria-hidden="true" className="yc-float pointer-events-none absolute -left-28 top-10 h-72 w-72 rounded-full bg-cobalt/25 blur-3xl" />
      <div aria-hidden="true" className="pointer-events-none absolute -bottom-24 -right-20 h-80 w-80 rounded-full bg-lilac/20 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-5">
        <div className="flex flex-wrap items-end justify-between gap-5">
          <div>
            <Eyebrow tone="sun">Creator spotlight</Eyebrow>
            <p className="text-sm text-ink-foreground/55">Meet the class, one story at a time.</p>
          </div>
          {count > 1 && (
            <div className="flex items-center gap-2">
              <span className="mr-1 font-mono text-xs text-ink-foreground/50" aria-live="polite">
                {String(index + 1).padStart(2, '0')} / {String(count).padStart(2, '0')}
              </span>
              <button
                type="button"
                onClick={() => go(-1)}
                aria-label="Previous creator"
                className="grid h-10 w-10 place-items-center rounded-full border border-ink-foreground/25 text-ink-foreground transition-colors hover:bg-ink-foreground/10"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={() => go(1)}
                aria-label="Next creator"
                className="grid h-10 w-10 place-items-center rounded-full border border-ink-foreground/25 text-ink-foreground transition-colors hover:bg-ink-foreground/10"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          )}
        </div>

        <div
          className="mt-8 grid touch-pan-y"
          onPointerDown={(event) => {
            startX.current = event.clientX
          }}
          onPointerUp={(event) => {
            if (startX.current === null) return
            const delta = event.clientX - startX.current
            if (Math.abs(delta) > 50) go(delta > 0 ? -1 : 1)
            startX.current = null
          }}
          onPointerCancel={() => {
            startX.current = null
          }}
        >
          {creators.map((creator, slideIndex) => {
            const isActive = slideIndex === index
            const quote = creator.interview[0]
            return (
              <div
                key={creator.id}
                role="group"
                aria-roledescription="slide"
                aria-label={`${slideIndex + 1} of ${count}: ${creator.publicDisplayName}`}
                aria-hidden={!isActive}
                className={`col-start-1 row-start-1 grid items-center gap-12 transition-all duration-700 md:grid-cols-2 ${
                  isActive ? 'z-10 opacity-100' : 'pointer-events-none translate-x-3 opacity-0'
                }`}
              >
                <div className="relative">
                  <div aria-hidden="true" className="absolute -inset-2 -rotate-2 rounded-[2.2rem] border border-sun/30" />
                  <img
                    src={creator.portrait.src}
                    alt={creator.portrait.alt}
                    loading={slideIndex === 0 ? 'eager' : 'lazy'}
                    width={800}
                    height={1008}
                    className="relative aspect-[4/5] w-full rounded-[2rem] object-cover"
                  />
                  <Sticker tone="primary" className="absolute -bottom-5 -right-3 md:-right-6">
                    Creator spotlight
                  </Sticker>
                </div>

                <div>
                  <Eyebrow tone="sun">
                    {categoryLabel(creator.primaryCategory)} · Class of {creator.classYear}
                  </Eyebrow>
                  <h2 className="flex flex-wrap items-center gap-3 break-words text-4xl font-extrabold tracking-[-0.035em] md:text-6xl">
                    {creator.publicDisplayName} <DemoBadge when={creator.isDemo} />
                  </h2>
                  <p className="mt-4 text-xl text-ink-foreground/80">{creator.tagline}</p>
                  {quote && (
                    <blockquote className="mt-8 rounded-r-3xl border-l-2 border-primary bg-white/5 py-2 pl-6 pr-4">
                      <Quote className="mb-2 h-6 w-6 text-primary" />
                      <p className="text-lg italic text-ink-foreground/90">&ldquo;{quote.answer}&rdquo;</p>
                    </blockquote>
                  )}
                  <div className="mt-8">
                    <TalentTags tags={creator.talents} size="md" />
                  </div>
                  <YcnLink
                    href={YCN_PATHS.creator(creator.slug)}
                    tabIndex={isActive ? 0 : -1}
                    className={`${btn.primary} mt-10`}
                  >
                    Read {creator.publicDisplayName.split(' ')[0]}&apos;s story <ArrowRight className="h-4 w-4" />
                  </YcnLink>
                </div>
              </div>
            )
          })}
        </div>

        {count > 1 && (
          <div className="mt-8 flex justify-center gap-2">
            {creators.map((creator, slideIndex) => (
              <button
                key={creator.id}
                type="button"
                onClick={() => setIndex(slideIndex)}
                aria-label={`Show ${creator.publicDisplayName}`}
                aria-current={slideIndex === index ? 'true' : undefined}
                className={`h-2 rounded-full transition-all ${
                  slideIndex === index ? 'w-8 bg-sun' : 'w-2 bg-ink-foreground/30 hover:bg-ink-foreground/60'
                }`}
              />
            ))}
          </div>
        )}

        <p className="mt-6 text-center text-xs text-ink-foreground/40" aria-live="polite">
          {active.publicDisplayName} · {categoryLabel(active.primaryCategory)} · Class of {active.classYear}
        </p>
      </div>
    </section>
  )
}
