import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPrayerVideo } from '@/components/prayer-room/api'

interface Props {
  params: Promise<{ youtubeId: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { youtubeId } = await params
  const video = await getPrayerVideo(youtubeId)
  if (!video) return { title: 'Video not found' }
  return { title: video.title, description: video.description }
}

export default async function PrayerVideoPage({ params }: Props) {
  const { youtubeId } = await params
  const video = await getPrayerVideo(youtubeId)
  if (!video) notFound()

  return (
    <div className="mx-auto max-w-4xl px-5 py-12">
      <Link href="/prayer-room/videos" className="text-sm text-[#6b5f52]">
        ← All videos
      </Link>
      <div className="mt-6 aspect-video overflow-hidden rounded-2xl bg-[#2b211a]">
        <iframe
          className="h-full w-full"
          src={`https://www.youtube-nocookie.com/embed/${video.youtubeId}`}
          title={video.title}
          allow="accelerometer; encrypted-media; picture-in-picture"
          allowFullScreen
        />
      </div>
      <p className="mt-6 text-xs font-semibold uppercase tracking-widest text-brand-primary">
        {video.type.replace('-', ' ')} • {video.duration}
      </p>
      <h1 className="mt-2 text-4xl font-semibold">{video.title}</h1>
      <p className="mt-3 text-[#6b5f52]">{video.description}</p>
    </div>
  )
}
