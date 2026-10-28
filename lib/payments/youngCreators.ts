import Stripe from 'stripe'
import type { SupportIntent } from '@/components/young-creators/types'

export interface StartCheckoutResult {
  provider: 'paystack' | 'stripe'
  redirectUrl: string
}

interface PaystackResponse {
  status: boolean
  message: string
  data?: {
    authorization_url: string
    access_code: string
    reference: string
  }
}

const getStripe = () =>
  process.env.STRIPE_SECRET_KEY
    ? new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2026-06-24.dahlia' })
    : null

const reference = () => `YCN-${Date.now()}-${Math.floor(Math.random() * 10000)}`

const productName = 'Spiritans Sound — Young Creators Network'

const designationLabel: Record<SupportIntent['designation'], string> = {
  general: 'Where most needed',
  mentorship: 'Mentoring',
  equipment: 'Tools & materials',
  showcase: 'Showcases & events',
}

/**
 * Starts a Young Creators support payment using the site's existing providers:
 * Paystack for NGN, Stripe for GBP/USD. Confirmations arrive through the
 * existing `/api/paystack/webhook` and `/api/stripe/webhook` handlers.
 */
export async function startYoungCreatorsCheckout(
  intent: SupportIntent,
  origin: string,
): Promise<StartCheckoutResult> {
  const amountSubunits = Math.round(intent.amount * 100)
  if (!Number.isFinite(amountSubunits) || amountSubunits <= 0) {
    throw new Error('Invalid support amount')
  }

  const metadata = {
    programme: 'young-creators',
    designation: intent.designation,
    frequency: intent.frequency,
    donor_name: intent.donorName,
  }

  if (intent.currency === 'NGN') {
    if (intent.frequency === 'monthly') {
      throw new Error('Monthly NGN gifts are not supported')
    }
    if (!process.env.PAYSTACK_SECRET_KEY) {
      throw new Error('Paystack is not configured')
    }

    const ref = reference()
    const response = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: intent.donorEmail,
        amount: amountSubunits,
        currency: 'NGN',
        reference: ref,
        metadata: { ...metadata, name: intent.donorName, origin },
        callback_url: `${origin}/young-creators/support/complete?reference=${encodeURIComponent(ref)}`,
      }),
    })

    const result = (await response.json()) as PaystackResponse
    if (!response.ok || !result.status || !result.data?.authorization_url) {
      console.error('Paystack Young Creators checkout error:', result.message)
      throw new Error(result.message || 'Payment initialization failed')
    }

    return { provider: 'paystack', redirectUrl: result.data.authorization_url }
  }

  const stripe = getStripe()
  if (!stripe) throw new Error('Stripe is not configured')

  const ref = reference()
  const monthly = intent.frequency === 'monthly'

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    customer_email: intent.donorEmail,
    line_items: [
      {
        price_data: {
          currency: intent.currency.toLowerCase(),
          product_data: {
            name: productName,
            description: designationLabel[intent.designation],
          },
          unit_amount: amountSubunits,
          ...(monthly ? { recurring: { interval: 'month' as const } } : {}),
        },
        quantity: 1,
      },
    ],
    mode: monthly ? 'subscription' : 'payment',
    success_url: `${origin}/young-creators/support/complete?reference=${encodeURIComponent(ref)}&status=success`,
    cancel_url: `${origin}/young-creators/support?status=cancelled`,
    metadata: {
      ...metadata,
      type: 'donation',
      reference: ref,
      origin,
    },
    ...(monthly
      ? {
          subscription_data: {
            metadata: { ...metadata, type: 'donation', reference: ref },
          },
        }
      : {
          payment_intent_data: {
            metadata: { ...metadata, type: 'donation', reference: ref },
          },
        }),
  })

  if (!session.url) throw new Error('Failed to create Stripe session')

  return { provider: 'stripe', redirectUrl: session.url }
}
