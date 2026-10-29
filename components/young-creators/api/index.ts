/**
 * Young Creators Network — data access layer.
 *
 * Server-side read layer backed by Payload. Components never import Payload or
 * demo data directly; they consume the view models in `../types`.
 */
import { getPayload } from 'payload'
import configPromise from '@/payload.config'
import type { Media, YcnSetting, YcnUpdate, YoungCreator } from '@/payload-types'
import type { Creator, ImpactStat, LatestPost, MediaItem, YcnSiteSettings } from '../types'
import { filterCreators, type CreatorQuery } from '../lib/filter'

export type { CreatorQuery }

const FALLBACK_HERO = '/young-creators/hero.jpg'
const FALLBACK_WORKSHOP = '/young-creators/workshop.jpg'

const getClient = () => getPayload({ config: configPromise })

const mediaItem = (value: unknown, fallbackAlt: string): MediaItem | null => {
  if (!value || typeof value !== 'object') return null
  const media = value as Media
  if (!media.url) return null
  return {
    src: media.url,
    alt: media.alt?.trim() || fallbackAlt,
  }
}

const mapCreator = (doc: YoungCreator): Creator | null => {
  const portrait = mediaItem(doc.portrait, doc.publicDisplayName)
  if (!portrait) return null

  return {
    id: String(doc.id),
    slug: doc.slug,
    publicDisplayName: doc.publicDisplayName,
    nameVisibility: doc.nameVisibility ?? undefined,
    isMinor: Boolean(doc.isMinor),
    classYear: doc.classYear,
    primaryCategory: doc.primaryCategory,
    talents: doc.talents?.map((t) => t.label).filter(Boolean) ?? [],
    location: doc.location ?? undefined,
    tagline: doc.tagline,
    portrait,
    bio: doc.bio?.map((p) => p.text).filter(Boolean) ?? [],
    giftsAndTalents: doc.giftsAndTalents ?? '',
    discoveryStory: doc.discoveryStory ?? '',
    interview:
      doc.interview
        ?.filter((qa) => qa.question && qa.answer)
        .map((qa) => ({ question: qa.question, answer: qa.answer })) ?? [],
    videoUrl: doc.videoUrl ?? undefined,
    videoPoster: mediaItem(doc.videoPoster, `${doc.publicDisplayName} interview`) ?? undefined,
    works:
      doc.works
        ?.filter((work) => work.title)
        .map((work, index) => ({
          id: work.id ?? `${doc.slug}-work-${index}`,
          title: work.title,
          type: work.type,
          year: work.year,
          description: work.description,
          image: mediaItem(work.image, work.title) ?? undefined,
          href: work.href ?? undefined,
        })) ?? [],
    achievements:
      doc.achievements
        ?.filter((achievement) => achievement.title)
        .map((achievement) => ({
          year: achievement.year,
          title: achievement.title,
          detail: achievement.detail ?? undefined,
        })) ?? [],
    gallery:
      doc.gallery
        ?.map((item): MediaItem | null => {
          const image = mediaItem(item.image, doc.publicDisplayName)
          return image ? { ...image, caption: item.caption ?? undefined } : null
        })
        .filter((item): item is MediaItem => item !== null) ?? [],
    featured: Boolean(doc.featured),
    isDemo: false,
  }
}

const toCreators = (docs: YoungCreator[]): Creator[] =>
  docs.map(mapCreator).filter((creator): creator is Creator => creator !== null)

export async function listCreators(q: CreatorQuery = {}): Promise<Creator[]> {
  const payload = await getClient()
  const result = await payload.find({
    collection: 'young-creators',
    where: { _status: { equals: 'published' } },
    sort: '-classYear',
    limit: 200,
    depth: 2,
  })

  return filterCreators(toCreators(result.docs), q)
}

export async function getCreatorBySlug(slug: string): Promise<Creator | null> {
  const payload = await getClient()
  const result = await payload.find({
    collection: 'young-creators',
    where: {
      slug: { equals: slug },
      _status: { equals: 'published' },
    },
    limit: 1,
    depth: 2,
  })

  return result.docs[0] ? mapCreator(result.docs[0]) : null
}

export async function listClassYears(): Promise<number[]> {
  const creators = await listCreators()
  return [...new Set(creators.map((c) => c.classYear))].sort((a, b) => b - a)
}

export async function getFeaturedCreators(): Promise<Creator[]> {
  const payload = await getClient()
  const result = await payload.find({
    collection: 'young-creators',
    where: {
      _status: { equals: 'published' },
      featured: { equals: true },
    },
    sort: '-classYear',
    limit: 12,
    depth: 2,
  })

  return toCreators(result.docs)
}

export async function getLatestPosts(): Promise<LatestPost[]> {
  const payload = await getClient()
  const result = await payload.find({
    collection: 'ycn-updates',
    where: { _status: { equals: 'published' } },
    sort: '-date',
    limit: 3,
    depth: 2,
  })

  return result.docs
    .map((doc: YcnUpdate) => {
      if (!doc.creator || typeof doc.creator !== 'object') return null
      const image = mediaItem(doc.image, doc.title)
      if (!image) return null

      return {
        id: String(doc.id),
        creatorSlug: doc.creator.slug,
        title: doc.title,
        kind: doc.kind,
        date: doc.date,
        excerpt: doc.excerpt,
        image,
        ...(doc.youtubeUrl ? { youtubeUrl: doc.youtubeUrl } : {}),
      }
    })
    .filter((post): post is LatestPost => post !== null)
}

const mapImpactStats = (settings: YcnSetting | null): ImpactStat[] =>
  settings?.impactStats
    ?.filter((stat) => stat.value && stat.label)
    .map((stat) => ({ value: stat.value, label: stat.label })) ?? []

const toMediaWithFallback = (value: unknown, fallbackSrc: string, fallbackAlt: string): MediaItem =>
  mediaItem(value, fallbackAlt) ?? { src: fallbackSrc, alt: fallbackAlt }

export async function getYcnSettings(): Promise<YcnSiteSettings> {
  const payload = await getClient()
  const settings: YcnSetting | null = await payload.findGlobal({
    slug: 'ycn-settings',
    depth: 1,
  })

  return {
    heroImage: toMediaWithFallback(
      settings?.heroImage,
      FALLBACK_HERO,
      'Young creators laughing together in an art studio',
    ),
    workshopImage: toMediaWithFallback(
      settings?.workshopImage,
      FALLBACK_WORKSHOP,
      'Mentor guiding young creators at a workshop',
    ),
    impactStats: mapImpactStats(settings),
    contact:
      settings?.contactHref && settings?.contactLabel
        ? { label: settings.contactLabel, href: settings.contactHref }
        : null,
  }
}

export async function getImpactStats(): Promise<ImpactStat[]> {
  const settings = await getYcnSettings()
  return settings.impactStats
}
