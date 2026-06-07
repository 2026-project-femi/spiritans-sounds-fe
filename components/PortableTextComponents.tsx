// components/RichText.tsx
import {
  JSXConvertersFunction,
  RichText as PayloadRichText,
} from '@payloadcms/richtext-lexical/react'
import { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'
import Image from 'next/image'

// ─── YouTube helpers (unchanged) ─────────────────────────────────────────────

export function getYouTubeId(url: string): string | null {
  try {
    const u = new URL(url)
    if (u.hostname === 'youtu.be') return u.pathname.slice(1)
    if (u.hostname.includes('youtube.com')) {
      const v = u.searchParams.get('v')
      if (v) return v
      const parts = u.pathname.split('/')
      const embedIdx = parts.indexOf('embed')
      if (embedIdx !== -1) return parts[embedIdx + 1]
    }
  } catch {}
  return null
}

export function YouTubeEmbed({ url }: { url: string }) {
  const videoId = getYouTubeId(url)
  if (!videoId) return null
  return (
    <div className="aspect-video my-8 rounded-xl overflow-hidden shadow-lg">
      <iframe
        src={`https://www.youtube.com/embed/${videoId}`}
        title="YouTube video"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="w-full h-full"
      />
    </div>
  )
}

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