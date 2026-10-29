const YOUTUBE_HOSTS = new Set([
  'youtube.com',
  'm.youtube.com',
  'music.youtube.com',
  'youtu.be',
  'youtube-nocookie.com',
])

/**
 * Extracts a YouTube video ID from watch, share, embed, shorts and live URLs.
 * Returns null for channels, playlists and other non-video links.
 */
export function getYouTubeId(url: string): string | null {
  try {
    const parsed = new URL(url)
    const host = parsed.hostname.replace(/^www\./, '')
    if (!YOUTUBE_HOSTS.has(host)) return null

    let id: string | null = null

    if (host === 'youtu.be') {
      id = parsed.pathname.split('/').filter(Boolean)[0] || null
    } else {
      id = parsed.searchParams.get('v')

      if (!id) {
        const parts = parsed.pathname.split('/').filter(Boolean)
        const markerIndex = parts.findIndex((part) =>
          ['embed', 'shorts', 'live', 'v'].includes(part),
        )
        if (markerIndex !== -1) id = parts[markerIndex + 1] || null
      }
    }

    // YouTube IDs are URL-safe; reject anything that could alter the embed URL.
    return id && /^[A-Za-z0-9_-]{6,}$/.test(id) ? id : null
  } catch {
    return null
  }
}

export function isYouTubeUrl(url: string): boolean {
  try {
    const host = new URL(url).hostname.replace(/^www\./, '')
    return YOUTUBE_HOSTS.has(host)
  } catch {
    return false
  }
}

export function getYouTubeEmbedUrl(
  url: string,
  options: { autoplay?: boolean; noCookie?: boolean } = {},
): string | null {
  const id = getYouTubeId(url)
  if (!id) return null

  const domain = options.noCookie ? 'www.youtube-nocookie.com' : 'www.youtube.com'
  const params = new URLSearchParams()
  if (options.autoplay) params.set('autoplay', '1')

  const query = params.toString()
  return `https://${domain}/embed/${id}${query ? `?${query}` : ''}`
}
