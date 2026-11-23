import type { Metadata } from 'next'
import Link from 'next/link'
import {
  getIntentionsNeedingCandles,
  getPrayerStats,
  getPublicIntentions,
} from '@/components/prayer-room/api'
import { IntentionCard } from '@/components/prayer-room/IntentionCard'
import { PrayerCandle } from '@/components/prayer-room/PrayerCandle'
import { PrayerRoomPageHeader } from '@/components/prayer-room/PrayerRoomPageHeader'

export const metadata: Metadata = {
  title: 'Candles of Prayer',
  description:
    'Every light represents someone who has stopped to pray for another person in the Spiritans Sound Prayer Room.',
}

export default async function CandleChapelPage() {
  const [intentions, stats, waiting] = await Promise.all([
    getPublicIntentions(30),
    getPrayerStats(),
    getIntentionsNeedingCandles(3),
  ])

  const candles = intentions
    .flatMap((intention) =>
      Array.from({ length: Math.min(intention.candles, 12) }, (_, index) => ({
        key: `${intention.id}-${index}`,
      })),
    )
    .slice(0, 60)

  return (
    <>
      <PrayerRoomPageHeader eyebrow="Virtual Candle Chapel" title="Candles of Prayer">
        Every light represents someone who has stopped to pray for another person.
      </PrayerRoomPageHeader>

      <div className="mx-auto max-w-6xl px-5">
        <div className="grid grid-cols-1 gap-4 border-y border-[#e6ddcb] py-6 text-center sm:grid-cols-3">
          {[
            [stats.totalCandles, 'Candles lit in prayer'],
            [stats.weekPrayers, 'Prayers offered this week'],
            [stats.carried, 'Intentions currently being carried'],
          ].map(([value, label]) => (
            <div key={String(label)}>
              <p className="font-serif text-4xl text-brand-primary">{value}</p>
              <p className="mt-1 text-sm text-[#6b5f52]">{String(label)}</p>
            </div>
          ))}
        </div>

        <section className="my-8 bg-[#2b211a] px-5 py-10 text-center text-[#f9f4e9]">
          <div className="flex min-h-32 flex-wrap items-end justify-center gap-6">
            {candles.map((candle) => (
              <PrayerCandle key={candle.key} large />
            ))}
            {!candles.length && (
              <p className="self-center font-serif text-2xl">
                The chapel is quiet. Offer the first prayer.
              </p>
            )}
          </div>
          <p className="mt-5 text-sm text-[#f9f4e9]/80">
            🕯️ {stats.totalCandles}{' '}
            {stats.totalCandles === 1 ? 'candle has' : 'candles have'} been lit in prayer.
          </p>
        </section>

        <h2 className="text-3xl font-semibold">Prayers Needing a Candle</h2>
        <p className="mt-3 text-[#6b5f52]">
          No prayer should be forgotten. These intentions are waiting for someone to stand with
          them in prayer.
        </p>
        <div className="mt-6 grid gap-5 md:grid-cols-3">
          {waiting.map((intention) => (
            <IntentionCard key={intention.id} intention={intention} />
          ))}
        </div>
        {!waiting.length && (
          <p className="mt-6 text-[#6b5f52]">No public intentions are waiting for a candle right now.</p>
        )}

        <Link href="/prayer-room/pray" className="mt-6 inline-block text-sm text-brand-primary">
          All prayer intentions →
        </Link>
      </div>
    </>
  )
}
