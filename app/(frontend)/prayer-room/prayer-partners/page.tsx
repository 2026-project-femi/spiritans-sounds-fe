import type { Metadata } from 'next'
import Link from 'next/link'
import { getPrayerRoomSettings } from '@/components/prayer-room/api'
import { PrayerRoomPageHeader } from '@/components/prayer-room/PrayerRoomPageHeader'

export const metadata: Metadata = {
  title: 'Prayer Partners',
  description:
    'Commit to praying for intentions, or ask an approved Prayer Partner to accompany you in prayer.',
}

export default async function PrayerPartnersPage() {
  const settings = await getPrayerRoomSettings()

  return (
    <>
      <PrayerRoomPageHeader eyebrow="A deeper ministry" title="Prayer Partners">
        Registered Prayer Partners voluntarily commit to regularly praying for intentions
        submitted to the Prayer Room.
      </PrayerRoomPageHeader>

      <div className="mx-auto grid max-w-5xl gap-5 px-5 md:grid-cols-2">
        <Link
          href="/prayer-room/prayer-partners/request"
          className="rounded-3xl bg-[#2b211a] p-8 text-[#f9f4e9] transition hover:bg-[#3a2c22]"
        >
          <p className="text-xs uppercase tracking-[0.25em] text-[#c9a25a]">Pray with me</p>
          <h2 className="mt-2 text-4xl font-semibold text-[#f9f4e9]">
            I Would Like a Prayer Partner
          </h2>
          <p className="mt-3 text-[#f9f4e9]/80">
            Would you like someone to accompany you personally in prayer for a period of time? You
            may request an approved Spiritans Sound Prayer Partner.
          </p>
          <p className="mt-6 text-[#c9a25a]">Request a Prayer Partner →</p>
        </Link>

        <Link
          href="/prayer-room/prayer-partners/register"
          className="rounded-3xl border border-[#e6ddcb] bg-[#fffdf8] p-8 transition hover:border-brand-primary"
        >
          <p className="text-xs uppercase tracking-[0.25em] text-brand-primary">I will pray</p>
          <h2 className="mt-2 text-4xl font-semibold">Become a Prayer Partner</h2>
          <p className="mt-3 text-[#6b5f52]">
            Offer your prayer for others. All applications are reviewed and approved by the Prayer
            Room team.
          </p>
          <p className="mt-6 text-brand-primary">Apply →</p>
        </Link>
      </div>

      <div className="mx-auto mt-6 flex max-w-5xl flex-wrap gap-3 px-5 text-sm">
        <span className="text-[#6b5f52]">Already a Prayer Partner?</span>
        <a href={settings.contactHref} className="text-brand-primary">
          Contact the prayer team
        </a>
      </div>
    </>
  )
}
