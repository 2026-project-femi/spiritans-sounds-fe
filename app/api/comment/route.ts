// app/api/comments/route.ts
import { getPayload } from 'payload'
import config from '../../../payload.config'
import { PostType } from '@/lib/types'

export async function POST(req: Request) {
  const { postId, name, email, comment,postType } = await req.json()

  if (!postId || !name || !email || !comment || !postType) {
    return Response.json({ message: 'Missing required fields' }, { status: 400 })
  }

  try {
    const payload = await getPayload({ config })

    await payload.create({
      collection: 'comments',
      data: {
        post: {relationTo: postType as PostType, value: postId},      // Payload relationship field — just pass the ID
        postType,
        name,
        email,
        comment,
        approved: false,   // moderation flag
      },
    })

    return Response.json({ message: 'Comment submitted for approval' }, { status: 200 })
  } catch (err) {
    console.error(err)
    return Response.json({ message: 'Failed to submit comment' }, { status: 500 })
  }
}