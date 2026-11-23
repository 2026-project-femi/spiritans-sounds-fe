import type { Metadata } from 'next'
import { PartnerApplicationForm } from '@/components/prayer-room/PartnerApplicationForm'
import { PrayerRoomPageHeader } from '@/components/prayer-room/PrayerRoomPageHeader'

export const metadata: Metadata = {
  title: 'Become a Prayer Partner',
  description: 'Apply to become a Registered Prayer Partner with Spiritans Sound.',
}

export default function BecomePrayerPartnerPage() {
  return (
    <>
      <PrayerRoomPageHeader eyebrow="Prayer Partners" title="Become a Prayer Partner">
        Application → Under Review → Approved → Active
      </PrayerRoomPageHeader>
      <div className="mx-auto max-w-xl px-5">
        <PartnerApplicationForm />
      </div>
    </>
  )
}
