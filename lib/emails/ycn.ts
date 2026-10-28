import { Resend } from 'resend'

interface YcnAdminNotification {
  kind: 'mentor' | 'opportunity'
  name: string
  email: string
  reference: string
  summary: string
}

const escapeHtml = (value: string): string =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')

/**
 * Notifies the programme inbox about a new Young Creators application.
 * Email delivery is best-effort: a failure must never block the submission.
 */
export async function sendYcnAdminNotification(data: YcnAdminNotification): Promise<boolean> {
  if (!process.env.RESEND_API_KEY || !process.env.ADMIN_EMAIL) return false

  const from = `${process.env.SMTP_FROM_NAME || 'Spiritans Sounds'} <${process.env.SMTP_FROM_EMAIL}>`
  const label = data.kind === 'mentor' ? 'Mentor Application' : 'Opportunity Offer'

  try {
    const resend = new Resend(process.env.RESEND_API_KEY)
    const { error } = await resend.emails.send({
      from,
      to: process.env.ADMIN_EMAIL,
      subject: `Young Creators: new ${label} from ${escapeHtml(data.name)}`,
      html: `
        <div style="font-family: Arial, sans-serif; color: #1f2937; max-width: 600px;">
          <h2 style="margin: 0 0 16px;">New ${escapeHtml(label)}</h2>
          <table style="border-collapse: collapse; width: 100%; font-size: 14px;">
            <tr><td style="padding: 6px 0; color: #6b7280;">Reference</td><td style="padding: 6px 0;"><strong>${escapeHtml(data.reference)}</strong></td></tr>
            <tr><td style="padding: 6px 0; color: #6b7280;">Name</td><td style="padding: 6px 0;">${escapeHtml(data.name)}</td></tr>
            <tr><td style="padding: 6px 0; color: #6b7280;">Email</td><td style="padding: 6px 0;">${escapeHtml(data.email)}</td></tr>
          </table>
          <p style="margin: 20px 0 8px; color: #6b7280; font-size: 14px;">Summary</p>
          <p style="margin: 0; white-space: pre-wrap; font-size: 14px;">${escapeHtml(data.summary)}</p>
          <p style="margin-top: 24px; font-size: 12px; color: #6b7280;">Review and manage this record in the Payload admin under Young Creators.</p>
        </div>
      `,
    })

    if (error) {
      console.error('Failed to send Young Creators admin notification:', error.message || error)
      return false
    }
    return true
  } catch (error) {
    console.error('Failed to send Young Creators admin notification:', error)
    return false
  }
}
