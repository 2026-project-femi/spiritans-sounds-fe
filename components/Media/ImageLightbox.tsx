'use client'

import * as DialogPrimitive from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import * as React from 'react'

import { cn } from '@/payload/utilities/ui'

type Props = {
  alt?: string
  children: React.ReactNode
  className?: string
  href?: string | null
  newTab?: boolean | null
  src: string
}

/**
 * Wraps a rendered image so it can be activated.
 *
 * - When an explicit `href` is supplied (e.g. the `linkUrl` field of an inline
 *   upload), the image becomes a regular link.
 * - Otherwise it opens a lightweight, accessible lightbox with the full-size
 *   image.
 */
export function ImageLightbox({ alt, children, className, href, newTab, src }: Props) {
  if (href) {
    return (
      <a
        className={cn('block', className)}
        href={href}
        {...(newTab ? { rel: 'noopener noreferrer', target: '_blank' } : {})}
      >
        {children}
      </a>
    )
  }

  if (!src) {
    return <>{children}</>
  }

  return (
    <DialogPrimitive.Root>
      <DialogPrimitive.Trigger asChild>
        <button
          aria-label={alt ? `View ${alt} larger` : 'View image larger'}
          className={cn(
            'group relative block w-full cursor-zoom-in rounded-[0.8rem] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary',
            className,
          )}
          type="button"
        >
          {children}
        </button>
      </DialogPrimitive.Trigger>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0" />
        <DialogPrimitive.Content className="fixed inset-0 z-50 flex items-center justify-center p-4 focus:outline-none data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0">
          <DialogPrimitive.Title className="sr-only">
            {alt || 'Image preview'}
          </DialogPrimitive.Title>
          <DialogPrimitive.Description className="sr-only">
            Press Escape or click outside to close.
          </DialogPrimitive.Description>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            alt={alt || ''}
            className="max-h-[90vh] max-w-[95vw] rounded-lg object-contain shadow-2xl"
            src={src}
          />
          <DialogPrimitive.Close className="absolute top-4 right-4 rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
            <X className="size-5" />
            <span className="sr-only">Close</span>
          </DialogPrimitive.Close>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
}
