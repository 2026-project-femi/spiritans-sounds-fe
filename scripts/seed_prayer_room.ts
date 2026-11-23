/**
 * Seeds the Prayer Room experience for LOCAL DEVELOPMENT ONLY.
 *
 * Run with: pnpm seed:prayer-room
 *
 * - Refuses to run in production or against a non-local database.
 * - Safe to re-run: rooms, intentions, prayers, videos and thanksgivings are
 *   matched by title / text / slug / YouTube ID and updated in place.
 * - Never sends real prayer-team notification emails.
 */
import path from 'node:path'
import { getPayload, type Payload } from 'payload'
import { loadEnv } from './loadEnv'

const localHosts = new Set(['127.0.0.1', 'localhost', '::1', '[::1]'])

const assertDevOnly = (): void => {
  if (process.env.NODE_ENV === 'production') {
    throw new Error('Refusing to seed Prayer Room content in production.')
  }
  const connectionString = process.env.POSTGRES_URL
  if (!connectionString) throw new Error('POSTGRES_URL is not set.')
  const host = new URL(connectionString).hostname
  if (!localHosts.has(host)) {
    throw new Error(`Refusing to seed a non-local database (host: ${host}).`)
  }
}

const HERO_PATH = path.resolve(process.cwd(), 'public/prayer-room/prayer-room-hero.jpg')
const HERO_ALT =
  'A candle beside an open Bible in a quiet chapel, with light streaming through a window'

const globalContent = {
  eyebrow: 'Spiritans Sound Outreach',
  title: 'Spiritans Sound Prayer Room',
  description: 'A place to pray. A place to be prayed for. A community united in prayer.',
  heroQuote:
    '“Whatever brought you here, you do not have to carry it alone. Leave your intention, pray for someone, or simply spend a moment with God.”',
  isLive: false,
  scheduleEyebrow: 'Pray together',
  scheduleTitle: 'Live Prayer',
  scheduleIntro:
    'Join A Moment with the Holy Spirit every Friday at 9:00 PM, plus novenas, Rosary and vigils.',
}

const retiredRoomTitles = [
  'Morning Prayer & Scripture',
  'Evening Prayer & Adoration',
  'Rosary for Families',
]

const retiredIntentionTexts = [
  'Please pray for my mother as she recovers from surgery, and for peace for everyone caring for her.',
  'For peace in my family and the courage to forgive where words have hurt us.',
  'Thanking God for a new job after months of waiting, and praying for everyone still searching.',
]

const rooms = [
  {
    title: 'A Moment with the Holy Spirit',
    focus: '“Come, Holy Spirit, renew our hearts”',
    dayOfWeek: 'friday',
    startTime: '9:00 PM',
    timezone: 'WAT',
    durationMinutes: 90,
    host: 'Spiritans Sound Team',
    platform: 'youtube',
    meetingUrl: 'https://youtube.com',
    isFeatured: true,
    order: 1,
  },
  {
    title: 'Novena for Families',
    focus: 'Nine evenings of prayer for families',
    dayOfWeek: 'monday',
    startTime: '8:00 PM',
    timezone: 'WAT',
    durationMinutes: 45,
    host: 'Fr. Paul, C.S.Sp.',
    platform: 'zoom',
    meetingUrl: 'https://zoom.us',
    isFeatured: false,
    order: 2,
  },
  {
    title: 'Rosary for Peace',
    focus: 'Praying for peace in our world',
    dayOfWeek: 'wednesday',
    startTime: '7:30 PM',
    timezone: 'WAT',
    durationMinutes: 30,
    host: 'Prayer Partners',
    platform: 'youtube',
    meetingUrl: 'https://youtube.com',
    isFeatured: false,
    order: 3,
  },
  {
    title: 'Advent Prayer Vigil',
    focus: 'Waiting in hope',
    dayOfWeek: 'saturday',
    startTime: '10:00 PM',
    timezone: 'WAT',
    durationMinutes: 60,
    host: 'Spiritans Sound Team',
    platform: 'youtube',
    meetingUrl: 'https://youtube.com',
    isFeatured: false,
    order: 4,
  },
] as const

