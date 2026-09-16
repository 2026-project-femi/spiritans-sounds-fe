// app/api/comment/route.ts
import { getPayload } from 'payload'
import config from '../../../payload.config'
import { PostType } from '@/lib/types'

export async function POST(req: Request) {
  try {
    const { postId, name, email, comment, postType, parentId } = await req.json()

    if (!postId || !name || !email || !comment || !postType) {
      return Response.json({ message: 'Missing required fields' }, { status: 400 })
    }

    const payload = await getPayload({ config })

    let isApproved = false
    if (parentId) {
      try {
        const parentComment = await payload.findByID({
          collection: 'comments',
          id: parentId,
        })
        // Once a comment is approved, replies are approved by default
        if (parentComment && parentComment.approved) {
          isApproved = true
        }
      } catch (e) {
        console.warn('Could not verify parent comment approval:', e)
        isApproved = true // Fallback for replies
      }
    }

    const created = await payload.create({
      collection: 'comments',
      data: {
        post: { relationTo: postType as PostType, value: postId },
        name: String(name).trim(),
        email: String(email).trim(),
        comment: String(comment).trim(),
        parent: parentId || null,
        reactions: {},
        approved: isApproved,
      },
    })

    return Response.json(
      {
        message: isApproved
          ? 'Reply posted successfully!'
          : 'Comment submitted! It will appear after approval.',
        approved: isApproved,
        comment: {
          _id: String(created.id),
          name: created.name,
          email: created.email,
          comment: created.comment,
          createdAt: created.createdAt,
          parent: created.parent
            ? typeof created.parent === 'object' && 'id' in created.parent
              ? String((created.parent as { id: string | number }).id)
              : String(created.parent)
            : null,
          reactions: (created.reactions as Record<string, number>) || {},
        },
      },
      { status: 200 }
    )
  } catch (err) {
    console.error('Error in comment submission:', err)
    return Response.json({ message: 'Failed to submit comment' }, { status: 500 })
  }
}