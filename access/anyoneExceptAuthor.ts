import type { Access } from 'payload'

/**
 * Publicly readable, but hidden from the `author` role so authors cannot browse
 * content collections in the Payload admin. Public/frontend reads (no user) and
 * all other staff roles are unaffected.
 */
export const anyoneExceptAuthor: Access = ({ req: { user } }) => {
  return user?.role !== 'author'
}
