import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { RichText } from '@payloadcms/richtext-lexical/react'
import { getPrayerBySlug, getPrayerLibrary } from '@/components/prayer-room/api'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const prayer = await getPrayerBySlug(slug)
  if (!prayer) return { title: 'Prayer not found' }
  return {
    title: prayer.title,
    description: prayer.excerpt,
  }
}

export default async function PrayerDetailPage({ params }: Props) {
  const { slug } = await params
  const [prayer, library] = await Promise.all([getPrayerBySlug(slug), getPrayerLibrary(20)])

  if (!prayer) notFound()

  const related = library.filter((item) => item.slug !== prayer.slug).slice(0, 3)

  return (
    <article className="mx-auto max-w-2xl px-6 py-14">
      <Link href="/prayer-room/library" className="text-sm text-[#6b5f52]">
        ← Prayer Library
      </Link>
      <p className="mt-8 text-xs font-semibold uppercase tracking-[0.25em] text-brand-primary">
        {prayer.category || 'Prayer'}
      </p>
      <h1 className="mt-2 text-5xl font-semibold">{prayer.title}</h1>

      <div className="mt-8 space-y-6">
        {prayer.content ? (
          <RichText data={prayer.content as never} className="payload-richtext" />
        ) : (
          <p className="prayer-text">{prayer.excerpt}</p>
        )}
      </div>

      {related.length > 0 && (
        <>
          <h2 className="mt-14 text-2xl font-semibold">Related prayers</h2>
          <div className="mt-3 grid gap-2">
            {related.map((item) => (
              <Link
                key={item.id}
                href={`/prayer-room/library/${item.slug}`}
                className="rounded-xl border border-[#e6ddcb] bg-[#fffdf8] p-4 transition hover:border-brand-primary"
              >
                {item.title}
              </Link>
            ))}
          </div>
        </>
      )}
    </article>
  )
}
