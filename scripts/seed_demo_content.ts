/**
 * Seeds demo content for LOCAL DEVELOPMENT ONLY.
 *
 * Run with: pnpm seed:demo
 *
 * - Refuses to run in production or against a non-local database.
 * - Safe to re-run: documents are matched by slug/email/comment and updated in place.
 * - Uploads only images that already exist under /public (no network calls).
 * - Does not create orders, donations or payment records.
 *
 * Optional env overrides:
 *   SEED_ADMIN_EMAIL / SEED_ADMIN_PASSWORD
 *   SEED_AUTHOR_EMAIL
 */
import path from 'node:path'
import type { Payload } from 'payload'
import { getPayload } from 'payload'
import { loadEnv } from './loadEnv'

const publicDir = path.resolve(process.cwd(), 'public')
const localHosts = new Set(['127.0.0.1', 'localhost', '::1', '[::1]'])

const DEFAULT_ADMIN = {
  email: 'demo-admin@local.test',
  password: 'dev-password-123',
  name: 'Demo Admin',
}

const DEFAULT_AUTHOR = {
  email: 'demo-author@local.test',
  password: 'dev-password-123',
  name: 'Demo Author',
  authorBio:
    'Fictional author created by the demo seed script for local development testing.',
}

type DemoImage = { file: string; alt: string }

const demoImages = {
  community: {
    file: 'young-creators/hero.jpg',
    alt: 'Demo: community gathering for a Spiritans Sounds event',
  },
  writer: {
    file: 'young-creators/writer.jpg',
    alt: 'Demo: young writer holding a notebook',
  },
  musician: {
    file: 'young-creators/musician.jpg',
    alt: 'Demo: musician performing with a guitar',
  },
  workshop: {
    file: 'young-creators/workshop.jpeg',
    alt: 'Demo: workshop participants working together',
  },
  artwork: {
    file: 'young-creators/work-painting.jpg',
    alt: 'Demo: painting displayed at an exhibition',
  },
  bookCover: {
    file: 'images/behind-the-veil/behind-the-veil-front-cover.jpeg',
    alt: 'Demo: book cover for a devotional',
  },
  portrait: {
    file: 'images/behind-the-veil/author-portrait.jpg',
    alt: 'Demo: portrait of a fictional author',
  },
} satisfies Record<string, DemoImage>

const textNode = (value: string) => ({
  type: 'text' as const,
  detail: 0,
  format: 0,
  mode: 'normal' as const,
  style: '',
  text: value,
  version: 1,
})

const paragraph = (value: string) => ({
  type: 'paragraph' as const,
  children: [textNode(value)],
  direction: 'ltr' as const,
  format: '' as const,
  indent: 0,
  textFormat: 0,
  version: 1,
})

const heading = (value: string, tag: 'h2' | 'h3' = 'h2') => ({
  type: 'heading' as const,
  children: [textNode(value)],
  direction: 'ltr' as const,
  format: '' as const,
  indent: 0,
  tag,
  version: 1,
})

const richText = (...children: Array<ReturnType<typeof paragraph> | ReturnType<typeof heading>>) => ({
  root: {
    type: 'root' as const,
    children,
    direction: 'ltr' as const,
    format: '' as const,
    indent: 0,
    version: 1,
  },
})

const daysFromNow = (days: number): string => {
  const date = new Date()
  date.setDate(date.getDate() + days)
  date.setHours(9, 0, 0, 0)
  return date.toISOString()
}

const assertDevOnly = (): void => {
  if (process.env.NODE_ENV === 'production') {
    throw new Error('Refusing to seed demo content in production (NODE_ENV=production).')
  }

  const connectionString = process.env.POSTGRES_URL
  if (!connectionString) {
    throw new Error('POSTGRES_URL is not set. Demo seeding needs a local database.')
  }

  let host: string
  try {
    host = new URL(connectionString).hostname
  } catch {
    throw new Error('POSTGRES_URL is not a valid connection URL.')
  }

  if (!localHosts.has(host)) {
    throw new Error(
      `Refusing to seed demo content into a non-local database (host: ${host}). ` +
        'Point POSTGRES_URL at 127.0.0.1/localhost first.',
    )
  }
}

