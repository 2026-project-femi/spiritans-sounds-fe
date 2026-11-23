import type { ReactNode } from 'react'

interface Props {
  eyebrow?: string
  title: string
  children?: ReactNode
}

export function PrayerRoomPageHeader({ eyebrow, title, children }: Props) {
  return (
    <section className="pr-glow">
      <div className="mx-auto max-w-3xl px-5 pb-8 pt-14 text-center">
        {eyebrow && (
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-brand-primary">
            {eyebrow}
          </p>
        )}
        <h1 className="mt-3 text-4xl font-semibold text-[#2b211a] md:text-5xl">{title}</h1>
        {children && (
          <div className="mx-auto mt-4 max-w-xl text-[#6b5f52]">{children}</div>
        )}
      </div>
    </section>
  )
}
