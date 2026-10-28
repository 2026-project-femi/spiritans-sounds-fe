import type { GlobalAfterChangeHook } from 'payload'

import { safeRevalidateTag } from '@/lib/revalidate'

export const revalidateHeader: GlobalAfterChangeHook = ({ doc, req: { payload, context } }) => {
  if (!context.disableRevalidate) {
    payload.logger.info(`Revalidating header`)

    safeRevalidateTag('global_header', 'max')
  }

  return doc
}
