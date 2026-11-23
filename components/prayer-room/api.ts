import { getPayload } from 'payload'
import configPromise from '@/payload.config'
import type {
  PrayerIntention,
  PrayerLibraryItem,
  PrayerPrivacy,
  PrayerRoomCard,
  PrayerRoomSettingsData,
  PrayerStats,
  PrayerTestimony,
  PrayerVideo,
} from './types'

type MediaDoc = { url?: string | null; alt?: string | null }
type RawRecord = Record<string, unknown>

const FALLBACK_IMAGE = '/prayer-room/prayer-room-hero.jpg'

const FALLBACKS: PrayerRoomSettingsData = {
  eyebrow: 'Spiritans Sound Outreach',
  title: 'Spiritans Sound Prayer Room',
  description: 'A place to pray. A place to be prayed for. A community united in prayer.',
  heroQuote:
    '“Whatever brought you here, you do not have to carry it alone. Leave your intention, pray for someone, or simply spend a moment with God.”',
  heroImageUrl: FALLBACK_IMAGE,
  heroImageAlt:
    'A candle beside an open Bible in a quiet chapel, with light streaming through a window',
  isLive: false,
  liveTitle: 'The room is open',
  liveDescription:
    'Come as you are. You can join with your camera off, and prayer requests can be shared in the chat.',
  liveNote: '',
  meetingUrl: '',
  meetingPlatform: 'zoom',
  scheduleEyebrow: 'Pray together',
  scheduleTitle: 'Live Prayer',
  scheduleIntro:
    'Join A Moment with the Holy Spirit every Friday at 9:00 PM, plus novenas, Rosary and vigils.',
  showIntentions: true,
  intentionsEyebrow: 'I need prayer',
  intentionsTitle: 'Submit a Prayer Intention',
  intentionsIntro:
    'You do not have to carry it alone. Every intention is gently reviewed before it is shared.',
  intentionsPrivacyNote:
    'Personal details are never shown publicly. You choose who can see your intention.',
  requestFormTitle: 'Submit a Prayer Intention',
  requestFormIntro: 'You do not have to carry it alone.',
  requestSuccessMessage:
    'Your intention has been received. It will be reviewed with care, and the community is with you in prayer.',
  resourcesEyebrow: 'Help me pray',
  resourcesTitle: 'Prayer Library',
  resourcesIntro: 'When words are hard to find, pray with the Church.',
  scriptureQuote:
    'Come to me, all you who are weary and burdened, and I will give you rest.',
  scriptureReference: 'Matthew 11:28',
  faq: [],
  contactLabel: 'Contact the prayer team',
  contactHref: '/contact',
}

const str = (value: unknown, fallback = ''): string =>
  typeof value === 'string' && value.trim() ? value : fallback

const num = (value: unknown): number =>
  typeof value === 'number' && Number.isFinite(value) ? value : 0

const mediaUrl = (value: unknown): string | undefined => {
  const media = value as MediaDoc | null | undefined
  return typeof media === 'object' && media?.url ? media.url : undefined
}

const mediaAlt = (value: unknown): string | undefined => {
  const media = value as MediaDoc | null | undefined
  return typeof media === 'object' && typeof media?.alt === 'string' ? media.alt : undefined
}

const asRecord = (value: unknown): RawRecord =>
  typeof value === 'object' && value !== null ? (value as RawRecord) : {}

const client = () => getPayload({ config: configPromise })

