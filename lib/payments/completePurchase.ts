import {
  sendPreorderConfirmationEmail,
  sendPurchaseConfirmationEmail,
  sendPaperbackAdminNotification,
  sendPaperbackConfirmationEmail,
} from '@/lib/emails/sendEmail'

export interface CompletePurchaseArgs {
  payloadCms: any
  orderId: string | number
  reference: string
  formattedAmount: number
  currency: string
  paymentProcessingFee: number
  formattedDate: string
  buyerName: string
  fallbackEmail: string
}

/**
 * Shared post-payment fulfillment used by both the Paystack and Stripe webhooks.
 *
 * Marks the order completed, records the financial split, updates publication
 * stats and sends the correct confirmation email. Provider-specific concerns
 * (fee calculation, payload parsing) stay in each webhook.
 */
export async function completePurchase({
  payloadCms,
  orderId,
  reference,
  formattedAmount,
  currency,
  paymentProcessingFee,
  formattedDate,
  buyerName,
  fallbackEmail,
}: CompletePurchaseArgs): Promise<void> {
  try {
    const order = await payloadCms.findByID({
      collection: 'orders',
      id: orderId,
      depth: 2,
    })

    if (order && order.status === 'completed') {
      console.log(`⏭️ Purchase ${reference} already processed (order completed), skipping`)
      return
    }

    if (!order) {
      console.error(`❌ Order not found: ${orderId}`)
      return
    }

    const firstItem = order.items?.[0]
    const item = firstItem?.value || firstItem
    const fileDoc = item?.file

    // Single source of truth for preorder handling: the value captured at
    // checkout, falling back to the linked publication for legacy orders.
    const isPreorderOrder = Boolean(order.isPreorder ?? item?.isPreorder)

    // Physical paperbacks have no downloadable file, so the file requirement
    // only applies to non-preorder digital purchases.
    if (order.format !== 'paperback' && !isPreorderOrder && (!fileDoc || !fileDoc.url)) {
      console.error(`❌ Item or file URL not found for order ${orderId}`)
      return
    }

    let authorType = 'standard'
    const authorId = typeof item?.author === 'object' ? item.author.id : item?.author

    if (authorId) {
      try {
        const authorUser = await payloadCms.findByID({ collection: 'users', id: authorId })
        if (authorUser && authorUser.authorType) {
          authorType = authorUser.authorType
        }
      } catch (e) {
        console.error('Error fetching author for commission calculation', e)
      }
    }

    let commissionRate = 15
    try {
      const settings = await payloadCms.findGlobal({ slug: 'commission-settings' })
      commissionRate = authorType === 'young_creator' ? 0 : settings.standardCommissionRate || 15
    } catch (e) {
      console.error('Failed to load commission settings, using default', e)
    }

    const netAmount = formattedAmount - paymentProcessingFee
    const commissionAmount = Math.max(0, netAmount * (commissionRate / 100))
    const authorEarnings = Math.max(0, netAmount - commissionAmount)

    await payloadCms.update({
      collection: 'orders',
      id: orderId,
      data: {
        status: 'completed',
        paymentProcessingFee,
        commissionRate,
        commissionAmount,
        authorEarnings,
      },
    })
    console.log(`✅ Order ${orderId} marked completed`)

    if (firstItem?.relationTo === 'publications' && item?.id) {
      try {
        await payloadCms.update({
          collection: 'publications',
          id: item.id,
          data: {
            totalSales: (item.totalSales || 0) + 1,
            grossRevenue: (item.grossRevenue || 0) + formattedAmount,
          },
        })
      } catch (e) {
        console.error('Error updating publication stats', e)
      }
    }

    const downloadUrl = fileDoc?.url
      ? `${fileDoc.url}?dl=${encodeURIComponent((item.title ?? 'download') + '.pdf')}`
      : ''

    const to = order.customerEmail || fallbackEmail
    const itemTitle = item?.title ?? 'Your purchased item'

    let emailSent = false
    let retries = 3

    while (!emailSent && retries > 0) {
      try {
        if (order.format === 'paperback') {
          emailSent = await sendPaperbackConfirmationEmail({
            to,
            buyerName,
            itemTitle,
            amount: formattedAmount,
            currency,
            transactionReference: reference,
            shippingAddress: order.shippingAddress || 'As provided during checkout',
            shippingCity: order.shippingCity || '',
            shippingCountry: order.shippingCountry || '',
            shippingPhone: order.shippingPhone || '',
            date: formattedDate,
            isPreorder: isPreorderOrder,
          })

          await sendPaperbackAdminNotification({
            to,
            buyerName,
            itemTitle,
            amount: formattedAmount,
            currency,
            transactionReference: reference,
            shippingAddress: order.shippingAddress || 'As provided during checkout',
            shippingCity: order.shippingCity || '',
            shippingCountry: order.shippingCountry || '',
            shippingPhone: order.shippingPhone || '',
            date: formattedDate,
            isPreorder: isPreorderOrder,
          }).catch((e) => console.error('Admin paperback notification failed:', e))
        } else if (isPreorderOrder) {
          emailSent = await sendPreorderConfirmationEmail({
            to,
            subject: `Pre-order Confirmed: ${itemTitle}`,
            buyerName,
            itemTitle,
            downloadUrl: '',
            amount: formattedAmount,
            currency,
            transactionReference: reference,
            date: formattedDate,
          })
        } else {
          emailSent = await sendPurchaseConfirmationEmail({
            to,
            subject: `Your Download is Ready — ${itemTitle}`,
            buyerName,
            itemTitle,
            downloadUrl,
            amount: formattedAmount,
            currency,
            transactionReference: reference,
            date: formattedDate,
          })
        }
        if (emailSent) break
      } catch (emailError) {
        console.error('Email attempt failed:', emailError)
      }
      retries--
      if (retries > 0) await new Promise((resolve) => setTimeout(resolve, 2000))
    }

    if (emailSent) {
      console.log(`✅ Purchase confirmation email sent for ${reference}`)
    } else {
      console.error(`❌ Failed to send purchase email for ${reference} after 3 retries`)
    }
  } catch (error) {
    console.error('❌ Error in completePurchase:', error)
  }
}
