'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Bell, Menu, X } from 'lucide-react'

const NAV = [
  { href: '/prayer-room', label: 'Prayer Room' },
  { href: '/prayer-room/pray', label: 'Pray for Someone' },
  { href: '/prayer-room/library', label: 'Prayers' },
  { href: '/prayer-room/videos', label: 'Videos' },
  { href: '/prayer-room/live', label: 'Live' },
  { href: '/prayer-room/prayer-partners', label: 'Prayer Partners' },
  { href: '/prayer-room/give-thanks', label: 'Give Thanks' },
]

const isActive = (pathname: string | null, href: string): boolean => {
  if (!pathname) return false
  if (href === '/prayer-room') return pathname === href || pathname === `${href}/`
  return pathname === href || pathname.startsWith(`${href}/`)
}

export function PrayerRoomNav() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-40 border-b border-[#e6ddcb] bg-[#f9f4e9]/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3">
        <Link href="/prayer-room" className="leading-tight" onClick={() => setOpen(false)}>
          <span className="block text-[11px] uppercase tracking-[0.2em] text-[#8a7b68]">
            Spiritans Sound Outreach
          </span>
          <span className="block font-serif text-xl font-semibold text-brand-primary">
            Prayer Room
          </span>
        </Link>

        <nav className="hidden items-center gap-5 text-sm lg:flex" aria-label="Prayer Room">
          {NAV.map((item) => {
            const active = isActive(pathname, item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? 'page' : undefined}
                className={`transition-colors ${
                  active
                    ? 'font-medium text-brand-primary'
                    : 'text-[#6b5f52] hover:text-[#2b211a]'
                }`}
              >
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="flex shrink-0 items-center gap-2">
          <Link
            href="/prayer-room/notifications"
            aria-label="Notifications"
            aria-current={isActive(pathname, '/prayer-room/notifications') ? 'page' : undefined}
            className="rounded-full p-2 text-[#6b5f52] transition-colors hover:bg-[#efe6d6] hover:text-[#2b211a]"
          >
            <Bell className="size-5" />
          </Link>
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-label={open ? 'Close menu' : 'Open menu'}
            className="grid size-10 place-items-center rounded-full text-[#2b211a] transition-colors hover:bg-[#efe6d6] lg:hidden"
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="grid border-t border-[#e6ddcb] bg-[#f9f4e9] px-5 py-3 lg:hidden" aria-label="Prayer Room mobile">
          {NAV.map((item) => {
            const active = isActive(pathname, item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                aria-current={active ? 'page' : undefined}
                className={`py-2.5 text-base ${
                  active ? 'font-medium text-brand-primary' : 'text-[#2b211a]'
                }`}
              >
                {item.label}
              </Link>
            )
          })}
          <Link
            href="/admin"
            onClick={() => setOpen(false)}
            className="py-2.5 text-sm text-[#8a7b68]"
          >
            Admin
          </Link>
        </nav>
      )}
    </header>
  )
}