const intentions = [
  {
    text: 'Please pray for peace and reconciliation in my family.',
    category: 'family',
    prayed: 5,
    candles: 5,
    isAnonymous: true,
    name: '',
  },
  {
    text: 'For my mother, who begins chemotherapy this week. May the Lord give her strength and the doctors wisdom.',
    category: 'healing',
    prayed: 11,
    candles: 11,
    isAnonymous: false,
    name: 'Chinedu',
  },
  {
    text: "I have an important job interview on Monday. Please pray that God's will be done.",
    category: 'work',
    prayed: 3,
    candles: 3,
    isAnonymous: false,
    name: 'Maria',
  },
  {
    text: 'For the soul of my father who passed away last month, and comfort for our family.',
    category: 'bereavement',
    prayed: 19,
    candles: 19,
    isAnonymous: true,
    name: '',
  },
  {
    text: 'Lord, help me discern my vocation and give me courage to follow where you lead.',
    category: 'spiritual-growth',
    prayed: 7,
    candles: 7,
    isAnonymous: false,
    name: 'Emeka',
  },
  {
    text: 'Thank you, Lord, for the safe delivery of our baby girl.',
    category: 'thanksgiving',
    prayed: 17,
    candles: 17,
    isAnonymous: false,
    name: 'Ada & Tom',
  },
  {
    text: 'For my marriage, that we may learn to listen and forgive one another again.',
    category: 'marriage',
    prayed: 6,
    candles: 6,
    isAnonymous: true,
    name: '',
  },
  {
    text: 'For my son who is struggling at school and has lost his confidence.',
    category: 'children',
    prayed: 4,
    candles: 4,
    isAnonymous: false,
    name: 'Grace',
  },
] as const

const prayers = [
  {
    slug: 'come-holy-spirit',
    title: 'Come, Holy Spirit',
    category: 'Holy Spirit',
    text: `Come, Holy Spirit, fill the hearts of your faithful and kindle in them the fire of your love.\n\nSend forth your Spirit and they shall be created, and you shall renew the face of the earth.\n\nO God, who by the light of the Holy Spirit did instruct the hearts of the faithful, grant that by the same Holy Spirit we may be truly wise and ever enjoy his consolations, through Christ our Lord. Amen.`,
  },
  {
    slug: 'prayer-for-healing',
    title: 'A Prayer for Healing',
    category: 'Healing',
    text: `Lord Jesus, you went about doing good and healing all who came to you.\n\nI bring before you today those who are sick in body, mind and spirit. Touch them with your gentle hand. Give strength to the weak, peace to the anxious, and hope to those who are afraid.\n\nGuide the hands of doctors and nurses, and let all who suffer know that they are not alone. Amen.`,
  },
  {
    slug: 'prayer-for-family',
    title: 'A Prayer for My Family',
    category: 'Family',
    text: `Heavenly Father, I place my family into your loving care.\n\nWhere there is division, bring unity. Where there is hurt, bring healing. Where there is weariness, bring rest.\n\nHoly Family of Nazareth, make our home a place of patience, kindness and faith. Amen.`,
  },
  {
    slug: 'memorare',
    title: 'The Memorare',
    category: 'Our Lady',
    text: `Remember, O most gracious Virgin Mary, that never was it known that anyone who fled to your protection, implored your help, or sought your intercession was left unaided.\n\nInspired by this confidence, I fly unto you, O Virgin of virgins, my Mother. To you I come; before you I stand, sinful and sorrowful.\n\nO Mother of the Word Incarnate, despise not my petitions, but in your mercy hear and answer me. Amen.`,
  },
  {
    slug: 'prayer-in-anxiety',
    title: 'When I Am Anxious',
    category: 'Anxiety & Worry',
    text: `Lord, my thoughts are racing and my heart is heavy.\n\nQuiet me. Help me to breathe and to remember that you are near. I hand over to you what I cannot control.\n\nJesus, I trust in you. Amen.`,
  },
  {
    slug: 'prayer-for-the-departed',
    title: 'For Those Who Have Died',
    category: 'Bereavement',
    text: `Eternal rest grant unto them, O Lord, and let perpetual light shine upon them.\n\nMay their souls and the souls of all the faithful departed, through the mercy of God, rest in peace. Amen.\n\nLord, comfort all who mourn, and hold them close in their grief.`,
  },
  {
    slug: 'morning-offering',
    title: 'Morning Offering',
    category: 'Morning Prayer',
    text: `O Jesus, through the Immaculate Heart of Mary, I offer you my prayers, works, joys and sufferings of this day, for all the intentions of your Sacred Heart.\n\nMay your Spirit guide every step I take today. Amen.`,
  },
  {
    slug: 'night-prayer',
    title: 'Before Sleep',
    category: 'Night Prayer',
    text: `Into your hands, O Lord, I commend my spirit.\n\nThank you for the gifts of this day. Forgive me where I have failed. Watch over those I love, and grant us all a restful night and a peaceful end. Amen.`,
  },
  {
    slug: 'before-travel',
    title: 'Before a Journey',
    category: 'Before Travel',
    text: `Lord, go before me on this journey. Be my companion on the way, my shelter in danger, and bring me safely to my destination and home again. Amen.`,
  },
  {
    slug: 'prayer-for-work',
    title: 'For Work and Provision',
    category: 'Work',
    text: `Lord, you know my needs before I ask. Bless the work of my hands. For those seeking employment, open doors; for those overburdened, grant rest. Give us this day our daily bread. Amen.`,
  },
  {
    slug: 'prayer-before-exams',
    title: 'Before an Exam',
    category: 'Exams',
    text: `Holy Spirit, Spirit of wisdom and understanding, calm my mind and help me remember what I have learned. Let me do my best and leave the rest in your hands. Amen.`,
  },
  {
    slug: 'prayer-of-thanksgiving',
    title: 'A Prayer of Thanksgiving',
    category: 'Thanksgiving',
    text: `Lord, my heart is full. Thank you for your faithfulness and for every blessing, seen and unseen. May my life be a song of praise to you. Amen.`,
  },
] as const

