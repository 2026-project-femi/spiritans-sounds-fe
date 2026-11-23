import type { Metadata } from 'next'
import { getPrayerVideos } from '@/components/prayer-room/api'
import { PrayerVideoGrid } from '@/components/prayer-room/PrayerVideoGrid'
import { PrayerRoomPageHeader } from '@/components/prayer-room/PrayerRoomPageHeader'

export const metadata: Metadata = {
  title: 'Prayer & Worship Videos',
  description:
    'Pray, worship and reflect with Spiritans Sound videos: Rosary, novenas, Scripture and more.',
}

export default async function PrayerVideosPage() {
  const videos = await getPrayerVideos(60)

  return (
    <>
      <PrayerRoomPageHeader eyebrow="Watch & listen" title="Prayer & Worship Videos" />
      <PrayerVideoGrid videos={videos} />
    </>
  )
}
