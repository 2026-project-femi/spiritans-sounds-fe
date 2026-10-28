import { Redis } from '@upstash/redis'

let client: Redis | null | undefined

function getRedis(): Redis | null {
  if (client !== undefined) return client

  const url = process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN
  client = url && token ? new Redis({ url, token }) : null
  return client
}

/**
 * Fixed-window rate limit. Fails open when Redis is not configured or
 * unreachable so a transient cache outage never blocks legitimate submissions.
 */
export async function consumeRateLimit(
  key: string,
  limit: number,
  windowSeconds: number,
): Promise<boolean> {
  const redis = getRedis()
  if (!redis) return true

  try {
    const count = await redis.incr(key)
    if (count === 1) await redis.expire(key, windowSeconds)
    return count <= limit
  } catch (error) {
    console.error('Rate limit check failed:', error)
    return true
  }
}
