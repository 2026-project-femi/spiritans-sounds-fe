'use client'

/* eslint-disable @next/next/no-img-element */

import { useState } from 'react'
import { Play } from 'lucide-react'
import { getYouTubeEmbedUrl } from '@/lib/youtube'
import type { LatestPost } from '../types'
import { YcnLink, YCN_PATHS } from './primitives'

const formatDate = (value: string) =>
  new Date(value).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })

export function UpdateCard({ post }: { post: LatestPost }) {
  const [playing, setPlaying] = useState(false)
  const embedUrl = post.youtubeUrl ? getYouTubeEmbedUrl(post.youtubeUrl, { autoplay: true }) : null
  const hasVideo = Boolean(embedUrl)

  return (
    <article className="group overflow-hidden rounded-3xl bg-card ring-1 ring-border transition-all hover:-translate-y-1 hover:shadow-xl">
      <div className="relative aspect-[16/10] overflow-hidden bg-ink">
        {hasVideo && playing ? (
          <iframe
            src={embedUrl ?? undefined}
            title={post.title}
            loading="lazy"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="h-full w-full"
          />
        ) : (
          <>
            <YcnLink
              href={YCN_PATHS.creator(post.creatorSlug)}
              aria-label={`Read ${post.title}`}
              className="block h-full w-full"
            >
              <img
                src={post.image.src}
                alt={post.image.alt}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </YcnLink>
            {hasVideo && (
              <button
                type="button"
                onClick={() => setPlaying(true)}
                aria-label={`Play video: ${post.title}`}
                className="absolute inset-0 grid place-items-center bg-ink/25 transition-colors hover:bg-ink/35"
              >
                <span className="grid h-14 w-14 place-items-center rounded-full bg-primary text-primary-foreground shadow-2xl transition-transform group-hover:scale-110">
                  <Play className="ml-0.5 h-6 w-6" />
                </span>
              </button>
            )}
          </>
        )}
      </div>

      <div className="p-6">
        <div className="flex items-center gap-2 text-xs">
          <span className="rounded-full bg-accent px-2.5 py-1 font-semibold text-accent-foreground">
            {post.kind}
          </span>
          <span className="text-muted-foreground">{formatDate(post.date)}</span>
        </div>
        <h3 className="mt-3 text-xl font-bold leading-snug">
          <YcnLink
            href={YCN_PATHS.creator(post.creatorSlug)}
            className="transition-colors hover:text-primary"
          >
            {post.title}
          </YcnLink>
        </h3>
        <p className="mt-2 text-sm text-muted-foreground">{post.excerpt}</p>
        {hasVideo && !playing && (
          <button
            type="button"
            onClick={() => setPlaying(true)}
            className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary transition-colors hover:text-primary/80"
          >
            <Play className="h-4 w-4" />
            Watch the video
          </button>
        )}
      </div>
    </article>
  )
}
