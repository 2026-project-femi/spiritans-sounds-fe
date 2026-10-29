import { getYouTubeEmbedUrl } from '@/lib/youtube'

export { getYouTubeId } from '@/lib/youtube'

export function YouTubeEmbed({
  url,
  title = 'YouTube video',
  className = 'my-8',
}: {
  url: string
  title?: string
  className?: string
}) {
  const src = getYouTubeEmbedUrl(url)
  if (!src) return null

  return (
    <div className={`aspect-video overflow-hidden rounded-xl shadow-lg ${className}`}>
      <iframe
        src={src}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="h-full w-full"
      />
    </div>
  )
}
