'use client'

import { useMemo, useState } from 'react'
import { IntentionCard } from './IntentionCard'
import type { PrayerIntention } from './types'

interface Props {
  intentions: PrayerIntention[]
}

export function PriorityPrayer({ intentions }: Props) {
  const sorted = useMemo(
    () => [...intentions].sort((a, b) => a.candles - b.candles || a.prayed - b.prayed),
    [intentions],
  )
  const [index, setIndex] = useState(0)

  if (!sorted.length) return null

  const current = sorted[index % sorted.length]

  return (
    <div className="rounded-2xl border border-[#e6ddcb] bg-[#fffdf8] p-5 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-primary">
          A prayer waiting for you
        </p>
        <button
          type="button"
          onClick={() => setIndex((value) => value + 1)}
          className="text-sm text-brand-primary hover:underline"
        >
          Give me someone else →
        </button>
      </div>
      <div className="mt-4">
        <IntentionCard intention={current} />
      </div>
    </div>
  )
}
