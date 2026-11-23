import type { Metadata } from 'next'
import { PartnerRequestForm } from '@/components/prayer-room/PartnerRequestForm'
import { PrayerRoomPageHeader } from '@/components/prayer-room/PrayerRoomPageHeader'

export const metadata: Metadata = {
  title: 'Request a Prayer Partner',
  description:
    'Ask an approved Spiritans Sound Prayer Partner to accompany you personally in prayer.',
}

export default function RequestPrayerPartnerPage() {
  return (
    <>
      <PrayerRoomPageHeader eyebrow="Pray with me" title="I Would Like a Prayer Partner">
        Would you like someone to accompany you personally in prayer for a period of time? You may
        request an approved Spiritans Sound Prayer Partner.
      </PrayerRoomPageHeader>
      <div className="mx-auto max-w-xl px-5">
        <PartnerRequestForm />
      </div>
    </>
  )
}
