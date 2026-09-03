'use server'

import { getPayload } from 'payload'
import configPromise from '@/payload.config'
import { cookies, headers } from 'next/headers'
import { sendPayoutRequestAdminNotification } from '@/lib/emails/sendEmail'

export async function requestPayoutAction() {
  try {
    const payload = await getPayload({ config: configPromise })
    const req = {
      headers: await headers(),
      cookies: await cookies(),
    }

    const { user } = await payload.auth(req as any)
    if (!user) {
      return { success: false, error: 'Unauthorized' }
    }

    // 1. Calculate Author's Total Earnings from Orders
    // We fetch all publications by this author first to get their book IDs
    const booksRes = await payload.find({
      collection: "publications",
      where: { author: { equals: user.id } },
      limit: 100,
    })
    const bookIds = booksRes.docs.map((b) => b.id)

    let authorTotalEarnings = 0
    if (bookIds.length > 0) {
      const ordersRes = await payload.find({
        collection: "orders",
        where: {
          status: { equals: "completed" },
          "items.value": { in: bookIds },
        },
        limit: 1000,
      })
      
      ordersRes.docs.forEach((order: any) => {
        authorTotalEarnings += order.authorEarnings || 0
      })
    }

    // 2. Fetch Payouts to calculate what has already been paid/pending
    const payoutsRes = await payload.find({
      collection: "payouts",
      where: { author: { equals: user.id } },
      limit: 100,
    })

    const payouts = payoutsRes.docs
    let amountUnavailable = 0
    let hasPending = false

    payouts.forEach((p: any) => {
      // Any payout that is completed, processing, or pending counts against available balance
      if (['completed', 'processing', 'pending', 'paid'].includes(p.status)) {
        amountUnavailable += p.amount || 0
      }
      if (p.status === 'pending') {
        hasPending = true
      }
    })

    if (hasPending) {
        return { success: false, error: 'You already have a payout request pending.' }
    }

    const availableBalance = authorTotalEarnings - amountUnavailable

    // 3. Fetch Minimum Threshold
    let minimumPayoutThreshold = 5000
    try {
        const settings = await payload.findGlobal({ slug: 'commission-settings' })
        if (settings && settings.minimumPayoutThreshold) {
            minimumPayoutThreshold = settings.minimumPayoutThreshold
        }
    } catch (e) {
        // use default 5000
    }

    if (availableBalance < minimumPayoutThreshold) {
      return { success: false, error: `Your available balance (₦${availableBalance}) is below the minimum threshold of ₦${minimumPayoutThreshold}.` }
    }

    // 4. Create Payout Request
    const reference = `PAYOUT-${Date.now()}-${Math.floor(Math.random() * 1000)}`
    
    await payload.create({
      collection: 'payouts',
      data: {
        author: user.id,
        amount: availableBalance,
        status: 'pending',
        reference,
      }
    })

    // 5. Send notification to admin
    await sendPayoutRequestAdminNotification({
      authorName: user.name || "Unknown Author",
      authorEmail: user.email,
      amount: availableBalance,
    })

    return { success: true, message: 'Payout requested successfully.' }

  } catch (error: any) {
    console.error('Payout request error:', error)
    return { success: false, error: error.message || 'An error occurred while requesting payout.' }
  }
}
