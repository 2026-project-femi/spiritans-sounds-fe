/**
 * Seeds the Young Creators Network collections from the original prototype data.
 *
 * Safe to re-run: media is matched by filename and creators/updates by slug/title.
 * Run with: pnpm seed:ycn
 */
import path from 'node:path'
import { getPayload } from 'payload'
import configPromise from '../payload.config'
import { DEMO_CREATORS, DEMO_LATEST } from '../components/young-creators/data/demo-creators'
import type { MediaItem } from '../components/young-creators/types'

const publicDir = path.resolve(process.cwd(), 'public')

async function main() {
  const payload = await getPayload({ config: configPromise })

  const mediaCache = new Map<string, string>()

  const ensureMedia = async (item: MediaItem | undefined): Promise<string | undefined> => {
    if (!item?.src) return undefined
    const cached = mediaCache.get(item.src)
    if (cached) return cached

    const filename = path.basename(item.src)
    const existing = await payload.find({
      collection: 'media',
      where: { filename: { equals: filename } },
      limit: 1,
    })

    if (existing.docs[0]) {
      mediaCache.set(item.src, existing.docs[0].id)
      return existing.docs[0].id
    }

    const created = await payload.create({
      collection: 'media',
      data: { alt: item.alt },
      filePath: path.join(publicDir, item.src),
    })
    mediaCache.set(item.src, created.id)
    return created.id
  }

  let createdCreators = 0
  let skippedCreators = 0
  const creatorIds = new Map<string, string>()

  for (const creator of DEMO_CREATORS) {
    const existing = await payload.find({
      collection: 'young-creators',
      where: { slug: { equals: creator.slug } },
      limit: 1,
    })

    if (existing.docs[0]) {
      creatorIds.set(creator.slug, existing.docs[0].id)
      skippedCreators += 1
      continue
    }

    const portrait = await ensureMedia(creator.portrait)
    if (!portrait) {
      payload.logger.warn(`Skipping ${creator.slug}: portrait could not be uploaded`)
      continue
    }

    const works = []
    for (const work of creator.works) {
      works.push({
        title: work.title,
        type: work.type,
        year: work.year,
        description: work.description,
        image: await ensureMedia(work.image),
        href: work.href,
      })
    }

    const gallery = []
    for (const item of creator.gallery) {
      const image = await ensureMedia(item)
      if (image) gallery.push({ image, caption: item.caption })
    }

    const doc = await payload.create({
      collection: 'young-creators',
      data: {
        publicDisplayName: creator.publicDisplayName,
        slug: creator.slug,
        portrait,
        classYear: creator.classYear,
        primaryCategory: creator.primaryCategory,
        featured: Boolean(creator.featured),
        location: creator.location,
        talents: creator.talents.map((label) => ({ label })),
        tagline: creator.tagline,
        bio: creator.bio.map((text) => ({ text })),
        giftsAndTalents: creator.giftsAndTalents,
        discoveryStory: creator.discoveryStory,
        interview: creator.interview,
        videoUrl: creator.videoUrl,
        videoPoster: await ensureMedia(creator.videoPoster),
        works,
        achievements: creator.achievements,
        gallery,
        nameVisibility: creator.nameVisibility,
        isMinor: creator.isMinor,
        _status: 'published',
        publishedAt: new Date().toISOString(),
      },
    })

    creatorIds.set(creator.slug, doc.id)
    createdCreators += 1
  }

  let createdUpdates = 0
  for (const post of DEMO_LATEST) {
    const existing = await payload.find({
      collection: 'ycn-updates',
      where: { title: { equals: post.title } },
      limit: 1,
    })
    if (existing.docs[0]) continue

    const creatorId = creatorIds.get(post.creatorSlug)
    const image = await ensureMedia(post.image)
    if (!creatorId || !image) continue

    await payload.create({
      collection: 'ycn-updates',
      data: {
        title: post.title,
        creator: creatorId,
        kind: post.kind,
        date: post.date,
        excerpt: post.excerpt,
        image,
        _status: 'published',
        publishedAt: new Date().toISOString(),
      },
    })
    createdUpdates += 1
  }

  await payload.updateGlobal({
    slug: 'ycn-settings',
    data: {
      heroImage: await ensureMedia({ src: '/young-creators/hero.jpg', alt: 'Young creators laughing together in an art studio' }),
      workshopImage: await ensureMedia({ src: '/young-creators/workshop.jpg', alt: 'Mentor guiding young creators at a workshop' }),
    },
  })

  payload.logger.info(
    `Young Creators seed complete: ${createdCreators} creators created, ${skippedCreators} skipped, ${createdUpdates} updates created.`,
  )
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
