import type { Metadata } from 'next'
import Link from 'next/link'
import { getPublicIntentions } from '@/components/prayer-room/api'
// Notification preferences are hidden until user accounts/preferences exist.
// import { NotificationToggles } from '@/components/prayer-room/NotificationToggles'
import { PrayerRoomPageHeader } from '@/components/prayer-room/PrayerRoomPageHeader'

export const metadata: Metadata = {
  title: 'Notifications',
  description: 'Gentle updates from the Prayer Room.',
}

export default async function PrayerNotificationsPage() {
  const recent = await getPublicIntentions(3)

  return (
    <>
      <PrayerRoomPageHeader eyebrow="Gentle updates" title="Notifications" />

      <div className="mx-auto max-w-xl px-5">
        {recent.length > 0 && (
          <div className="mb-8 grid gap-3">
            {recent.map((intention) => (
              <div
                key={intention.id}
                className="rounded-xl border border-[#e6ddcb] bg-[#fffdf8] p-4"
              >
                <p className="prayer-text">{intention.text}</p>
                <p className="mt-3 text-sm text-brand-primary">
                  Someone has asked for prayer in the Prayer Room.
                </p>
                <p className="mt-2 text-sm text-[#6b5f52]">
                  🕯️ {intention.prayed}{' '}
                  {intention.prayed === 1 ? 'person has' : 'people have'} prayed for this
                  intention.
                </p>
                <Link
                  href="/prayer-room/pray"
                  className="mt-3 inline-block text-sm text-brand-primary"
                >
                  Pray for this →
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Hidden until account preferences are implemented.
      <NotificationToggles />
      */}

      <div className="mx-auto mt-8 max-w-xl px-5 text-center">
        <Link href="/prayer-room/chapel" className="text-sm text-brand-primary">
          Enter the Virtual Candle Chapel →
        </Link>
      </div>
    </>
  )
}