const ensureMedia = async (payload: Payload, image: DemoImage): Promise<string> => {
  const filename = path.basename(image.file)
  const stem = path.parse(filename).name

  const existing = await payload.find({
    collection: 'media',
    where: {
      or: [
        { alt: { equals: image.alt } },
        { filename: { in: [filename, `${stem}.webp`] } },
      ],
    },
    limit: 1,
    depth: 0,
  })

  if (existing.docs[0]) return existing.docs[0].id

  const created = await payload.create({
    collection: 'media',
    data: { alt: image.alt },
    filePath: path.join(publicDir, image.file),
  })

  return created.id
}

type UpsertResult = { id: string; created: boolean }

const upsertBySlug = async (
  payload: Payload,
  collection: Parameters<Payload['find']>[0]['collection'],
  slug: string,
  data: Record<string, unknown>,
): Promise<UpsertResult> => {
  const existing = await payload.find({
    collection,
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 0,
    draft: true,
  })

  // Cast keeps this helper collection-agnostic; Payload validates the data at runtime.
  const payloadData = data as never

  if (existing.docs[0]) {
    const updated = await payload.update({
      collection,
      id: existing.docs[0].id,
      data: payloadData,
    })
    return { id: updated.id, created: false }
  }

  const created = await payload.create({ collection, data: payloadData })
  return { id: created.id, created: true }
}

const upsertUser = async (
  payload: Payload,
  data: { email: string; password: string; [key: string]: unknown },
): Promise<UpsertResult> => {
  const { password, ...rest } = data

  const existing = await payload.find({
    collection: 'users',
    where: { email: { equals: data.email } },
    limit: 1,
    depth: 0,
  })

  if (existing.docs[0]) {
    // Reset the password on every run so the credentials printed below always work.
    const updated = await payload.update({
      collection: 'users',
      id: existing.docs[0].id,
      data: { ...rest, password } as never,
    })
    return { id: updated.id, created: false }
  }

  const created = await payload.create({
    collection: 'users',
    data: { ...rest, password } as never,
  })
  return { id: created.id, created: true }
}

/**
 * Clears loginAttempts/lockUntil for a demo account. Payload locks an auth
 * collection after too many failed logins, which looks like "bad credentials".
 */
const unlockUser = async (payload: Payload, email: string): Promise<void> => {
  try {
    await payload.unlock({
      collection: 'users',
      data: { email } as never,
      overrideAccess: true,
    })
  } catch (error) {
    payload.logger.warn(
      `Could not unlock ${email}: ${error instanceof Error ? error.message : String(error)}`,
    )
  }
}

const upsertSubscriber = async (
  payload: Payload,
  data: { email: string; name?: string },
): Promise<UpsertResult> => {
  const existing = await payload.find({
    collection: 'subscribers',
    where: { email: { equals: data.email } },
    limit: 1,
    depth: 0,
  })

  if (existing.docs[0]) {
    const updated = await payload.update({
      collection: 'subscribers',
      id: existing.docs[0].id,
      data: { ...data, status: 'subscribed' },
    })
    return { id: updated.id, created: false }
  }

  const created = await payload.create({
    collection: 'subscribers',
    data: { ...data, status: 'subscribed' },
  })
  return { id: created.id, created: true }
}

const ensureComment = async (
  payload: Payload,
  data: {
    name: string
    email: string
    comment: string
    post?: { relationTo: 'article' | 'events' | 'homily' | 'prayer'; value: string }
    parent?: string
  },
): Promise<UpsertResult> => {
  const existing = await payload.find({
    collection: 'comments',
    where: {
      and: [
        { email: { equals: data.email } },
        { comment: { equals: data.comment } },
      ],
    },
    limit: 1,
    depth: 0,
  })

  if (existing.docs[0]) return { id: existing.docs[0].id, created: false }

  const created = await payload.create({
    collection: 'comments',
    data: { ...data, approved: true },
  })
  return { id: created.id, created: true }
}

