'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'

interface RevealProps {
  children: ReactNode
  className?: string
  delay?: number
}

type RevealState = 'idle' | 'hidden' | 'visible'

/**
 * Fades and lifts content into view once. Content stays visible in the server
 * HTML and only below-fold sections are hidden after hydration, so slow JS
 * bundles never leave the page blank. Reduced-motion and missing
 * IntersectionObserver also keep everything visible.
 */
export function Reveal({ children, className = '', delay = 0 }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [state, setState] = useState<RevealState>('idle')

  useEffect(() => {
    const node = ref.current
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (!node || reducedMotion || !('IntersectionObserver' in window)) {
      setState('visible')
      return
    }

    const rect = node.getBoundingClientRect()
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      setState('visible')
      return
    }

    setState('hidden')

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return
        setState('visible')
        observer.disconnect()
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className={`yc-reveal ${state === 'hidden' ? 'is-pending' : ''} ${state === 'visible' ? 'is-visible' : ''} ${className}`}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  )
}
