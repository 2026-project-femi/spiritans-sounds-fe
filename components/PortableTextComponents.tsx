// components/RichText.tsx
import {
  JSXConvertersFunction,
  RichText as PayloadRichText,
} from '@payloadcms/richtext-lexical/react'
import { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'
import Image from 'next/image'

export { YouTubeEmbed, getYouTubeId } from './YouTubeEmbed'
import { YouTubeEmbed } from './YouTubeEmbed'

// ─── Custom JSX converters ────────────────────────────────────────────────────

const jsxConverters: JSXConvertersFunction = ({ defaultConverters }) => ({
  ...defaultConverters,

  // Override the default upload/image block
  upload: ({ node }) => {
    const media = node.value as { url?: string; alt?: string; width?: number; height?: number }
    if (!media?.url) return null
    return (
      <figure className="my-8">
        <div className="overflow-hidden rounded-xl">
          <Image
            src={media.url}
            alt={media.alt || ''}
            width={media.width || 900}
            height={media.height || 600}
            className="w-full h-auto object-cover"
          />
        </div>
      </figure>
    )
  },

  // Custom YouTube block (if you add one in your Lexical feature config)
  youtube: ({ node }) => {
    const url = node.fields?.url as string
    if (!url) return null
    return <YouTubeEmbed url={url} />
  },
})

// ─── Main component ───────────────────────────────────────────────────────────

interface RichTextProps {
  content: SerializedEditorState
  className?: string
}

export function RichText({ content, className }: RichTextProps) {
  return (
    <PayloadRichText
      data={content}
      converters={jsxConverters}
      className={className}
    />
  )
}