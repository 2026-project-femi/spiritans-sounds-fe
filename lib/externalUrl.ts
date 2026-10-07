/**
 * Normalises a user-entered external URL so it can safely be used in an
 * `<a href>` or `<iframe src>`. Admins often type a bare domain such as
 * "zoom.com" without a scheme, which would otherwise resolve as a relative path
 * on the current domain (e.g. /unveiler/books/zoom.com → 404).
 */
export function normalizeExternalUrl(url?: string | null): string | undefined {
  if (!url) return undefined
  const trimmed = url.trim()
  if (!trimmed) return undefined

  // Non-web schemes we should pass through untouched.
  if (/^(mailto:|tel:)/i.test(trimmed)) return trimmed

  // Protocol-relative URL, e.g. //example.com/room
  if (trimmed.startsWith('//')) return `https:${trimmed}`

  // Already has an explicit scheme, e.g. https://, http://, ftp://
  if (/^[a-z][a-z0-9+.-]*:\/\//i.test(trimmed)) return trimmed

  // Bare domain / path — assume https.
  return `https://${trimmed}`
}
