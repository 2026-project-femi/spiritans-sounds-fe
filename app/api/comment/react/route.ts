// app/api/comment/react/route.ts
import { getPayload } from 'payload'
import config from '../../../../payload.config'

const ALLOWED_EMOJIS = ['👍', '❤️', '🙏', '👏', '🔥', '💡']

export async function POST(req: Request) {
  try {
    const { commentId, emoji, action = 'add' } = await req.json()

    if (!commentId || !emoji) {
      return Response.json({ message: 'Missing commentId or emoji' }, { status: 400 })
    }

    if (!ALLOWED_EMOJIS.includes(emoji)) {
      return Response.json({ message: 'Emoji not allowed' }, { status: 400 })
    }

    const payload = await getPayload({ config })

    const comment = await payload.findByID({
      collection: 'comments',
      id: commentId,
    })

    if (!comment) {
      return Response.json({ message: 'Comment not found' }, { status: 404 })
    }

    const currentReactions: Record<string, number> =
      comment.reactions && typeof comment.reactions === 'object' && !Array.isArray(comment.reactions)
        ? { ...(comment.reactions as Record<string, number>) }
        : {}

    const currentCount = currentReactions[emoji] || 0

    if (action === 'remove') {
      const nextCount = Math.max(0, currentCount - 1)
      if (nextCount === 0) {
        delete currentReactions[emoji]
      } else {
        currentReactions[emoji] = nextCount
      }
    } else {
      currentReactions[emoji] = currentCount + 1
    }

    await payload.update({
      collection: 'comments',
      id: commentId,
      data: {
        reactions: currentReactions,
      },
    })

    return Response.json(
      {
        success: true,
        reactions: currentReactions,
      },
      { status: 200 }
    )
  } catch (err) {
    console.error('Error updating reaction:', err)
    return Response.json({ message: 'Failed to update reaction' }, { status: 500 })
  }
}
