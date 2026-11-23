import type { Metadata } from 'next'
import { getPrayerLibrary, getPrayerRoomSettings } from '@/components/prayer-room/api'
import { PrayerLibraryGrid } from '@/components/prayer-room/PrayerLibraryGrid'
import { PrayerRoomPageHeader } from '@/components/prayer-room/PrayerRoomPageHeader'

export const metadata: Metadata = {
  title: 'Prayer Library',
  description:
    'Prayers for every need — healing, family, anxiety, bereavement, the Holy Spirit and more.',
}

export default async function PrayerLibraryPage() {
  const [prayers, settings] = await Promise.all([
    getPrayerLibrary(60),
    getPrayerRoomSettings(),
  ])

  return (
    <>
      <PrayerRoomPageHeader
        eyebrow={settings.resourcesEyebrow}
        title={settings.resourcesTitle}
        intro={settings.resourcesIntro}
      />
      <PrayerLibraryGrid prayers={prayers} />
    </>
  )
}
