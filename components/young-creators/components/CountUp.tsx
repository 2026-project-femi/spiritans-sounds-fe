'use client'

import { useEffect, useRef, useState } from 'react'

const NUMBER = /^(\D*)(\d[\d,]*)(.*)$/

interface CountUpProps {
  value: string
  className?: string
  duration?: number
}

/** Animates the leading number in a display string, e.g. "120+" or "8". */
export function CountUp({ value, className = '', duration = 1400 }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const [display, setDisplay] = useState(value)
  const match = value.match(NUMBER)
  const prefix = match?.[1] ?? ''
  const suffix = match?.[3] ?? ''
  const target = match ? Number(match[2].replace(/,/g, '')) : Number.NaN

  useEffect(() => {
    const node = ref.current
    if (!node || !Number.isFinite(target)) return

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reducedMotion || !('IntersectionObserver' in window)) return

    let frame = 0
    let started = false

    const animate = () => {
      const start = performance.now()
      const tick = (now: number) => {
        const progress = Math.min((now - start) / duration, 1)
        const eased = 1 - Math.pow(1 - progress, 3)
        const current = Math.round(target * eased)
        setDisplay(`${prefix}${current.toLocaleString()}${suffix}`)
        if (progress < 1) frame = requestAnimationFrame(tick)
      }
      frame = requestAnimationFrame(tick)
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting || started) return
        started = true
        setDisplay(`${prefix}0${suffix}`)
        animate()
        observer.disconnect()
      },
      { threshold: 0.4 },
    )

    observer.observe(node)
    return () => {
      observer.disconnect()
      cancelAnimationFrame(frame)
    }
  }, [duration, prefix, suffix, target, value])

  if (!match) return <span className={className}>{value}</span>

  return (
    <span ref={ref} className={className}>
      <span className="sr-only">{value}</span>
      <span aria-hidden="true">{display}</span>
    </span>
  )
}
