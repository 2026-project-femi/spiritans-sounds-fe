export const DEFAULT_LAUNCH_TIMEZONE = 'Africa/Lagos'

function parseLaunchDate(value?: string | Date | null): Date | null {
  if (!value) return null
  const date = value instanceof Date ? value : new Date(value)
  return Number.isNaN(date.getTime()) ? null : date
}

/** Normalises any accepted date value to an ISO string for countdown/metadata. */
export function toLaunchISO(value?: string | Date | null): string | null {
  const date = parseLaunchDate(value)
  return date ? date.toISOString() : null
}

/** e.g. "Saturday, 21 November 2026" */
export function formatLaunchDate(
  value?: string | Date | null,
  timeZone: string = DEFAULT_LAUNCH_TIMEZONE,
): string | null {
  const date = parseLaunchDate(value)
  if (!date) return null
  try {
    return new Intl.DateTimeFormat('en-GB', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      timeZone,
    }).format(date)
  } catch {
    return new Intl.DateTimeFormat('en-GB', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(date)
  }
}

/** e.g. "5:00 pm (GMT+1)" */
export function formatLaunchTime(
  value?: string | Date | null,
  timeZone: string = DEFAULT_LAUNCH_TIMEZONE,
): string | null {
  const date = parseLaunchDate(value)
  if (!date) return null
  try {
    return new Intl.DateTimeFormat('en-GB', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
      timeZone,
      timeZoneName: 'short',
    }).format(date)
  } catch {
    return new Intl.DateTimeFormat('en-GB', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    }).format(date)
  }
}

/** e.g. "Saturday, 21 November 2026 at 5:00 pm (GMT+1)" */
export function formatLaunchDateTime(
  value?: string | Date | null,
  timeZone: string = DEFAULT_LAUNCH_TIMEZONE,
): string | null {
  const date = formatLaunchDate(value, timeZone)
  const time = formatLaunchTime(value, timeZone)
  if (!date) return null
  return time ? `${date} at ${time}` : date
}
