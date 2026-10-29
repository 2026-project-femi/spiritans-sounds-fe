/* eslint-disable @next/next/no-img-element */

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
  const embedUrl = post.youtubeUrl ? getYouTubeEmbedUrl(post.youtubeUrl) : null

  return (
    <article className="group overflow-hidden rounded-3xl bg-card ring-1 ring-border transition-all hover:-translate-y-1 hover:shadow-xl">
      <div className="relative aspect-[16/10] overflow-hidden bg-ink">
        {embedUrl ? (
          <iframe
            src={embedUrl}
            title={post.title}
            loading="lazy"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="h-full w-full"
          />
        ) : (
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
      </div>
    </article>
  )
}