const videos = [
  {
    youtubeId: 'Sbr0cLkQgu8',
    title: 'A Moment with the Holy Spirit — Recorded Session',
    description: 'An evening of praise, Scripture and quiet prayer.',
    type: 'holy-spirit',
    duration: '58 min',
    isFeatured: true,
    order: 1,
  },
  {
    youtubeId: 'dB5Fq2T6FBs',
    title: 'The Holy Rosary — Sorrowful Mysteries',
    description: "Pray the Rosary together, meditating on Christ's Passion.",
    type: 'rosary',
    duration: '24 min',
    isFeatured: false,
    order: 2,
  },
  {
    youtubeId: 'q8cOfCH2xFo',
    title: 'Evening Worship',
    description: 'Songs of worship to quiet the heart at the close of day.',
    type: 'worship',
    duration: '35 min',
    isFeatured: false,
    order: 3,
  },
  {
    youtubeId: 'Hq3-ZkRrpTg',
    title: 'Psalm 23 — Scripture Meditation',
    description: 'A slow, guided reading of the Shepherd Psalm.',
    type: 'scripture',
    duration: '12 min',
    isFeatured: false,
    order: 4,
  },
  {
    youtubeId: 'WlkT5Tb8gAQ',
    title: 'Novena to the Holy Spirit — Day 1',
    description: 'Begin nine days of prayer for the gifts of the Spirit.',
    type: 'novena',
    duration: '15 min',
    isFeatured: false,
    order: 5,
  },
  {
    youtubeId: 'nKbWdKD7Fes',
    title: 'Prayer for Healing',
    description: 'A guided prayer for those who are sick or suffering.',
    type: 'prayer',
    duration: '18 min',
    isFeatured: false,
    order: 6,
  },
  {
    youtubeId: 'v6J2bB3r1rM',
    title: 'Eucharistic Reflection',
    description: 'Stillness before the Blessed Sacrament.',
    type: 'reflection',
    duration: '20 min',
    isFeatured: false,
    order: 7,
  },
] as const

const testimonies = [
  {
    name: 'Anonymous',
    text: "Some weeks ago I asked for prayer for my mother's surgery. It went well and she is recovering at home. Thank you to everyone who prayed — I felt carried.",
  },
  {
    name: 'Joseph, Lagos',
    text: 'I was struggling to pray after losing my job. Joining the Friday prayer gave me peace again. I have since found work. Glory to God.',
  },
] as const

const textNode = (value: string) => ({
  type: 'text' as const,
  detail: 0,
  format: 0,
  mode: 'normal' as const,
  style: '',
  text: value,
  version: 1,
})

const richText = (value: string) => ({
  root: {
    type: 'root' as const,
    children: value.split('\n\n').map((paragraph) => ({
      type: 'paragraph' as const,
      children: [textNode(paragraph)],
      direction: 'ltr' as const,
      format: '' as const,
      indent: 0,
      textFormat: 0,
      version: 1,
    })),
    direction: 'ltr' as const,
    format: '' as const,
    indent: 0,
    version: 1,
  },
})

async function ensureHeroMedia(payload: Payload): Promise<string> {
  const existing = await payload.find({
    collection: 'media',
    where: { alt: { equals: HERO_ALT } },
    limit: 1,
    depth: 0,
    overrideAccess: true,
  })
  if (existing.docs[0]) return String(existing.docs[0].id)

  const created = await payload.create({
    collection: 'media',
    data: { alt: HERO_ALT },
    filePath: HERO_PATH,
    overrideAccess: true,
  })
  return String(created.id)
}

