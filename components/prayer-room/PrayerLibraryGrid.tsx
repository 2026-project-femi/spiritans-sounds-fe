'use client'

import { useMemo, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import type { PrayerLibraryItem } from './types'

const inputCls =
  'w-full rounded-lg border border-[#e6ddcb] bg-[#fffdf8] px-3.5 py-2.5 text-base text-[#2b211a] outline-none transition focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20'

interface Props {
  prayers: PrayerLibraryItem[]
}

export function PrayerLibraryGrid({ prayers }: Props) {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('All')

  const categories = useMemo(() => {
    const values = [...new Set(prayers.map((prayer) => prayer.category).filter(Boolean))]
    return ['All', ...values] as string[]
  }, [prayers])

  const list = useMemo(() => {
    const needle = query.trim().toLowerCase()
    return prayers.filter((prayer) => {
      const matchesCategory = category === 'All' || prayer.category === category
      const haystack = `${prayer.title} ${prayer.excerpt ?? ''} ${prayer.category ?? ''}`.toLowerCase()
      return matchesCategory && (!needle || haystack.includes(needle))
    })
  }, [category, prayers, query])

  return (
    <div className="mx-auto max-w-5xl px-5">
      <input
        className={inputCls}
        placeholder="Search prayers…"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
      />

      <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
        {categories.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setCategory(item)}
            className={`shrink-0 rounded-full border px-4 py-1.5 text-sm transition ${
              category === item
                ? 'border-brand-primary bg-brand-primary text-brand-primary-foreground'
                : 'border-[#e6ddcb] bg-[#fffdf8] text-[#6b5f52] hover:text-[#2b211a]'
            }`}
          >
            {item}
          </button>
        ))}
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((prayer) => (
          <Link
            key={prayer.id}
            href={`/prayer-room/library/${prayer.slug}`}
            className="group overflow-hidden rounded-2xl border border-[#e6ddcb] bg-[#fffdf8] transition hover:border-brand-primary"
          >
            {prayer.imageUrl && (
              <div className="relative aspect-[16/9] overflow-hidden bg-[#efe6d6]">
                <Image
                  src={prayer.imageUrl}
                  alt={prayer.imageAlt || prayer.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
            )}
            <div className="p-6">
              <p className="text-xs font-semibold uppercase tracking-widest text-brand-primary">
                {prayer.category || 'Prayer'}
              </p>
              <h3 className="mt-2 text-2xl font-semibold">{prayer.title}</h3>
              <p className="mt-2 line-clamp-2 text-sm text-[#6b5f52]">{prayer.excerpt}</p>
            </div>
          </Link>
        ))}
      </div>

      {!list.length && (
        <p className="mt-10 text-center text-[#6b5f52]">No prayers found. More will be added soon.</p>
      )}
    </div>
  )
}
