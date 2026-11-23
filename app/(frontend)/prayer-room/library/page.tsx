import type { Metadata } from 'next'
import { getPrayerLibrary } from '@/components/prayer-room/api'
import { PrayerLibraryGrid } from '@/components/prayer-room/PrayerLibraryGrid'
import { PrayerRoomPageHeader } from '@/components/prayer-room/PrayerRoomPageHeader'

export const metadata: Metadata = {
  title: 'Prayer Library',
  description:
    'Prayers for every need — healing, family, anxiety, bereavement, the Holy Spirit and more.',
}

export default async function PrayerLibraryPage() {
  const prayers = await getPrayerLibrary(60)

  return (
    <>
      <PrayerRoomPageHeader eyebrow="Help me pray" title="Prayer Library">
        When words are hard to find, pray with the Church.
      </PrayerRoomPageHeader>
      <PrayerLibraryGrid prayers={prayers} />
    </>
  )
}
