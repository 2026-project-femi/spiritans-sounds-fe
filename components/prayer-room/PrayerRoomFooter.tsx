import Link from 'next/link'
import { Mail } from 'lucide-react'

interface Props {
  contactLabel: string
  contactHref: string
}

export function PrayerRoomFooter({ contactLabel, contactHref }: Props) {
  const contactIsExternal = /^https?:|^mailto:|^tel:/i.test(contactHref)

  return (
    <footer className="mt-24 bg-[#2b211a] text-[#f9f4e9]">
      <div className="mx-auto grid max-w-6xl gap-8 px-5 py-12 md:grid-cols-3">
        <div>
          <p className="font-serif text-2xl font-semibold">Spiritans Sound Outreach</p>
          <p className="mt-2 text-sm text-[#f9f4e9]/70">
            There is a community willing to pray with you.
          </p>
          <p className="mt-4 font-serif text-sm italic text-[#c9a25a]">
            A place to pray. A place to be prayed for. A community united in prayer.
          </p>
        </div>

        <div className="grid content-start gap-1.5 text-sm text-[#f9f4e9]/80">
          <Link href="/prayer-room/intentions" className="transition-colors hover:text-[#c9a25a]">
            Submit an intention
          </Link>
          <Link href="/prayer-room/chapel" className="transition-colors hover:text-[#c9a25a]">
            Enter the Virtual Candle Chapel
          </Link>
          <Link
            href="/prayer-room/prayer-partners/request"
            className="transition-colors hover:text-[#c9a25a]"
          >
            Request a Prayer Partner
          </Link>
          <Link
            href="/prayer-room/prayer-partners/register"
            className="transition-colors hover:text-[#c9a25a]"
          >
            Become a Prayer Partner
          </Link>
          {/* Notifications hidden until account preferences are implemented.
          <Link href="/prayer-room/notifications" className="transition-colors hover:text-[#c9a25a]">
            Notifications
          </Link>
          */}
          <Link href="/admin" className="transition-colors hover:text-[#c9a25a]">
            Administration
          </Link>
        </div>

        <div className="text-sm text-[#f9f4e9]/60">
          <p>Personal details are never shown publicly.</p>
          <div className="mt-4">
            {contactIsExternal ? (
              <a
                href={contactHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-[#f9f4e9]/80 transition-colors hover:text-[#c9a25a]"
              >
                <Mail className="size-4" />
                {contactLabel}
              </a>
            ) : (
              <Link
                href={contactHref}
                className="inline-flex items-center gap-2 text-[#f9f4e9]/80 transition-colors hover:text-[#c9a25a]"
              >
                <Mail className="size-4" />
                {contactLabel}
              </Link>
            )}
          </div>
        </div>
      </div>

      <div className="border-t border-[#f9f4e9]/10 px-5 py-5 text-xs text-[#f9f4e9]/40">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 sm:flex-row">
          <span>© {new Date().getFullYear()} Spiritans Sound Outreach</span>
          <nav aria-label="Legal" className="flex items-center gap-5">
            <Link href="/privacy" className="transition-colors hover:text-[#f9f4e9]">
              Privacy
            </Link>
            <Link href="/terms" className="transition-colors hover:text-[#f9f4e9]">
              Terms
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  )
}
