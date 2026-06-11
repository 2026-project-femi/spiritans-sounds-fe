// app/homilies/[slug]/page.tsx
import Image from 'next/image'
import { getPayload } from 'payload'
import configPromise from '@/payload.config'
import { RichText } from '@payloadcms/richtext-lexical/react'
import { YouTubeEmbed } from '@/components/PortableTextComponents'
import { Sidebar } from '@/components/common/Sidebar'
import Comments from '@/components/Comments'
import { getSidebarData } from '@/lib/payload'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'


export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const payload = await getPayload({ config: configPromise })
  const result = await payload.find({
    collection: 'homily',
    where: { slug: { equals: slug } },
    depth: 1,
  })
  const doc = result.docs[0]
  if (!doc) return {}

  const imageUrl =
    doc.featuredImage && typeof doc.featuredImage === 'object'
      ? (doc.featuredImage as any).url
      : null

  return {
    title: doc.title,
    description: doc.excerpt || '',
    openGraph: {
      title: doc.title,
      description: doc.excerpt || '',
      type: 'article',
      images: imageUrl
        ? [{ url: imageUrl, width: 1200, height: 630, alt: doc.title }]
        : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: doc.title,
      description: doc.excerpt || '',
      images: imageUrl ? [imageUrl] : [],
    },
  }
}

export default async function SingleHomilyPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const [payload, sidebarData] = await Promise.all([
    getPayload({ config: configPromise }),
    getSidebarData(),
  ])

  const result = await payload.find({
    collection: 'homily',
    where: { slug: { equals: slug } },
    depth: 1, // populates featuredImage, audio as objects
  })

  const doc = result.docs[0]
  if (!doc) notFound()

     // Now fetch approved comments for this specific doc
  const commentsResult = await payload.find({
    collection: 'comments',
    where: {
      and: [
        { 'post.value': { equals: doc.id } },
        { 'post.relationTo': { equals: 'homily' } },
        { approved: { equals: true } },
      ],
    },
    sort: '-createdAt',
    depth: 0,
  })

  const comments = commentsResult.docs.map((c) => ({
    _id: String(c.id),
    name: c.name,
    email: c.email,
    comment: c.comment,
    createdAt: c.createdAt,
  }))

  const imageUrl =
    doc.featuredImage && typeof doc.featuredImage === 'object'
      ? (doc.featuredImage as any).url
      : null

  const audioUrl =
    doc.audio && typeof doc.audio === 'object'
      ? (doc.audio as any).url
      : null

  return (
    <main className="pt-32 pb-20">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">

          {/* Main Content */}
          <article className="lg:col-span-8 relative z-0">
            {imageUrl && (
              <div className="aspect-[16/9] mb-12 bg-gray-100 overflow-hidden rounded-lg">
                <Image
                  src={imageUrl}
                  alt={doc.title}
                  width={800}
                  height={450}
                  className="object-cover transition-opacity duration-300"
                  priority
                />
              </div>
            )}

            <div className="pt-8">
              <header className="mb-8 text-center">
                <div className="flex items-center justify-center space-x-4 mb-6">
                  {doc.category && (
                    <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-primary bg-primary/5 px-3 py-1 border border-primary/10">
                      {typeof doc.category === 'object'
                        ? (doc.category as any).title
                        : doc.category}
                    </span>
                  )}
                  {doc.date && (
                    <span className="text-[10px] tracking-widest text-gray-800 uppercase">
                      {new Date(doc.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </span>
                  )}
                </div>

                <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight text-black mb-8">
                  {doc.title}
                </h1>

                {doc.scripture && (
                  <div className="flex items-center justify-center pb-8 border-b border-gray-200">
                    <p className="text-sm text-muted-foreground">{doc.scripture}</p>
                  </div>
                )}
              </header>

              {audioUrl && (
                <div className="my-8">
                  <audio controls className="w-full">
                    <source src={audioUrl} type="audio/mpeg" />
                    Your browser does not support the audio element.
                  </audio>
                </div>
              )}

              {doc.youtubeUrl && <YouTubeEmbed url={doc.youtubeUrl} />}

              <div className="prose prose-lg dark:prose-invert max-w-none text-black space-y-8 font-light leading-loose text-lg">
                {doc.content && <RichText data={doc.content} />}
              </div>
            </div>

            <Comments
              postType="homily"
              postId={doc.id}             // number — Payload's native ID
              comments={comments || []}
            />
          </article>

          {/* Sidebar */}
          <div className="lg:col-span-4">
            <div className="sticky top-32 z-20">
              <Sidebar
                categories={sidebarData.categories.map((c) =>c)}
                recentPosts={sidebarData.recentPosts}
              />
            </div>
          </div>

        </div>
      </div>
    </main>
  )
}