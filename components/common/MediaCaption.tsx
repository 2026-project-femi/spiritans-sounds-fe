import type { DefaultTypedEditorState } from '@payloadcms/richtext-lexical'

import RichText from '@/components/RichText'
import { cn } from '@/payload/utilities/ui'
import { hasTextContent } from '@/payload/utilities/hasTextContent'

interface MediaCaptionProps {
  caption?: unknown
  className?: string
  theme?: 'light' | 'dark'
}

/**
 * Renders a Media collection caption (string or Lexical richText) below an image.
 * Returns null when there is no meaningful caption, so callers can render it
 * unconditionally next to the image.
 */
export function MediaCaption({ caption, className, theme = 'light' }: MediaCaptionProps) {
  if (!hasTextContent(caption)) return null

  return (
    <figcaption
      className={cn(
        'mt-3 text-center text-sm italic',
        theme === 'dark' ? 'text-gray-400' : 'text-gray-500',
        className,
      )}
    >
      {typeof caption === 'string' ? (
        <p>{caption}</p>
      ) : (
        <RichText data={caption as DefaultTypedEditorState} enableGutter={false} enableProse={false} />
      )}
    </figcaption>
  )
}
