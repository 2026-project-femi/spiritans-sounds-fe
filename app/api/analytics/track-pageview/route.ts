import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'

export async function POST(req: Request) {
  try {
    const { path, title } = await req.json()

    if (!path || typeof path !== 'string') {
      return NextResponse.json({ message: 'Missing required parameter: path' }, { status: 400 })
    }

    // Only accept relative, same-site paths to avoid open-redirect / junk rows.
    if (!path.startsWith('/') || path.startsWith('//') || path.length > 500) {
      return NextResponse.json({ message: 'Invalid path' }, { status: 400 })
    }

    const payload = await getPayload({ config })

    const existing = await payload.find({
      collection: 'pageViews',
      where: { path: { equals: path } },
      limit: 1,
      depth: 0,
      overrideAccess: true,
    })

    const now = new Date().toISOString()

    if (existing.docs.length > 0) {
      const doc = existing.docs[0]
      const views = (doc.views as number) || 0
      await payload.update({
        collection: 'pageViews',
        id: doc.id,
        data: {
          views: views + 1,
          lastViewedAt: now,
          ...(title ? { title } : {}),
        },
        overrideAccess: true,
      })
      return NextResponse.json({ success: true, views: views + 1 }, { status: 200 })
    }

    try {
      const created = await payload.create({
        collection: 'pageViews',
        data: {
          path,
          title: title || undefined,
          views: 1,
          lastViewedAt: now,
        },
        overrideAccess: true,
      })
      return NextResponse.json({ success: true, views: created.views ?? 1 }, { status: 200 })
    } catch (createError) {
      // Unique-constraint race: another request created the row first, retry the increment.
      const raced = await payload.find({
        collection: 'pageViews',
        where: { path: { equals: path } },
        limit: 1,
        depth: 0,
        overrideAccess: true,
      })
      if (raced.docs.length > 0) {
        const doc = raced.docs[0]
        const views = (doc.views as number) || 0
        await payload.update({
          collection: 'pageViews',
          id: doc.id,
          data: { views: views + 1, lastViewedAt: now, ...(title ? { title } : {}) },
          overrideAccess: true,
        })
        return NextResponse.json({ success: true, views: views + 1 }, { status: 200 })
      }
      throw createError
    }
  } catch (error) {
    console.error('Error recording page view:', error)
    return NextResponse.json({ message: 'Failed to record page view' }, { status: 500 })
  }
}
