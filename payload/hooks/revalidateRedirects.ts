import type { CollectionAfterChangeHook } from 'payload'

import { safeRevalidateTag } from '@/lib/revalidate'

export const revalidateRedirects: CollectionAfterChangeHook = ({ doc, req: { payload } }) => {
  payload.logger.info(`Revalidating redirects`)

  safeRevalidateTag('redirects', 'max')

  return doc
}
