import type { Metadata } from 'next'
import Link from 'next/link'
import {
  getPrayerRoomSettings,
  getPrayerRooms,
  getPrayerStats,
  getPublicIntentions,
} from '@/components/prayer-room/api'
import { IntentionCard } from '@/components/prayer-room/IntentionCard'
import { PriorityPrayer } from '@/components/prayer-room/PriorityPrayer'

const CORE = [
  { title: 'I Need Prayer', description: 'Submit an intention', href: '/prayer-room/intentions' },
  { title: 'I Will Pray', description: 'Pray for someone', href: '/prayer-room/pray' },
  {
    title: 'Pray With Me',
    description: 'Request a Prayer Partner',
    href: '/prayer-room/prayer-partners/request',
  },
  {
    title: 'Help Me Pray',
    description: 'Prayers, videos & live prayer',
    href: '/prayer-room/library',
  },
]

const ACTIONS = [
  ['Submit a Prayer Intention', '/prayer-room/intentions'],
  ['Pray for Someone', '/prayer-room/pray'],
  ['Find a Prayer', '/prayer-room/library'],
  ['Prayer & Worship Videos', '/prayer-room/videos'],
  ['Request a Prayer Partner', '/prayer-room/prayer-partners/request'],
  ['Become a Prayer Partner', '/prayer-room/prayer-partners/register'],
  ['Join Live Prayer', '/prayer-room/live'],
] as const

const DAY_LABELS: Record<string, string> = {
  daily: 'Every day',
  sunday: 'Sunday',
  monday: 'Monday',
  tuesday: 'Tuesday',
  wednesday: 'Wednesday',
  thursday: 'Thursday',
  friday: 'Friday',
  saturday: 'Saturday',
}

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getPrayerRoomSettings()
  return {
    title: { absolute: settings.metaTitle || settings.title },
    description: settings.metaDescription || settings.description,
  }
}