async function main(): Promise<void> {
  loadEnv()
  assertDevOnly()
  process.env.RESEND_API_KEY = ''

  const { default: configPromise } = await import('../payload.config')
  const payload = await getPayload({ config: configPromise })

  const heroImage = await ensureHeroMedia(payload)
  await payload.updateGlobal({
    slug: 'prayer-room-settings',
    data: { ...globalContent, heroImage } as never,
    overrideAccess: true,
  })

  for (const title of retiredRoomTitles) {
    const existing = await payload.find({
      collection: 'prayer-rooms',
      where: { title: { equals: title } },
      limit: 1,
      depth: 0,
      overrideAccess: true,
    })
    if (existing.docs[0]) {
      await payload.update({
        collection: 'prayer-rooms',
        id: existing.docs[0].id,
        data: { isActive: false },
        overrideAccess: true,
      })
    }
  }

  let roomsTouched = 0
  for (const room of rooms) {
    const existing = await payload.find({
      collection: 'prayer-rooms',
      where: { title: { equals: room.title } },
      limit: 1,
      depth: 0,
      overrideAccess: true,
    })
    const data = { ...room, isActive: true, image: heroImage } as never
    if (existing.docs[0]) {
      await payload.update({
        collection: 'prayer-rooms',
        id: existing.docs[0].id,
        data,
        overrideAccess: true,
      })
    } else {
      await payload.create({ collection: 'prayer-rooms', data, overrideAccess: true })
    }
    roomsTouched += 1
  }

  for (const text of retiredIntentionTexts) {
    const existing = await payload.find({
      collection: 'prayer-requests',
      where: { intention: { equals: text } },
      limit: 1,
      depth: 0,
      overrideAccess: true,
    })
    if (existing.docs[0]) {
      await payload.update({
        collection: 'prayer-requests',
        id: existing.docs[0].id,
        data: { status: 'archived' },
        overrideAccess: true,
      })
    }
  }

  let intentionsTouched = 0
  for (const intention of intentions) {
    const existing = await payload.find({
      collection: 'prayer-requests',
      where: { intention: { equals: intention.text } },
      limit: 1,
      depth: 0,
      overrideAccess: true,
    })
    const data = {
      intention: intention.text,
      category: intention.category,
      name: intention.name || undefined,
      isAnonymous: intention.isAnonymous,
      privacy: 'public',
      consentToPublish: true,
      status: 'approved',
      prayedCount: intention.prayed,
      candleCount: intention.candles,
    } as never
    if (existing.docs[0]) {
      await payload.update({
        collection: 'prayer-requests',
        id: existing.docs[0].id,
        data,
        overrideAccess: true,
      })
    } else {
      await payload.create({ collection: 'prayer-requests', data, overrideAccess: true })
    }
    intentionsTouched += 1
  }

  let prayersTouched = 0
  for (const prayer of prayers) {
    const existing = await payload.find({
      collection: 'prayer',
      where: { slug: { equals: prayer.slug } },
      limit: 1,
      depth: 0,
      draft: true,
      overrideAccess: true,
    })
    const data = {
      title: prayer.title,
      slug: prayer.slug,
      category: prayer.category,
      excerpt: prayer.text.split('\n\n')[0]?.slice(0, 220),
      content: richText(prayer.text),
      _status: 'published',
      publishedAt: new Date().toISOString(),
      views: 0,
    } as never
    if (existing.docs[0]) {
      await payload.update({
        collection: 'prayer',
        id: existing.docs[0].id,
        data,
        overrideAccess: true,
      })
    } else {
      await payload.create({ collection: 'prayer', data, overrideAccess: true })
    }
    prayersTouched += 1
  }

  let videosTouched = 0
  for (const video of videos) {
    const existing = await payload.find({
      collection: 'prayer-videos',
      where: { youtubeId: { equals: video.youtubeId } },
      limit: 1,
      depth: 0,
      overrideAccess: true,
    })
    const data = video as never
    if (existing.docs[0]) {
      await payload.update({
        collection: 'prayer-videos',
        id: existing.docs[0].id,
        data,
        overrideAccess: true,
      })
    } else {
      await payload.create({ collection: 'prayer-videos', data, overrideAccess: true })
    }
    videosTouched += 1
  }

  let testimoniesTouched = 0
  for (const testimony of testimonies) {
    const existing = await payload.find({
      collection: 'prayer-testimonies',
      where: { text: { equals: testimony.text } },
      limit: 1,
      depth: 0,
      overrideAccess: true,
    })
    const data = {
      name: testimony.name,
      text: testimony.text,
      consentToPublish: true,
      status: 'published',
    } as never
    if (existing.docs[0]) {
      await payload.update({
        collection: 'prayer-testimonies',
        id: existing.docs[0].id,
        data,
        overrideAccess: true,
      })
    } else {
      await payload.create({ collection: 'prayer-testimonies', data, overrideAccess: true })
    }
    testimoniesTouched += 1
  }

  payload.logger.info(`Prayer Room hero media: ${heroImage}`)
  payload.logger.info(
    `Prayer Room seed complete: ${roomsTouched} rooms, ${intentionsTouched} intentions, ${prayersTouched} prayers, ${videosTouched} videos, ${testimoniesTouched} thanksgivings.`,
  )
  payload.logger.info('Manage everything in Payload admin → Prayer Room.')
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
