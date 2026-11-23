import { Resend } from 'resend'

interface PrayerRoomNotification {
  reference: string
  name: string
  email: string
  category: string
  intention: string
  isAnonymous: boolean
  consentToPublish: boolean
}

const escapeHtml = (value: string): string =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')

/**
 * Notifies the prayer team about a new intention. Delivery is best-effort and
 * must never block the public submission.
 */
export async function sendPrayerRoomAdminNotification(
  data: PrayerRoomNotification,
): Promise<boolean> {
  if (!process.env.RESEND_API_KEY || !process.env.ADMIN_EMAIL) return false

  const from = `${process.env.SMTP_FROM_NAME || 'Spiritans Sounds'} <${process.env.SMTP_FROM_EMAIL}>`
  const displayName = data.isAnonymous ? 'Anonymous' : data.name || 'Unnamed'

  try {
    const resend = new Resend(process.env.RESEND_API_KEY)
    const { error } = await resend.emails.send({
      from,
      to: process.env.ADMIN_EMAIL,
      subject: `Prayer Room: new ${data.category} intention`,
      html: `
        <div style="font-family: Arial, sans-serif; color: #1f2937; max-width: 600px;">
          <h2 style="margin: 0 0 16px;">New prayer intention</h2>
          <table style="border-collapse: collapse; width: 100%; font-size: 14px;">
            <tr><td style="padding: 6px 0; color: #6b7280;">Reference</td><td style="padding: 6px 0;"><strong>${escapeHtml(data.reference)}</strong></td></tr>
            <tr><td style="padding: 6px 0; color: #6b7280;">Name</td><td style="padding: 6px 0;">${escapeHtml(displayName)}</td></tr>
            <tr><td style="padding: 6px 0; color: #6b7280;">Category</td><td style="padding: 6px 0;">${escapeHtml(data.category)}</td></tr>
            ${
              data.email
                ? `<tr><td style="padding: 6px 0; color: #6b7280;">Email</td><td style="padding: 6px 0;">${escapeHtml(data.email)}</td></tr>`
                : ''
            }
            <tr><td style="padding: 6px 0; color: #6b7280;">Share on wall</td><td style="padding: 6px 0;">${data.consentToPublish ? 'Yes' : 'No'}</td></tr>
          </table>
          <p style="margin: 20px 0 8px; color: #6b7280; font-size: 14px;">Intention</p>
          <p style="margin: 0; white-space: pre-wrap; font-size: 14px;">${escapeHtml(data.intention)}</p>
          <p style="margin-top: 24px; font-size: 12px; color: #6b7280;">Review, approve and reply from Payload admin → Prayer Room → Prayer Requests.</p>
        </div>
      `,
    })

    if (error) {
      console.error('Failed to send Prayer Room notification:', error.message || error)
      return false
    }
    return true
  } catch (error) {
    console.error('Failed to send Prayer Room notification:', error)
    return false
  }
}
