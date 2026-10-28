'use server'

import { headers } from 'next/headers'
import { getPayload } from 'payload'
import configPromise from '@/payload.config'
import type { MentorApplication, OpportunityOffer, SupportIntent } from '../types'
import type { CheckoutResult, SubmitResult } from '../api/actions'
import { mentorSchema, opportunitySchema, supportSchema } from '../lib/schemas'
import { startYoungCreatorsCheckout } from '@/lib/payments/youngCreators'
import { consumeRateLimit } from '@/lib/rateLimit'

const GENERIC_ERROR = 'Something went wrong. Please try again.'

async function clientKey(prefix: string): Promise<string> {
  const headerList = await headers()
  const forwarded = headerList.get('x-forwarded-for')
  const ip = forwarded?.split(',')[0]?.trim() || headerList.get('x-real-ip') || 'unknown'
  return `${prefix}:${ip}`
}

async function isRateLimited(prefix: string, limit = 5): Promise<boolean> {
  const allowed = await consumeRateLimit(await clientKey(prefix), limit, 600)
  return !allowed
}

export async function submitMentorApplicationAction(data: MentorApplication): Promise<SubmitResult> {
  const parsed = mentorSchema.safeParse(data)
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? 'Please check the form.' }
  }

  if (await isRateLimited('ycn:mentor')) {
    return { ok: false, error: 'Too many submissions. Please try again later.' }
  }

  try {
    const payload = await getPayload({ config: configPromise })
    const doc = await payload.create({
      collection: 'ycn-mentor-applications',
      data: {
        ...parsed.data,
        phone: parsed.data.phone || undefined,
        organisation: parsed.data.organisation || undefined,
        status: 'new',
      },
      overrideAccess: true,
    })

    return { ok: true, reference: `MEN-${doc.id.slice(0, 8).toUpperCase()}` }
  } catch (error) {
    console.error('YCN mentor application failed:', error)
    return { ok: false, error: GENERIC_ERROR }
  }
}

export async function submitOpportunityAction(data: OpportunityOffer): Promise<SubmitResult> {
  const parsed = opportunitySchema.safeParse(data)
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? 'Please check the form.' }
  }

  if (await isRateLimited('ycn:opportunity')) {
    return { ok: false, error: 'Too many submissions. Please try again later.' }
  }

  try {
    const payload = await getPayload({ config: configPromise })
    const doc = await payload.create({
      collection: 'ycn-opportunities',
      data: {
        ...parsed.data,
        phone: parsed.data.phone || undefined,
        deadline: parsed.data.deadline || undefined,
        status: 'pending-review',
      },
      overrideAccess: true,
    })

    return { ok: true, reference: `OPP-${doc.id.slice(0, 8).toUpperCase()}` }
  } catch (error) {
    console.error('YCN opportunity submission failed:', error)
    return { ok: false, error: GENERIC_ERROR }
  }
}

export async function startSupportCheckoutAction(intent: SupportIntent): Promise<CheckoutResult> {
  const parsed = supportSchema.safeParse(intent)
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? 'Please check the amount.' }
  }

  if (await isRateLimited('ycn:support', 10)) {
    return { ok: false, error: 'Too many attempts. Please try again later.' }
  }

  try {
    const headerList = await headers()
    const protocol = headerList.get('x-forwarded-proto') || 'http'
    const host = headerList.get('host') || 'localhost:3000'
    const origin = process.env.NEXT_PUBLIC_SERVER_URL || `${protocol}://${host}`

    const result = await startYoungCreatorsCheckout(parsed.data as SupportIntent, origin)
    return { ok: true, ...result }
  } catch (error) {
    console.error('YCN support checkout failed:', error)
    return { ok: false, error: 'Checkout could not be started. Please try again.' }
  }
}
