import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { Cormorant_Garamond, Karla } from 'next/font/google'
import NetworkBar from '@/components/layout/NetworkBar'
import { getPrayerRoomSettings } from '@/components/prayer-room/api'
import { PrayerRoomNav } from '@/components/prayer-room/PrayerRoomNav'
import { PrayerRoomFooter } from '@/components/prayer-room/PrayerRoomFooter'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  variable: '--font-cormorant',
  display: 'swap',
})

const karla = Karla({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-karla',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'Spiritans Sound Prayer Room',
    template: '%s — Spiritans Sound Prayer Room',
  },
  description:
    'A place to pray, a place to be prayed for. A community united in prayer — open 24/7.',
}

export default async function PrayerRoomLayout({ children }: { children: ReactNode }) {
  const settings = await getPrayerRoomSettings()

  return (
    <section
      className={`prayer-room-theme ${cormorant.variable} ${karla.variable} flex min-h-screen flex-col`}
    >
      <NetworkBar current="prayer-room" />
      <PrayerRoomNav />
      <main className="flex-1">{children}</main>
      <PrayerRoomFooter contactLabel={settings.contactLabel} contactHref={settings.contactHref} />
    </section>
  )
}
