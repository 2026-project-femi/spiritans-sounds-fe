import { revalidatePath, revalidateTag } from 'next/cache'

/**
 * Payload hooks also run outside a Next.js request context (seed scripts, CLI
 * tasks, background jobs). In that case Next throws an internal invariant for
 * `revalidatePath` / `revalidateTag`. Swallow only that specific error so real
 * revalidation failures inside the app still surface.
 */
const isMissingRequestContext = (error: unknown): boolean =>
  error instanceof Error && error.message.includes('static generation store missing')

export function safeRevalidatePath(path: string): void {
  try {
    revalidatePath(path)
  } catch (error) {
    if (!isMissingRequestContext(error)) throw error
  }
}

export function safeRevalidateTag(tag: string, profile: string = 'max'): void {
  try {
    revalidateTag(tag, profile)
  } catch (error) {
    if (!isMissingRequestContext(error)) throw error
  }
}
