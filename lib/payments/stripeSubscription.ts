import type Stripe from 'stripe'
import type { Payload } from 'payload'
import { sendThankYouEmail } from '@/lib/emails/sendEmail'

/**
 * Records a paid subscription invoice (initial payment and renewals) as a
 * donation. The initial subscription payment is deliberately not recorded from
 * `checkout.session.completed`; `invoice.paid` is the single source of truth.
 */
export async function recordSubscriptionDonation(invoice: Stripe.Invoice, payloadCms: Payload) {
    const subscriptionDetails = invoice.parent?.subscription_details;

    // Only subscription invoices carry this. One-off invoices are ignored.
    if (!subscriptionDetails) return;

    const metadata = subscriptionDetails.metadata || {};

    // Only handle the subscriptions created by this application.
    if (metadata.type !== "donation") return;

    const reference = invoice.id;
    const amountPaid = invoice.amount_paid || 0;

    if (amountPaid <= 0) {
        console.log(`⏭️ Subscription invoice ${reference} has no paid amount, skipping`);
        return;
    }

    // Deduplication: Stripe retries webhooks, and invoice.paid may also be
    // followed by invoice.payment_succeeded.
    const existingDonation = await payloadCms.find({
        collection: 'donations',
        where: { reference: { equals: reference } },
        limit: 1,
    });

    if (existingDonation.totalDocs > 0) {
        console.log(`⏭️ Subscription donation ${reference} already processed, skipping`);
        return;
    }

    const customer = invoice.customer;
    const customerObject = customer && typeof customer === 'object' ? customer : null;
    const customerEmail =
        invoice.customer_email ||
        (customerObject && 'email' in customerObject ? customerObject.email : null) ||
        'unknown@donor.com';
    const donorName =
        metadata.donor_name ||
        (customerObject && 'name' in customerObject ? customerObject.name : null) ||
        customerEmail.split('@')[0] ||
        'Beloved Donor';

    const currency = (invoice.currency || 'USD').toUpperCase();
    const amount = amountPaid / 100;
    const paidAt = invoice.status_transitions.paid_at
        ? new Date(invoice.status_transitions.paid_at * 1000)
        : new Date();
    const formattedDate = paidAt.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });

    const designation =
        metadata.designation === 'general' ||
        metadata.designation === 'mentorship' ||
        metadata.designation === 'equipment' ||
        metadata.designation === 'showcase'
            ? metadata.designation
            : undefined;

    console.log('💵 Processing subscription donation:', {
        reference,
        amount,
        currency,
        donor: customerEmail,
        billingReason: invoice.billing_reason,
    });

    await payloadCms.create({
        collection: 'donations',
        overrideAccess: true,
        data: {
            reference,
            amount,
            currency,
            donorEmail: customerEmail,
            donorName,
            paidAt: paidAt.toISOString(),
            programme: metadata.programme === 'young-creators' ? 'young-creators' : 'general',
            designation,
            supportFrequency: 'monthly',
        },
    });

    // Receipts are best-effort: a mail outage must not cause Stripe to retry
    // a payment that was already recorded.
    try {
        await sendThankYouEmail({
            to: customerEmail,
            subject: `🙏 Thank You for Your Monthly Gift of ${currency} ${amount.toLocaleString()}`,
            donorName,
            amount,
            currency,
            transactionReference: reference,
            date: formattedDate,
        });
    } catch (emailError) {
        console.error(`Failed to send subscription receipt for ${reference}:`, emailError);
    }

    console.log(`✅ Successfully processed subscription donation ${reference}`);
}

