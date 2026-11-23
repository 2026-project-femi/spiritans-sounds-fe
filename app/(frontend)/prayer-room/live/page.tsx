import type { Metadata } from 'next'
import Link from 'next/link'
import { getPrayerRoomSettings, getPrayerRooms } from '@/components/prayer-room/api'
import { PrayerRoomPageHeader } from '@/components/prayer-room/PrayerRoomPageHeader'

export const metadata: Metadata = {
  title: 'Live Prayer',
  description:
    'Join A Moment with the Holy Spirit every Friday at 9:00 PM, plus novenas, Rosary and vigils.',
}

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

const platformLabel = (value: string): string => value.replace('-', ' ')

export default async function LivePrayerPage() {
  const [settings, rooms] = await Promise.all([getPrayerRoomSettings(), getPrayerRooms()])
  const featured = rooms[0]
  const rest = rooms.slice(1)

  return (
    <>
      <PrayerRoomPageHeader
        eyebrow={settings.scheduleEyebrow}
        title={settings.scheduleTitle}
        intro={settings.scheduleIntro}
      />
      <div className="mx-auto max-w-5xl px-5">
        <div className="grid overflow-hidden rounded-3xl bg-[#2b211a] text-[#f9f4e9] md:grid-cols-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={featured?.imageUrl ?? settings.heroImageUrl}
            alt={featured?.imageAlt ?? settings.heroImageAlt}
            className="h-64 w-full object-cover md:h-full"
          />
          <div className="p-8">
            <p className="text-xs uppercase tracking-[0.25em] text-[#c9a25a]">Featured</p>
            <h2 className="mt-2 text-4xl font-semibold text-[#f9f4e9]">
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
              {featured?.host ? `Led by ${featured.host}` : 'Led by Spiritans Sound Team'} •{' '}
              {featured ? platformLabel(featured.platform) : 'YouTube Live & Zoom'}
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
                href={settings.contactHref}
                className="mt-6 inline-block rounded-full border border-[#f9f4e9]/30 px-7 py-3 text-sm font-medium transition hover:border-[#c9a25a] hover:text-[#c9a25a]"
              >
                Ask for the link
              </Link>
            )}
          </div>
        </div>

        {rest.length > 0 && (
          <>
            <h2 className="mt-14 text-3xl font-semibold">Upcoming</h2>
            <div className="mt-5 grid gap-4 md:grid-cols-3">
              {rest.map((room) => (
                <div
                  key={room.id}
                  className="flex flex-col rounded-2xl border border-[#e6ddcb] bg-[#fffdf8] p-6"
                >
                  <p className="text-sm text-brand-primary">
                    {DAY_LABELS[room.dayOfWeek] ?? room.dayOfWeek} | {room.startTime} {room.timezone}
                  </p>
                  <h3 className="mt-1 text-2xl font-semibold">{room.title}</h3>
                  <p className="mt-1 flex-1 text-sm text-[#6b5f52]">
                    {room.focus}
                    <br />
                    {room.host ? `${room.host} • ` : ''}
                    {platformLabel(room.platform)}
                  </p>
                  {room.meetingUrl ? (
                    <a
                      href={room.meetingUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 rounded-full border border-[#e6ddcb] px-4 py-2 text-center text-sm transition hover:border-brand-primary"
                    >
                      Join Prayer
                    </a>
                  ) : (
                    <Link
                      href={settings.contactHref}
                      className="mt-4 rounded-full border border-[#e6ddcb] px-4 py-2 text-center text-sm transition hover:border-brand-primary"
                    >
                      Ask for the link
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </>
        )}

        {!rooms.length && (
          <p className="mt-10 text-center text-[#6b5f52]">
            New live prayer times are being confirmed. Check back soon.
          </p>
        )}
      </div>
    </>
  )
}