export async function getPrayerRoomSettings(): Promise<PrayerRoomSettingsData> {
  try {
    const payload = await client()
    const global = asRecord(await payload.findGlobal({ slug: 'prayer-room-settings', depth: 1 }))

    return {
      eyebrow: str(global.eyebrow, FALLBACKS.eyebrow),
      title: str(global.title, FALLBACKS.title),
      description: str(global.description, FALLBACKS.description),
      heroQuote: str(global.heroQuote, FALLBACKS.heroQuote),
      heroImageUrl: mediaUrl(global.heroImage) ?? FALLBACKS.heroImageUrl,
      heroImageAlt: mediaAlt(global.heroImage) ?? FALLBACKS.heroImageAlt,
      isLive: Boolean(global.isLive),
      liveTitle: str(global.liveTitle, FALLBACKS.liveTitle),
      liveDescription: str(global.liveDescription, FALLBACKS.liveDescription),
      liveNote: str(global.liveNote) || undefined,
      meetingUrl: str(global.meetingUrl) || undefined,
      meetingPlatform: str(global.meetingPlatform, FALLBACKS.meetingPlatform),
      scheduleEyebrow: str(global.scheduleEyebrow, FALLBACKS.scheduleEyebrow),
      scheduleTitle: str(global.scheduleTitle, FALLBACKS.scheduleTitle),
      scheduleIntro: str(global.scheduleIntro, FALLBACKS.scheduleIntro),
      showIntentions: global.showIntentions !== false,
      intentionsEyebrow: str(global.intentionsEyebrow, FALLBACKS.intentionsEyebrow),
      intentionsTitle: str(global.intentionsTitle, FALLBACKS.intentionsTitle),
      intentionsIntro: str(global.intentionsIntro, FALLBACKS.intentionsIntro),
      intentionsPrivacyNote: str(
        global.intentionsPrivacyNote,
        FALLBACKS.intentionsPrivacyNote,
      ),
      requestFormTitle: str(global.requestFormTitle, FALLBACKS.requestFormTitle),
      requestFormIntro: str(global.requestFormIntro, FALLBACKS.requestFormIntro),
      requestSuccessMessage: str(
        global.requestSuccessMessage,
        FALLBACKS.requestSuccessMessage,
      ),
      resourcesEyebrow: str(global.resourcesEyebrow, FALLBACKS.resourcesEyebrow),
      resourcesTitle: str(global.resourcesTitle, FALLBACKS.resourcesTitle),
      resourcesIntro: str(global.resourcesIntro, FALLBACKS.resourcesIntro),
      scriptureQuote: str(global.scriptureQuote, FALLBACKS.scriptureQuote),
      scriptureReference: str(global.scriptureReference, FALLBACKS.scriptureReference),
      faq: [],
      contactLabel: str(global.contactLabel, FALLBACKS.contactLabel),
      contactHref: str(global.contactHref) || FALLBACKS.contactHref,
      metaTitle: str(global.metaTitle) || undefined,
      metaDescription: str(global.metaDescription) || undefined,
    }
  } catch (error) {
    console.error('Failed to load Prayer Room settings:', error)
    return FALLBACKS
  }
}

export async function getPrayerRooms(): Promise<PrayerRoomCard[]> {
  try {
    const payload = await client()
    const result = await payload.find({
      collection: 'prayer-rooms',
      where: { isActive: { equals: true } },
      limit: 30,
      sort: 'order',
      depth: 1,
    })

    return result.docs
      .map((doc) => {
        const room = asRecord(doc)
        return {
          id: String(room.id),
          title: str(room.title, 'Prayer session'),
          focus: str(room.focus) || undefined,
          host: str(room.host) || undefined,
          dayOfWeek: str(room.dayOfWeek, 'daily'),
          startTime: str(room.startTime, '8:00 PM'),
          timezone: str(room.timezone, 'WAT'),
          durationMinutes:
            typeof room.durationMinutes === 'number' ? room.durationMinutes : null,
          platform: str(room.platform, 'zoom'),
          meetingUrl: str(room.meetingUrl) || undefined,
          location: str(room.location) || undefined,
          imageUrl: mediaUrl(room.image),
          imageAlt: mediaAlt(room.image),
          isLive: Boolean(room.isLive),
          isFeatured: Boolean(room.isFeatured),
          order: typeof room.order === 'number' ? room.order : 0,
        } satisfies PrayerRoomCard
      })
      .sort(
        (a, b) =>
          Number(b.isFeatured) - Number(a.isFeatured) ||
          a.order - b.order ||
          a.title.localeCompare(b.title),
      )
  } catch (error) {
    console.error('Failed to load prayer rooms:', error)
    return []
  }
}

const mapIntention = (doc: unknown): PrayerIntention => {
  const request = asRecord(doc)
  const isAnonymous = Boolean(request.isAnonymous)
  return {
    id: String(request.id),
    text: str(request.intention),
    name: isAnonymous ? 'Anonymous' : str(request.name, 'Anonymous') || 'Anonymous',
    category: str(request.category, 'general-intention'),
    privacy: str(request.privacy, 'public') as PrayerPrivacy,
    status: str(request.status, 'approved'),
    prayed: num(request.prayedCount),
    candles: num(request.candleCount),
    createdAt: str(request.createdAt),
  } satisfies PrayerIntention
}

export async function getPublicIntentions(limit = 30): Promise<PrayerIntention[]> {
  try {
    const payload = await client()
    const result = await payload.find({
      collection: 'prayer-requests',
      where: {
        and: [
          { status: { equals: 'approved' } },
          { privacy: { equals: 'public' } },
        ],
      },
      limit,
      sort: '-createdAt',
      depth: 0,
    })

    return result.docs.map(mapIntention)
  } catch (error) {
    console.error('Failed to load prayer intentions:', error)
    return []
  }
}

/** Low-candle intentions are surfaced first in the candle chapel / priority prayer. */
export async function getIntentionsNeedingCandles(limit = 3): Promise<PrayerIntention[]> {
  const all = await getPublicIntentions(30)
  return [...all].sort((a, b) => a.candles - b.candles || a.prayed - b.prayed).slice(0, limit)
}

