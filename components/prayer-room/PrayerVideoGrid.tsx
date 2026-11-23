'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import type { PrayerVideo } from './types'

const inputCls =
  'w-full rounded-lg border border-[#e6ddcb] bg-[#fffdf8] px-3.5 py-2.5 text-base text-[#2b211a] outline-none transition focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20'

const label = (value: string): string =>
  value
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')

interface Props {
  videos: PrayerVideo[]
}

export function PrayerVideoGrid({ videos }: Props) {
  const [query, setQuery] = useState('')
  const [type, setType] = useState('All')

  const types = useMemo(() => ['All', ...new Set(videos.map((video) => video.type))], [videos])

  const list = useMemo(() => {
    const needle = query.trim().toLowerCase()
    return videos.filter(
      (video) =>
        (type === 'All' || video.type === type) &&
        (!needle || video.title.toLowerCase().includes(needle)),
    )
  }, [query, type, videos])

  return (
    <div className="mx-auto max-w-6xl px-5">
      <input
        className={inputCls}
        placeholder="Search videos…"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
      />

      <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
        {types.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setType(item)}
            className={`shrink-0 rounded-full border px-4 py-1.5 text-sm transition ${
              type === item
                ? 'border-brand-primary bg-brand-primary text-brand-primary-foreground'
                : 'border-[#e6ddcb] bg-[#fffdf8] text-[#6b5f52] hover:text-[#2b211a]'
            }`}
          >
            {item === 'All' ? 'All' : label(item)}
          </button>
        ))}
      </div>

      <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((video) => (
          <Link
            key={video.id}
            href={`/prayer-room/videos/${video.youtubeId}`}
            className="overflow-hidden rounded-2xl border border-[#e6ddcb] bg-[#fffdf8] transition hover:shadow-[0_10px_40px_-18px_rgba(43,33,26,0.35)]"
          >
            <div className="relative aspect-video bg-[#efe6d6]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`https://i.ytimg.com/vi/${video.youtubeId}/hqdefault.jpg`}
                alt=""
                loading="lazy"
                className="size-full object-cover"
              />
              {video.duration && (
                <span className="absolute bottom-2 right-2 rounded bg-[#2b211a]/80 px-2 py-0.5 text-xs text-[#f9f4e9]">
                  {video.duration}
                </span>
              )}
            </div>
            <div className="p-5">
              <p className="text-xs font-semibold uppercase tracking-widest text-brand-primary">
                {label(video.type)}
              </p>
              <h3 className="mt-1 text-xl font-semibold leading-snug">{video.title}</h3>
              <p className="mt-1 text-sm text-[#6b5f52]">{video.description}</p>
            </div>
          </Link>
        ))}
      </div>

      {!list.length && (
        <p className="mt-10 text-center text-[#6b5f52]">No videos found.</p>
      )}
    </div>
  )
}
