import type { Metadata } from 'next'
import { getPublicIntentions } from '@/components/prayer-room/api'
import { IntentionsBoard } from '@/components/prayer-room/IntentionsBoard'
import { PrayerRoomPageHeader } from '@/components/prayer-room/PrayerRoomPageHeader'

export const metadata: Metadata = {
  title: 'Pray for Someone',
  description: 'Take someone’s intention before God. No account needed — simply pray.',
}

export default async function PrayForSomeonePage() {
  const intentions = await getPublicIntentions(50)

  return (
    <>
      <PrayerRoomPageHeader eyebrow="I will pray" title="Pray for Someone">
        Someone asks for prayer. Someone else takes that intention before God.
      </PrayerRoomPageHeader>
      <IntentionsBoard intentions={intentions} />
    </>
  )
}
