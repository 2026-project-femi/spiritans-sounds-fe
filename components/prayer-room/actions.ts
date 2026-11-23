'use server'

import { revalidatePath } from 'next/cache'
import { headers } from 'next/headers'
import { getPayload } from 'payload'
import configPromise from '@/payload.config'
import { consumeRateLimit } from '@/lib/rateLimit'
import {
  partnerApplicationSchema,
  partnerRequestSchema,
  prayerRequestSchema,
  testimonySchema,
  type PartnerFormInput,
  type PartnerResult,
  type PrayerRequestInput,
  type PrayerRequestResult,
  type TestimonyInput,
  type TestimonyResult,
} from './schema'

const GENERIC_ERROR = 'Something went wrong. Please try again.'

async function clientKey(prefix: string): Promise<string> {
  const headerList = await headers()
  const forwarded = headerList.get('x-forwarded-for')
  const ip = forwarded?.split(',')[0]?.trim() || headerList.get('x-real-ip') || 'unknown'
  return `${prefix}:${ip}`
}

async function isRateLimited(prefix: string, limit = 5, windowSeconds = 600): Promise<boolean> {
  const allowed = await consumeRateLimit(await clientKey(prefix), limit, windowSeconds)
  return !allowed
}

const payloadClient = () => getPayload({ config: configPromise })

export async function submitPrayerRequestAction(
  input: PrayerRequestInput,
): Promise<PrayerRequestResult> {
  const parsed = prayerRequestSchema.safeParse(input)
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? 'Please check the form.' }
  }

  if (parsed.data.website) {
    return { ok: true, message: 'Your intention has been received.' }
  }

  if (await isRateLimited('prayer-room:intention')) {
    return { ok: false, error: 'Too many submissions. Please try again later.' }
  }

  try {
    const payload = await payloadClient()
    await payload.create({
      collection: 'prayer-requests',
      overrideAccess: true,
      data: {
        intention: parsed.data.intention,
        category: parsed.data.category as never,
        privacy: parsed.data.privacy,
        isAnonymous: Boolean(parsed.data.isAnonymous),
        name: parsed.data.name || undefined,
        email: parsed.data.email || undefined,
        consentToPublish: parsed.data.privacy === 'public',
        status: 'pending',
      },
    })

    return {
      ok: true,
      message:
        'Your intention has been received. It will be reviewed with care, and the community is with you in prayer.',
    }
  } catch (error) {
    console.error('Prayer intention submission failed:', error)
    return { ok: false, error: GENERIC_ERROR }
  }
}

export type PrayerActionKind = 'pray' | 'candle'

export type PrayerActionResult =
  | { ok: true; prayed: number; candles: number }
  | { ok: false; error: string }

export async function recordPrayerAction(
  intentionId: string,
  kind: PrayerActionKind,
): Promise<PrayerActionResult> {
  if (!intentionId || (kind !== 'pray' && kind !== 'candle')) {
    return { ok: false, error: 'Invalid prayer action.' }
  }

  if (await isRateLimited('prayer-room:action', 40, 600)) {
    return { ok: false, error: 'Please slow down and try again in a moment.' }
  }

  try {
    const payload = await payloadClient()
    const intention = await payload.findByID({
      collection: 'prayer-requests',
      id: intentionId,
      depth: 0,
    })

    if (intention.status !== 'approved' || intention.privacy !== 'public') {
      return { ok: false, error: 'This intention is no longer available for public prayer.' }
    }

    const prayed = Number(intention.prayedCount ?? 0) + 1
    const candles =
      Number(intention.candleCount ?? 0) + (kind === 'candle' ? 1 : 0)

    await payload.update({
      collection: 'prayer-requests',
      id: intentionId,
      overrideAccess: true,
      data: { prayedCount: prayed, candleCount: candles },
    })

    await payload.create({
      collection: 'prayer-activities',
      overrideAccess: true,
      data: { type: kind, intention: intentionId },
    })

    for (const path of [
      '/prayer-room',
      '/prayer-room/pray',
      '/prayer-room/chapel',
      '/prayer-room/notifications',
    ]) {
      revalidatePath(path)
    }

    return { ok: true, prayed, candles }
  } catch (error) {
    console.error('Prayer action failed:', error)
    return { ok: false, error: 'Your prayer could not be recorded. Please try again.' }
  }
}

export async function submitTestimonyAction(input: TestimonyInput): Promise<TestimonyResult> {
  const parsed = testimonySchema.safeParse(input)
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? 'Please check the form.' }
  }

  if (parsed.data.website) return { ok: true }

  if (await isRateLimited('prayer-room:testimony')) {
    return { ok: false, error: 'Too many submissions. Please try again later.' }
  }

  try {
    const payload = await payloadClient()
    await payload.create({
      collection: 'prayer-testimonies',
      overrideAccess: true,
      data: {
        name: parsed.data.name || undefined,
        text: parsed.data.text,
        relatedIntention: parsed.data.relatedIntention || undefined,
        consentToPublish: true,
        status: 'pending',
      },
    })
    revalidatePath('/prayer-room/give-thanks')
    return { ok: true }
  } catch (error) {
    console.error('Testimony submission failed:', error)
    return { ok: false, error: GENERIC_ERROR }
  }
}

export async function submitPartnerFormAction(input: PartnerFormInput): Promise<PartnerResult> {
  if (input.kind === 'request') {
    const parsed = partnerRequestSchema.safeParse(input)
    if (!parsed.success) {
      return { ok: false, error: parsed.error.issues[0]?.message ?? 'Please check the form.' }
    }
    if (parsed.data.website) return { ok: true }
    if (await isRateLimited('prayer-room:partner-request')) {
      return { ok: false, error: 'Too many submissions. Please try again later.' }
    }

    try {
      const payload = await payloadClient()
      await payload.create({
        collection: 'prayer-partner-requests',
        overrideAccess: true,
        data: {
          kind: 'request',
          name: parsed.data.name,
          email: parsed.data.email,
          category: parsed.data.category as never,
          message: parsed.data.message,
          supportType: parsed.data.supportType,
          duration: parsed.data.duration,
          privacy: parsed.data.privacy,
          receiveMessages: Boolean(parsed.data.receiveMessages),
          status: 'new',
        },
      })
      revalidatePath('/prayer-room/prayer-partners')
      return { ok: true }
    } catch (error) {
      console.error('Prayer partner request failed:', error)
      return { ok: false, error: GENERIC_ERROR }
    }
  }

  const parsed = partnerApplicationSchema.safeParse(input)
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? 'Please check the form.' }
  }
  if (parsed.data.website) return { ok: true }
  if (await isRateLimited('prayer-room:partner-application')) {
    return { ok: false, error: 'Too many submissions. Please try again later.' }
  }

  try {
    const payload = await payloadClient()
    await payload.create({
      collection: 'prayer-partner-requests',
      overrideAccess: true,
      data: {
        kind: 'application',
        name: parsed.data.name,
        email: parsed.data.email,
        location: parsed.data.location,
        areas: parsed.data.areas as never,
        availability: parsed.data.availability,
        frequency: parsed.data.frequency,
        message: parsed.data.message,
        confidentialityAgreed: true,
        safeguardingAgreed: true,
        status: 'new',
      },
    })
    revalidatePath('/prayer-room/prayer-partners')
    return { ok: true }
  } catch (error) {
    console.error('Prayer partner application failed:', error)
    return { ok: false, error: GENERIC_ERROR }
  }
}
