import React from 'react'

import { cn } from '@/payload/utilities/ui'

type Props = {
  children: React.ReactNode
  className?: string
  href?: string | null
  newTab?: boolean | null
}

/**
 * Wraps an image in a link when a URL is configured. Renders the image
 * untouched when there is no URL, so existing image layouts are unaffected.
 */
export function ImageLink({ children, className, href, newTab }: Props) {
  if (!href) return <>{children}</>

  return (
    <a
      className={cn('block h-full w-full', className)}
      href={href}
      {...(newTab ? { rel: 'noopener noreferrer', target: '_blank' } : {})}
    >
      {children}
    </a>
  )
}
