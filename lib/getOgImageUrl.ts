/**
 * Ensures an image URL is absolute for Open Graph metadata.
 * Social media crawlers (WhatsApp, Facebook, Twitter) require absolute URLs
 * to fetch OG images. Media stored locally before S3 was configured may have
 * relative paths like "/media/file.jpg" that crawlers cannot resolve.
 */
const SITE_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'https://spiritanssound.com'

export function getOgImageUrl(doc: { featuredImage?: any; coverImage?: any }): string | null {
  const media = doc.featuredImage ?? doc.coverImage
  if (!media || typeof media !== 'object') return null

  // Prefer the pre-generated OG-sized image, fall back to the original
  const rawUrl: string | undefined = media.sizes?.og?.url ?? media.url
  if (!rawUrl) return null

  // If it's already absolute, return as-is
  if (rawUrl.startsWith('http://') || rawUrl.startsWith('https://')) {
    return rawUrl
  }

  // Otherwise, prepend the site URL to make it absolute
  return `${SITE_URL}${rawUrl.startsWith('/') ? '' : '/'}${rawUrl}`
}
