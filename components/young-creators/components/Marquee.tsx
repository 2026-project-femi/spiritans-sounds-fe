interface MarqueeProps {
  items: string[]
  className?: string
}

function Row({ items, hidden = false }: { items: string[]; hidden?: boolean }) {
  return (
    <div
      className="flex shrink-0 items-center gap-7 px-3.5 py-3 md:gap-10 md:px-5 md:py-4"
      aria-hidden={hidden || undefined}
    >
      {items.map((item) => (
        <span key={item} className="flex items-center gap-7 md:gap-10">
          <span className="whitespace-nowrap font-display text-sm font-bold uppercase tracking-[0.18em] text-ink-foreground md:text-base">
            {item}
          </span>
          <span aria-hidden="true" className="h-1.5 w-1.5 rotate-45 bg-sun" />
        </span>
      ))}
    </div>
  )
}

export function Marquee({ items, className = '' }: MarqueeProps) {
  return (
    <div className={`yc-marquee border-y border-ink/10 bg-ink ${className}`}>
      <div className="yc-marquee-track">
        <Row items={items} />
        <Row items={items} hidden />
      </div>
    </div>
  )
}
