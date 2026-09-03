import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'

const ALLOWED_COLLECTIONS = ['article', 'posts', 'homily', 'publications'] as const
type AllowedCollection = (typeof ALLOWED_COLLECTIONS)[number]

export async function POST(req: Request) {
  try {
    const { id, collection } = await req.json()

    if (!id || !collection) {
      return NextResponse.json({ message: 'Missing required parameters: id, collection' }, { status: 400 })
    }

    if (!ALLOWED_COLLECTIONS.includes(collection as AllowedCollection)) {
      return NextResponse.json({ message: 'Invalid collection type' }, { status: 400 })
    }

    const payload = await getPayload({ config })

    // Fetch existing document
    const doc = await payload.findByID({
      collection: collection as AllowedCollection,
      id,
      depth: 0,
    })

    if (!doc) {
      return NextResponse.json({ message: 'Document not found' }, { status: 404 })
    }

    const currentViews = (doc.views as number) || 0
    const newViews = currentViews + 1

    // Update document with incremented view count
    await payload.update({
      collection: collection as AllowedCollection,
      id,
      data: {
        views: newViews,
      },
      overrideAccess: true,
    })

    return NextResponse.json({ success: true, views: newViews }, { status: 200 })
  } catch (error) {
    console.error('Error incrementing view count:', error)
    return NextResponse.json({ message: 'Failed to record view' }, { status: 500 })
  }
}
