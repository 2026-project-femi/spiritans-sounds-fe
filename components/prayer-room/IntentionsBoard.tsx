'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { BOARD_FILTERS } from './schema'
import { IntentionCard } from './IntentionCard'
import type { PrayerIntention } from './types'

const NEEDING_CANDLE = 'Prayers Needing a Candle'
const FILTERS = [NEEDING_CANDLE, ...BOARD_FILTERS.map((filter) => filter.label)]

interface Props {
  intentions: PrayerIntention[]
}

export function IntentionsBoard({ intentions }: Props) {
  const [filter, setFilter] = useState('All')
  const [picked, setPicked] = useState<PrayerIntention | null>(null)

  const list = useMemo(() => {
    if (filter === NEEDING_CANDLE) {
      return [...intentions].sort((a, b) => a.candles - b.candles || a.prayed - b.prayed)
    }
    const match = BOARD_FILTERS.find((item) => item.label === filter)?.match ?? []
    return intentions.filter((intention) => !match.length || match.includes(intention.category))
  }, [filter, intentions])

  function giveMeSomeone() {
    if (!intentions.length) return
    const pool = [...intentions].sort((a, b) => a.candles - b.candles).slice(0, 12)
    const next = pool[Math.floor(Math.random() * pool.length)]
    setPicked(next ?? null)
  }

  return (
    <div className="mx-auto max-w-6xl px-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          onClick={giveMeSomeone}
          className="rounded-full bg-brand-primary px-6 py-3 text-sm font-medium text-brand-primary-foreground transition hover:bg-brand-primary/90"
        >
          🙏 Give Me Someone to Pray For
        </button>
        <Link
          href="/prayer-room/chapel"
          className="text-sm text-[#8e2330] transition-colors hover:text-[#6f1a25]"
        >
          Enter the Virtual Candle Chapel →
        </Link>
      </div>

      {picked && (
        <div className="mt-6 rounded-2xl border border-brand-primary/20 bg-[#fffdf8] p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-primary">
            Someone to pray for
          </p>
          <div className="mt-4">
            <IntentionCard intention={picked} />
          </div>
          <div className="mt-3 flex flex-wrap gap-3 text-sm">
            <button
              type="button"
              onClick={giveMeSomeone}
              className="text-brand-primary hover:underline"
            >
              Give me someone else
            </button>
            <button
              type="button"
              onClick={() => setPicked(null)}
              className="text-[#6b5f52] hover:underline"
            >
              Close
            </button>
          </div>
        </div>
      )}

      <div className="mt-6 flex gap-2 overflow-x-auto pb-1">
        {FILTERS.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setFilter(item)}
            className={`shrink-0 rounded-full border px-4 py-1.5 text-sm transition ${
              filter === item
                ? 'border-brand-primary bg-brand-primary text-brand-primary-foreground'
                : 'border-[#e6ddcb] bg-[#fffdf8] text-[#6b5f52] hover:text-[#2b211a]'
            }`}
          >
            {item}
          </button>
        ))}
      </div>

      {filter === NEEDING_CANDLE && (
        <p className="mt-4 text-[#6b5f52]">
          No prayer should be forgotten. These intentions are waiting for someone to stand with
          them in prayer.
        </p>
      )}

      <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {list.map((intention) => (
          <IntentionCard key={intention.id} intention={intention} />
        ))}
      </div>

      {!list.length && (
        <p className="mt-10 text-center text-[#6b5f52]">
          No intentions in this area right now. You can still submit one and the team will pray
          with you.
        </p>
      )}
    </div>
  )
}