async function main(): Promise<void> {
  loadEnv()
  assertDevOnly()

  const { default: configPromise } = await import('../payload.config')
  const payload = await getPayload({ config: configPromise })

  const admin = {
    ...DEFAULT_ADMIN,
    email: process.env.SEED_ADMIN_EMAIL ?? DEFAULT_ADMIN.email,
    password: process.env.SEED_ADMIN_PASSWORD ?? DEFAULT_ADMIN.password,
  }
  const author = {
    ...DEFAULT_AUTHOR,
    email: process.env.SEED_AUTHOR_EMAIL ?? DEFAULT_AUTHOR.email,
  }

  payload.logger.info('Seeding demo data (local development only)...')

  const counters = { created: 0, updated: 0 }
  const track = (result: UpsertResult) => {
    if (result.created) counters.created += 1
    else counters.updated += 1
    return result.id
  }

  // 1. Media
  const mediaIds = {} as Record<keyof typeof demoImages, string>
  for (const [key, image] of Object.entries(demoImages)) {
    mediaIds[key as keyof typeof demoImages] = await ensureMedia(payload, image)
  }
  payload.logger.info(`— Media ready (${Object.keys(mediaIds).length} images)`)

  // 2. Users
  const adminId = track(
    await upsertUser(payload, {
      email: admin.email,
      password: admin.password,
      name: admin.name,
      role: 'admin',
    }),
  )
  const authorId = track(
    await upsertUser(payload, {
      email: author.email,
      password: author.password,
      name: author.name,
      role: 'author',
      authorType: 'standard',
      authorBio: author.authorBio,
    }),
  )
  await unlockUser(payload, admin.email)
  await unlockUser(payload, author.email)
  payload.logger.info(`— Users ready (admin: ${adminId}, author: ${authorId}; login lockouts cleared)`)

  // 3. Categories
  const categoryIds: Record<string, string> = {}
  for (const title of ['Faith & Prayer', 'Music', 'Young Creators', 'Books']) {
    const slug = title.toLowerCase().replace(/[^\w]+/g, '-').replace(/^-|-$/g, '')
    categoryIds[title] = track(
      await upsertBySlug(payload, 'categories', slug, {
        title,
        slug,
      }),
    )
  }
  payload.logger.info('— Categories ready')

  // 4. Articles
  const articles = [
    {
      slug: 'demo-five-ways-to-pray-with-music',
      title: 'Five Ways to Pray with Music',
      author: 'Demo Author',
      excerpt:
        'Music can carry a prayer when words run out. Here are five simple ways to bring song into your daily prayer.',
      featuredImage: mediaIds.community,
      content: richText(
        paragraph(
          'Music has always been part of how the Church prays. From the psalms of the Old Testament to the hymns we sing on Sunday, song gives shape to what we believe.',
        ),
        heading('1. Begin with a single verse'),
        paragraph(
          'Choose one verse of a hymn and repeat it slowly. Let the words settle before moving on. Repetition is not repetition when the heart is attentive.',
        ),
        heading('2. Sing the psalms'),
        paragraph(
          'The psalms are the prayer book of the Church. Pick one psalm for the week and sing or listen to a setting of it each evening.',
        ),
        heading('3. Listen without multitasking'),
        paragraph(
          'Put the phone away, close your eyes, and listen to a sacred piece from beginning to end. This simple act of attention is itself a prayer.',
        ),
        paragraph(
          'This article is demo content created for local development testing.',
        ),
      ),
      publishedAt: daysFromNow(-6),
    },
    {
      slug: 'demo-quiet-power-of-the-daily-examen',
      title: 'The Quiet Power of the Daily Examen',
      author: 'Demo Author',
      excerpt:
        'Five minutes at the end of the day can change how you notice God in the ordinary.',
      featuredImage: mediaIds.portrait,
      content: richText(
        paragraph(
          'The Examen is a short prayer of reflection attributed to St. Ignatius of Loyola. It asks us to look back over the day with gratitude and honesty.',
        ),
        heading('A simple pattern'),
        paragraph(
          'Become aware of God’s presence. Give thanks. Review the day. Ask forgiveness where needed. Resolve to begin again tomorrow.',
        ),
        heading('Start small'),
        paragraph(
          'Five minutes is enough. The goal is not a perfect prayer but a habit of returning to God each day.',
        ),
        paragraph('This article is demo content created for local development testing.'),
      ),
      publishedAt: daysFromNow(-3),
    },
    {
      slug: 'demo-young-creators-shaping-catholic-media',
      title: 'Meet the Young Creators Shaping Catholic Media',
      author: 'Demo Author',
      excerpt:
        'A new generation of writers, musicians and artists is telling stories of faith with fresh honesty.',
      featuredImage: mediaIds.workshop,
      content: richText(
        paragraph(
          'Across parishes and campuses, young Catholics are picking up cameras, pens and instruments to share the Gospel in their own language.',
        ),
        heading('Formation before platform'),
        paragraph(
          'The strongest work begins with prayer and community. Technique matters, but it is formation that gives an artist something worth saying.',
        ),
        paragraph('This article is demo content created for local development testing.'),
      ),
      publishedAt: daysFromNow(-1),
    },
  ]

  const articleIds: string[] = []
  for (const article of articles) {
    articleIds.push(
      track(
        await upsertBySlug(payload, 'article', article.slug, {
          ...article,
          _status: 'published',
          views: 0,
        }),
      ),
    )
  }
  payload.logger.info(`— Articles ready (${articleIds.length})`)

  // 5. Events
  const events = [
    {
      slug: 'demo-sounds-of-advent-concert',
      title: 'Sounds of Advent: Community Concert',
      eventType: 'concert',
      date: daysFromNow(14),
      location: 'St. Michael’s Hall, Enugu',
      description:
        'An evening of Advent hymns and scripture readings with the Spiritans Sounds choir.',
      excerpt: 'An evening of Advent hymns and scripture readings.',
      featuredImage: mediaIds.musician,
      isFeatured: true,
      isPopular: true,
      body: richText(
        paragraph(
          'Join us for an evening of music and reflection as we begin the season of Advent together.',
        ),
        paragraph('This event is demo content created for local development testing.'),
      ),
      publishedAt: daysFromNow(-4),
    },
    {
      slug: 'demo-young-creators-writing-workshop',
      title: 'Young Creators Workshop: Writing with Purpose',
      eventType: 'workshop',
      date: daysFromNow(24),
      location: 'Spiritans Sounds Studio, Abuja',
      description:
        'A hands-on workshop for young writers on storytelling, editing and writing from a place of prayer.',
      excerpt: 'A hands-on storytelling and editing workshop for young writers.',
      featuredImage: mediaIds.workshop,
      isFeatured: false,
      isPopular: false,
      body: richText(
        paragraph(
          'Bring a notebook and a draft you are working on. Mentors will help you shape it for publication.',
        ),
        paragraph('This event is demo content created for local development testing.'),
      ),
      publishedAt: daysFromNow(-2),
    },
  ]

  const eventIds: string[] = []
  for (const event of events) {
    eventIds.push(
      track(
        await upsertBySlug(payload, 'events', event.slug, {
          ...event,
          _status: 'published',
          views: 0,
        }),
      ),
    )
  }
  payload.logger.info(`— Events ready (${eventIds.length})`)

  // 6. Homilies
  const homilies = [
    {
      slug: 'demo-homily-first-sunday-of-advent',
      title: 'Homily for the First Sunday of Advent',
      date: daysFromNow(-2),
      scripture: 'Jeremiah 33:14-16',
      category: 'Sunday',
      featuredImage: mediaIds.community,
      excerpt:
        'Advent asks us to wait with hope, not with fear. The promise of the Lord is near.',
      content: richText(
        paragraph(
          'On this first Sunday of Advent the Church gives us words of promise: the days are coming when the Lord will fulfil what he has promised.',
        ),
        heading('Waiting with hope'),
        paragraph(
          'Christian waiting is not passive. It is the watchfulness of a people who know that the one who is coming has already come.',
        ),
        paragraph('This homily is demo content created for local development testing.'),
      ),
      youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      publishedAt: daysFromNow(-2),
    },
    {
      slug: 'demo-homily-feast-of-christ-the-king',
      title: 'Homily for the Feast of Christ the King',
      date: daysFromNow(-9),
      scripture: 'John 18:33-37',
      category: 'Solemnity',
      featuredImage: mediaIds.artwork,
      excerpt:
        'The kingdom of Christ is not built on force but on truth, mercy and self-giving love.',
      content: richText(
        paragraph(
          'Pilate asks Jesus whether he is a king. The answer is yes, but not in the way Pilate expects.',
        ),
        heading('A kingdom of truth'),
        paragraph(
          'Christ reigns from the cross. His throne is mercy, and his crown is love offered freely.',
        ),
        paragraph('This homily is demo content created for local development testing.'),
      ),
      publishedAt: daysFromNow(-9),
    },
  ]

  const homilyIds: string[] = []
  for (const homily of homilies) {
    homilyIds.push(
      track(
        await upsertBySlug(payload, 'homily', homily.slug, {
          ...homily,
          _status: 'published',
          views: 0,
        }),
      ),
    )
  }
  payload.logger.info(`— Homilies ready (${homilyIds.length})`)

  // 7. Prayers
  const prayers = [
    {
      slug: 'demo-prayer-for-peace-in-the-family',
      title: 'A Prayer for Peace in the Family',
      category: 'Family',
      featuredImage: mediaIds.portrait,
      excerpt:
        'A short prayer for households walking through tension, asking for patience and reconciliation.',
      content: richText(
        paragraph(
          'Lord Jesus, you lived in a family at Nazareth. Look with mercy on our home.',
        ),
        paragraph(
          'Where words have been harsh, bring gentleness. Where hearts have grown distant, draw us back to one another.',
        ),
        paragraph(
          'Give us the patience to listen and the humility to ask forgiveness. Make our home a place of peace and welcome.',
        ),
        paragraph('Amen.'),
        paragraph('This prayer is demo content created for local development testing.'),
      ),
      publishedAt: daysFromNow(-5),
    },
    {
      slug: 'demo-prayer-before-study-or-work',
      title: 'Prayer Before Study or Work',
      category: 'Daily',
      featuredImage: mediaIds.writer,
      excerpt:
        'A simple prayer to offer your study, work or creative project to God.',
      content: richText(
        paragraph(
          'Lord, you call us to love you with our whole heart, mind and strength. Bless the work before me today.',
        ),
        paragraph(
          'Give me clarity of thought, honesty in my effort and generosity in what I make. Let everything I do be for your glory and the good of others.',
        ),
        paragraph('Amen.'),
        paragraph('This prayer is demo content created for local development testing.'),
      ),
      publishedAt: daysFromNow(-2),
    },
  ]

  const prayerIds: string[] = []
  for (const prayer of prayers) {
    prayerIds.push(
      track(
        await upsertBySlug(payload, 'prayer', prayer.slug, {
          ...prayer,
          _status: 'published',
          views: 0,
        }),
      ),
    )
  }
  payload.logger.info(`— Prayers ready (${prayerIds.length})`)

  // 8. Music
  const music = [
    {
      slug: 'demo-o-come-o-come-emmanuel',
      title: 'O Come, O Come, Emmanuel (Choir Arrangement)',
      artist: 'Spiritans Sounds Choir',
      featuredImage: mediaIds.musician,
      excerpt: 'A quiet choral arrangement of the ancient Advent hymn.',
      lyrics:
        'O come, O come, Emmanuel,\nAnd ransom captive Israel,\nThat mourns in lonely exile here\nUntil the Son of God appear.\n\nRejoice! Rejoice! Emmanuel\nShall come to thee, O Israel.',
      content: richText(
        paragraph(
          'Recorded live for the Advent community concert. Demo audio is not attached; add a file in the admin panel to preview playback.',
        ),
        paragraph('This track is demo content created for local development testing.'),
      ),
      publishedAt: daysFromNow(-7),
    },
    {
      slug: 'demo-mother-of-the-church',
      title: 'Mother of the Church',
      artist: 'The Spiritans Ensemble',
      featuredImage: mediaIds.artwork,
      excerpt: 'An original setting of a Marian prayer for choir and piano.',
      lyrics:
        'Mother of the Church, teach us to trust,\nTo say yes in the ordinary,\nTo carry the Word in quiet faith.',
      content: richText(
        paragraph(
          'Demo audio is not attached; add a file in the admin panel to preview playback.',
        ),
        paragraph('This track is demo content created for local development testing.'),
      ),
      publishedAt: daysFromNow(-3),
    },
  ]

  const musicIds: string[] = []
  for (const demoMusic of music) {
    musicIds.push(
      track(
        await upsertBySlug(payload, 'music', demoMusic.slug, {
          ...demoMusic,
          _status: 'published',
          views: 0,
        }),
      ),
    )
  }
  payload.logger.info(`— Music ready (${musicIds.length})`)

  // 9. Publications
  const publications = [
    {
      slug: 'demo-walking-in-the-light',
      title: 'Walking in the Light: A Short Advent Devotional',
      description:
        'A four-week devotional for Advent with daily scripture, a short reflection and a prayer. Demo book created for local testing.',
      price: 'free',
      priceAmount: 0,
      cover: mediaIds.bookCover,
      author: authorId,
      category: categoryIds['Books'],
      publishingStatus: 'published',
      publishedAt: daysFromNow(-8),
    },
    {
      slug: 'demo-notes-on-catholic-storytelling',
      title: 'Notes on Catholic Storytelling',
      description:
        'Essays on craft, faith and the vocation of the Catholic artist. Demo book created for local testing.',
      price: 'paid',
      priceAmount: 3500,
      priceAmountUSD: 5,
      priceAmountGBP: 4,
      cover: mediaIds.artwork,
      author: authorId,
      category: categoryIds['Books'],
      publishingStatus: 'published',
      publishedAt: daysFromNow(-5),
    },
  ]

  const publicationIds: string[] = []
  for (const publication of publications) {
    publicationIds.push(
      track(
        await upsertBySlug(payload, 'publications', publication.slug, {
          ...publication,
          _status: 'published',
          views: 0,
          totalSales: 0,
          grossRevenue: 0,
        }),
      ),
    )
  }
  payload.logger.info(`— Publications ready (${publicationIds.length})`)

  // 10. Comments (one thread on the first article)
  const firstArticle = articleIds[0]
  if (firstArticle) {
    const parent = await ensureComment(payload, {
      name: 'Chidi Demo',
      email: 'chidi.demo@local.test',
      comment:
        'This came at exactly the right time. Thank you for putting words to what I could not explain.',
      post: { relationTo: 'article', value: firstArticle },
    })
    track(parent)

    track(
      await ensureComment(payload, {
        name: 'Demo Editor',
        email: 'editor.demo@local.test',
        comment: 'Thank you, Chidi — glad it was helpful. We will be publishing more on prayer and music soon.',
        post: { relationTo: 'article', value: firstArticle },
        parent: parent.id,
      }),
    )
  }
  payload.logger.info('— Comments ready')

  // 11. Subscribers
  for (const subscriber of [
    { email: 'ada.demo@local.test', name: 'Ada Demo' },
    { email: 'tunde.demo@local.test', name: 'Tunde Demo' },
    { email: 'mercy.demo@local.test', name: 'Mercy Demo' },
  ]) {
    track(await upsertSubscriber(payload, subscriber))
  }
  payload.logger.info('— Subscribers ready')

  payload.logger.info(
    `Demo seed complete: ${counters.created} created, ${counters.updated} updated (or already present).`,
  )
  payload.logger.info('Admin login for local development:')
  payload.logger.info(`  email:    ${admin.email}`)
  payload.logger.info(`  password: ${admin.password}`)
  payload.logger.info(
    'Every seeded document is demo-only content. Do not run this script against production.',
  )
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
