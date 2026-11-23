export interface PrayerRoomCard {
  id: string
  title: string
  focus?: string
  host?: string
  dayOfWeek: string
  startTime: string
  timezone: string
  durationMinutes?: number | null
  platform: string
  meetingUrl?: string
  location?: string
  imageUrl?: string
  imageAlt?: string
  isLive: boolean
  isFeatured: boolean
  order: number
}

export type PrayerPrivacy = 'public' | 'partners' | 'private'

export interface PrayerIntention {
  id: string
  text: string
  name: string
  category: string
  privacy: PrayerPrivacy
  status: string
  prayed: number
  candles: number
  createdAt: string
}

export interface PrayerStats {
  totalCandles: number
  todayPrayers: number
  weekPrayers: number
  carried: number
}

export interface PrayerLibraryItem {
  id: string
  title: string
  slug: string
  category?: string
  excerpt?: string
  content?: unknown
  imageUrl?: string
  imageAlt?: string
}

export interface PrayerVideo {
  id: string
  youtubeId: string
  title: string
  description?: string
  type: string
  duration?: string
  isFeatured: boolean
  order: number
}

export interface PrayerTestimony {
  id: string
  name: string
  text: string
  createdAt: string
}

export interface PrayerRoomFaq {
  question: string
  answer: string
}

export interface PrayerRoomSettingsData {
  eyebrow: string
  title: string
  description: string
  heroQuote: string
  heroImageUrl: string
  heroImageAlt: string
  isLive: boolean
  liveTitle: string
  liveDescription: string
  liveNote?: string
  meetingUrl?: string
  meetingPlatform: string
  scheduleEyebrow: string
  scheduleTitle: string
  scheduleIntro: string
  showIntentions: boolean
  intentionsEyebrow: string
  intentionsTitle: string
  intentionsIntro: string
  intentionsPrivacyNote: string
  requestFormTitle: string
  requestFormIntro: string
  requestSuccessMessage: string
  resourcesEyebrow: string
  resourcesTitle: string
  resourcesIntro: string
  scriptureQuote: string
  scriptureReference: string
  faq: PrayerRoomFaq[]
  contactLabel: string
  contactHref: string
  metaTitle?: string
  metaDescription?: string
}
