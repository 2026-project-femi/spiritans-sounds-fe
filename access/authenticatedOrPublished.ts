import type { Access } from 'payload'

/**
 * Allows public (unauthenticated) access and every staff role, but denies the
 * `author` role so authors cannot browse content collections in the Payload
 * admin. Authors only ever manage their own publications (see the Publications
 * collection access rules).
 */
export const authenticatedOrPublished: Access = ({ req: { user } }) => {
  if (user?.role === 'author') {
    return false
  }

  if (user) {
    return true
  }

  return {
    _status: {
      equals: 'published',
    },
  }
}