export default async function PrayerRoomHomePage() {
  const [settings, rooms, intentions, stats] = await Promise.all([
    getPrayerRoomSettings(),
    getPrayerRooms(),
    getPublicIntentions(6),
    getPrayerStats(),
  ])

  const featured = rooms[0]
  const recent = intentions.slice(0, 3)

  return (
    <>
      <section className="relative overflow-hidden bg-[#2b211a]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={settings.heroImageUrl}
          alt={settings.heroImageAlt}
          className="absolute inset-0 size-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#2b211a]/75 via-[#2b211a]/55 to-[#f9f4e9]" />

        <div className="relative mx-auto max-w-3xl px-5 pb-24 pt-24 text-center text-[#f9f4e9]">
          <p className="text-xs uppercase tracking-[0.3em] text-[#f9f4e9]/80">{settings.eyebrow}</p>
          <h1 className="mt-4 text-5xl font-semibold leading-tight text-[#f9f4e9] md:text-7xl">
            {settings.title}
          </h1>
          <p className="mt-4 font-serif text-xl italic md:text-2xl">{settings.description}</p>
          <p className="mx-auto mt-6 max-w-xl text-[#f9f4e9]/90">{settings.heroQuote}</p>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="/prayer-room/intentions"
              className="rounded-full bg-brand-primary px-6 py-3 text-sm font-medium text-brand-primary-foreground transition hover:bg-brand-primary/90"
            >
              Submit a Prayer Intention
            </Link>
            <Link
              href="/prayer-room/pray"
              className="rounded-full border border-[#f9f4e9]/40 bg-[#2b211a]/30 px-6 py-3 text-sm font-medium backdrop-blur transition hover:bg-[#2b211a]/50"
            >
              Pray for Someone
            </Link>
          </div>
        </div>
      </section>

      <section className="relative z-10 mx-auto -mt-10 grid max-w-6xl grid-cols-2 gap-3 px-5 md:grid-cols-4">
        {CORE.map((card) => (
          <Link
            key={card.title}
            href={card.href}
            className="rounded-2xl border border-[#e6ddcb] bg-[#fffdf8] p-5 shadow-[0_10px_40px_-18px_rgba(43,33,26,0.3)] transition hover:-translate-y-0.5 hover:border-brand-primary/40"
          >
            <p className="font-serif text-2xl font-semibold text-brand-primary">{card.title}</p>
            <p className="mt-1 text-sm text-[#6b5f52]">{card.description}</p>
          </Link>
        ))}
      </section>

      <section className="mx-auto mt-10 max-w-6xl px-5">
        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-center text-sm text-[#6b5f52]">
          <span>🕯️ {stats.totalCandles} candles lit in prayer.</span>
          <span>{stats.todayPrayers} prayers offered today.</span>
          <span>{stats.weekPrayers} prayers offered this week.</span>
        </div>
      </section>

      <section className="mx-auto mt-8 max-w-6xl px-5">
        <PriorityPrayer intentions={intentions} />
      </section>

      <section className="mx-auto mt-14 max-w-6xl px-5">
        <div className="grid overflow-hidden rounded-3xl bg-[#2b211a] text-[#f9f4e9] md:grid-cols-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={featured?.imageUrl ?? settings.heroImageUrl}
            alt={featured?.imageAlt ?? settings.heroImageAlt}
            className="h-64 w-full object-cover md:h-full"
          />
          <div className="p-8 md:p-10">
            <p className="text-xs uppercase tracking-[0.25em] text-[#c9a25a]">Live every week</p>
            <h2 className="mt-2 text-4xl font-semibold text-[#f9f4e9] md:text-5xl">
              {featured?.title ?? 'A Moment with the Holy Spirit'}
            </h2>
            <p className="mt-2 text-xl">
              {featured
                ? `${DAY_LABELS[featured.dayOfWeek] ?? featured.dayOfWeek} | ${featured.startTime} ${featured.timezone}`
                : 'Every Friday | 9:00 PM'}
            </p>
            <p className="mt-4 font-serif text-lg italic text-[#f9f4e9]/90">
              {featured?.focus ?? '“Come, Holy Spirit, renew our hearts”'}
            </p>
            <p className="mt-3 text-sm text-[#f9f4e9]/75">
              {featured?.host ? `Led by ${featured.host}` : 'Led by Spiritans Sound Team'}
              {featured ? ` • ${featured.platform.replace('-', ' ')}` : ''}
            </p>
            {featured?.meetingUrl ? (
              <a
                href={featured.meetingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-block rounded-full bg-brand-primary px-7 py-3 text-sm font-medium text-brand-primary-foreground transition hover:bg-brand-primary/90"
              >
                Join Prayer
              </a>
            ) : (
              <Link
                href="/prayer-room/live"
                className="mt-6 inline-block rounded-full border border-[#f9f4e9]/30 px-7 py-3 text-sm font-medium transition hover:border-[#c9a25a] hover:text-[#c9a25a]"
              >
                Live Prayer details
              </Link>
            )}
          </div>
        </div>
      </section>

      <section className="mx-auto mt-16 max-w-6xl px-5">
        <div className="flex items-end justify-between">
          <h2 className="text-3xl font-semibold">Intentions awaiting prayer</h2>
          <Link href="/prayer-room/pray" className="text-sm text-brand-primary">
            See all →
          </Link>
        </div>
        <div className="mt-6 grid gap-5 md:grid-cols-3">
          {recent.map((intention) => (
            <IntentionCard key={intention.id} intention={intention} />
          ))}
        </div>
        {!recent.length && (
          <p className="mt-6 text-[#6b5f52]">
            The board is quiet right now. Submit an intention and the community will pray with
            you.
          </p>
        )}
      </section>

      <section className="mx-auto mt-16 max-w-6xl px-5">
        <h2 className="text-center text-3xl font-semibold">Enter the Prayer Room</h2>
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {ACTIONS.map(([label, href]) => (
            <Link
              key={label}
              href={href}
              className="flex items-center justify-between rounded-xl border border-[#e6ddcb] bg-[#fffdf8] px-5 py-4 text-sm transition hover:border-brand-primary"
            >
              <span>{label}</span>
              <span className="text-brand-primary">→</span>
            </Link>
          ))}
        </div>
      </section>

      <p className="mx-auto mt-20 max-w-2xl px-5 text-center font-serif text-2xl italic text-[#6b5f52]">
        Someone asks for prayer. Someone else willingly takes that intention before God.
      </p>
    </>
  )
}