export async function getPrayerStats(): Promise<PrayerStats> {
  try {
    const payload = await client()
    const now = new Date()
    const startOfToday = new Date(now)
    startOfToday.setHours(0, 0, 0, 0)
    const startOfWeek = new Date(now)
    startOfWeek.setDate(now.getDate() - 7)

    const [requests, today, week, carried] = await Promise.all([
      payload.find({
        collection: 'prayer-requests',
        where: {
          and: [
            { status: { equals: 'approved' } },
            { privacy: { equals: 'public' } },
          ],
        },
        limit: 1000,
        depth: 0,
      }),
      payload.count({
        collection: 'prayer-activities',
        where: { createdAt: { greater_than: startOfToday.toISOString() } },
        overrideAccess: true,
      }),
      payload.count({
        collection: 'prayer-activities',
        where: { createdAt: { greater_than: startOfWeek.toISOString() } },
        overrideAccess: true,
      }),
      payload.count({
        collection: 'prayer-requests',
        where: {
          and: [
            { status: { equals: 'approved' } },
            { privacy: { equals: 'public' } },
            { prayedCount: { greater_than: 0 } },
          ],
        },
        overrideAccess: true,
      }),
    ])

    const totalCandles = requests.docs.reduce(
      (total, doc) => total + num(asRecord(doc).candleCount),
      0,
    )

    return {
      totalCandles,
      todayPrayers: today.totalDocs,
      weekPrayers: week.totalDocs,
      carried: carried.totalDocs,
    }
  } catch (error) {
    console.error('Failed to load prayer stats:', error)
    return { totalCandles: 0, todayPrayers: 0, weekPrayers: 0, carried: 0 }
  }
}

const mapPrayer = (doc: unknown): PrayerLibraryItem => {
  const prayer = asRecord(doc)
  return {
    id: String(prayer.id),
    title: str(prayer.title, 'Prayer'),
    slug: str(prayer.slug),
    category: str(prayer.category) || undefined,
    excerpt: str(prayer.excerpt) || undefined,
    content: prayer.content,
    imageUrl: mediaUrl(prayer.featuredImage),
    imageAlt: mediaAlt(prayer.featuredImage),
  }
}

export async function getPrayerLibrary(limit = 60): Promise<PrayerLibraryItem[]> {
  try {
    const payload = await client()
    const result = await payload.find({
      collection: 'prayer',
      where: { _status: { equals: 'published' } },
      limit,
      sort: '-publishedAt',
      depth: 1,
    })
    return result.docs.map(mapPrayer)
  } catch (error) {
    console.error('Failed to load prayer library:', error)
    return []
  }
}

export async function getPrayerBySlug(slug: string): Promise<PrayerLibraryItem | null> {
  try {
    const payload = await client()
    const result = await payload.find({
      collection: 'prayer',
      where: { and: [{ slug: { equals: slug } }, { _status: { equals: 'published' } }] },
      limit: 1,
      depth: 1,
    })
    return result.docs[0] ? mapPrayer(result.docs[0]) : null
  } catch (error) {
    console.error('Failed to load prayer:', error)
    return null
  }
}

export async function getPrayerVideos(limit = 60): Promise<PrayerVideo[]> {
  try {
    const payload = await client()
    const result = await payload.find({
      collection: 'prayer-videos',
      limit,
      sort: 'order',
      depth: 0,
    })
    return result.docs.map((doc) => {
      const video = asRecord(doc)
      return {
        id: String(video.id),
        youtubeId: str(video.youtubeId),
        title: str(video.title, 'Prayer video'),
        description: str(video.description) || undefined,
        type: str(video.type, 'prayer'),
        duration: str(video.duration) || undefined,
        isFeatured: Boolean(video.isFeatured),
        order: num(video.order),
      } satisfies PrayerVideo
    })
  } catch (error) {
    console.error('Failed to load prayer videos:', error)
    return []
  }
}

export async function getPrayerVideo(youtubeId: string): Promise<PrayerVideo | null> {
  const videos = await getPrayerVideos(100)
  return videos.find((video) => video.youtubeId === youtubeId) ?? null
}

export async function getTestimonies(limit = 30): Promise<PrayerTestimony[]> {
  try {
    const payload = await client()
    const result = await payload.find({
      collection: 'prayer-testimonies',
      where: { status: { equals: 'published' } },
      limit,
      sort: '-createdAt',
      depth: 0,
    })
    return result.docs.map((doc) => {
      const testimony = asRecord(doc)
      return {
        id: String(testimony.id),
        name: str(testimony.name, 'Anonymous') || 'Anonymous',
        text: str(testimony.text),
        createdAt: str(testimony.createdAt),
      } satisfies PrayerTestimony
    })
  } catch (error) {
    console.error('Failed to load testimonies:', error)
    return []
  }
}

export { FALLBACK_IMAGE }
