import type { Metadata } from 'next'
import { getPrayerRoomSettings } from '@/components/prayer-room/api'
import { PrayerRequestForm } from '@/components/prayer-room/PrayerRequestForm'
import { PrayerRoomPageHeader } from '@/components/prayer-room/PrayerRoomPageHeader'

export const metadata: Metadata = {
  title: 'Submit a Prayer Intention',
  description:
    'Leave your prayer intention with the Spiritans Sound community. Every intention is reviewed with care.',
}

export default async function SubmitPrayerIntentionPage() {
  const settings = await getPrayerRoomSettings()

  return (
    <>
      <PrayerRoomPageHeader eyebrow="I need prayer" title="Submit a Prayer Intention">
        You do not have to carry it alone. Every intention is gently reviewed before it is shared.
      </PrayerRoomPageHeader>
      <div className="mx-auto max-w-xl px-5">
        <PrayerRequestForm successMessage={settings.requestSuccessMessage} />
      </div>
    </>
  )
}
