'use client'

import { useEffect, useState } from 'react'

export type ProfileSection = readonly [id: string, label: string]

interface ProfileNavProps {
  items: readonly ProfileSection[]
  variant?: 'sidebar' | 'mobile'
}

export function ProfileNav({ items, variant = 'sidebar' }: ProfileNavProps) {
  const [active, setActive] = useState(items[0]?.[0] ?? '')

  useEffect(() => {
    if (!('IntersectionObserver' in window)) return

    const nodes = items
      .map(([id]) => document.getElementById(id))
      .filter((node): node is HTMLElement => Boolean(node))

    if (!nodes.length) return

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (visible) setActive(visible.target.id)
      },
      { rootMargin: '-20% 0px -60% 0px', threshold: [0, 0.25, 0.5, 0.75] },
    )

    nodes.forEach((node) => observer.observe(node))
    return () => observer.disconnect()
  }, [items])

  if (variant === 'mobile') {
    return (
      <nav
        aria-label="Profile sections"
        className="sticky top-[72px] z-30 -mx-5 flex gap-2 overflow-x-auto border-b border-border bg-background/95 px-5 py-3 backdrop-blur lg:hidden [scrollbar-width:none]"
      >
        {items.map(([id, label]) => (
          <a
            key={id}
            href={`#${id}`}
            aria-current={active === id ? 'location' : undefined}
            className={`whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
              active === id
                ? 'bg-ink text-ink-foreground'
                : 'bg-secondary text-foreground/70 hover:text-foreground'
            }`}
          >
            {label}
          </a>
        ))}
      </nav>
    )
  }

  return (
    <nav aria-label="Profile sections" className="space-y-1 text-sm">
      {items.map(([id, label]) => (
        <a
          key={id}
          href={`#${id}`}
          aria-current={active === id ? 'location' : undefined}
          className={`block rounded-xl px-3 py-2 transition-colors ${
            active === id
              ? 'bg-ink font-semibold text-ink-foreground'
              : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
          }`}
        >
          {label}
        </a>
      ))}
    </nav>
  )
}
