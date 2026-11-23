import type { Metadata } from 'next'
import { getTestimonies } from '@/components/prayer-room/api'
import { PrayerRoomPageHeader } from '@/components/prayer-room/PrayerRoomPageHeader'
import { TestimonyForm } from '@/components/prayer-room/TestimonyForm'

export const metadata: Metadata = {
  title: 'Give Thanks',
  description: 'Share a thanksgiving or testimony for prayers answered and grace received.',
}

export default async function GiveThanksPage() {
  const testimonies = await getTestimonies(30)

  return (
    <>
      <PrayerRoomPageHeader eyebrow="Thanksgiving & testimonies" title="Give Thanks">
        Give thanks to the Lord, for he is good.
      </PrayerRoomPageHeader>

      <div className="mx-auto grid max-w-5xl gap-8 px-5 md:grid-cols-2">
        <div className="space-y-4">
          {testimonies.map((testimony) => (
            <blockquote
              key={testimony.id}
              className="rounded-2xl border border-[#e6ddcb] bg-[#fffdf8] p-6"
            >
              <p className="prayer-text text-lg">“{testimony.text}”</p>
              <cite className="mt-3 block text-sm not-italic text-[#6b5f52]">
                — {testimony.name}
              </cite>
            </blockquote>
          ))}
          {!testimonies.length && (
            <p className="rounded-2xl border border-dashed border-[#e6ddcb] p-6 text-[#6b5f52]">
              Thankful stories will appear here as they are shared and reviewed.
            </p>
          )}
        </div>

        <TestimonyForm />
      </div>
    </>
  )
}
