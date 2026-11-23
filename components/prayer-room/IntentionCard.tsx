'use client'

import { useEffect, useState } from 'react'
import { recordPrayerAction } from './actions'
import { PrayerCandle } from './PrayerCandle'
import { prayerCategoryLabel } from './schema'
import type { PrayerIntention } from './types'

const PRAYED_KEY = 'prayer-room:prayed'
const CANDLE_KEY = 'prayer-room:candles'

const readIds = (key: string): string[] => {
  try {
    const raw = window.localStorage.getItem(key)
    const parsed = raw ? JSON.parse(raw) : []
    return Array.isArray(parsed) ? parsed.filter((v): v is string => typeof v === 'string') : []
  } catch {
    return []
  }
}

const addId = (key: string, id: string) => {
  const ids = new Set(readIds(key))
  ids.add(id)
  window.localStorage.setItem(key, JSON.stringify([...ids]))
}

interface Props {
  intention: PrayerIntention
  candleLabel?: string
}

export function IntentionCard({ intention, candleLabel = 'Light a Candle — I Have Prayed' }: Props) {
  const [prayed, setPrayed] = useState(intention.prayed)
  const [candles, setCandles] = useState(intention.candles)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [confirmed, setConfirmed] = useState(false)
  const [alreadyPrayed, setAlreadyPrayed] = useState(false)
  const [alreadyCandle, setAlreadyCandle] = useState(false)

  useEffect(() => {
    // Hydrate the visitor's previous actions from localStorage after mount.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setAlreadyPrayed(readIds(PRAYED_KEY).includes(intention.id))
    setAlreadyCandle(readIds(CANDLE_KEY).includes(intention.id))
  }, [intention.id])

  async function act(candle: boolean) {
    setBusy(true)
    setError('')
    try {
      const result = await recordPrayerAction(intention.id, candle ? 'candle' : 'pray')
      if (!result.ok) {
        setError(result.error)
        return
      }
      setPrayed(result.prayed)
      setCandles(result.candles)
      addId(PRAYED_KEY, intention.id)
      setAlreadyPrayed(true)
      if (candle) {
        addId(CANDLE_KEY, intention.id)
        setAlreadyCandle(true)
      }
      setConfirmed(true)
    } catch {
      setError('Your prayer could not be recorded. Please try again.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <article className="flex flex-col rounded-2xl border border-[#e6ddcb] bg-[#fffdf8] p-6 shadow-[0_10px_40px_-18px_rgba(43,33,26,0.25)]">
      <p className="prayer-text flex-1 text-[#2b211a]">{intention.text}</p>
      <p className="mt-3 text-sm italic text-[#6b5f52]">
        {prayerCategoryLabel(intention.category)} • {intention.name}
      </p>
      {intention.status === 'answered' && (
        <p className="mt-3 text-sm font-medium text-brand-primary">🙏 Prayer Answered</p>
      )}

      <div className="mt-5 flex flex-wrap items-center gap-3 border-t border-[#e6ddcb] pt-4">
        <PrayerCandle lit={candles > 0 || alreadyCandle} />
        <p className="flex-1 text-sm text-[#6b5f52]">
          🕯️ {prayed === 1 ? '1 person has' : `${prayed} people have`} prayed for this intention
          {candles > 0 ? ` · ${candles} ${candles === 1 ? 'candle' : 'candles'} lit` : ''}
        </p>
      </div>

      <div className="mt-4 grid gap-2">
        {intention.status !== 'answered' && (
          <button
            type="button"
            disabled={busy || alreadyPrayed}
            onClick={() => act(false)}
            className="rounded-full bg-[#f4e2dc] px-5 py-2.5 text-sm font-medium text-[#8e2330] transition hover:bg-[#efd5cd] disabled:cursor-not-allowed disabled:opacity-60"
          >
            🙏 {alreadyPrayed ? 'You prayed for this' : 'I Will Pray for This'}
          </button>
        )}
        {intention.status !== 'answered' && (
          <button
            type="button"
            disabled={busy || alreadyCandle}
            onClick={() => act(true)}
            className="rounded-full bg-brand-primary px-5 py-2.5 text-sm font-medium text-brand-primary-foreground transition hover:bg-brand-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {busy
              ? 'Offering your prayer…'
              : alreadyCandle
                ? '🕯️ Candle Lit — I Have Prayed'
                : `🕯️ ${candleLabel}`}
          </button>
        )}
        {confirmed && (
          <p role="status" className="text-sm text-brand-primary">
            Your candle is lit. Thank you for carrying this intention in prayer.
          </p>
        )}
        {error && (
          <p role="alert" className="text-sm text-[#b3261e]">
            {error}
          </p>
        )}
      </div>
    </article>
  )
}
