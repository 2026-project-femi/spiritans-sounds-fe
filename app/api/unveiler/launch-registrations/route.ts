import { getPayload } from 'payload'
import config from '@/payload.config'
import { NextResponse } from 'next/server'
import { sendBookLaunchConfirmationEmail } from '@/lib/emails/sendEmail'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { fullName, email, whatsapp, country, bookSlug, bookTitle, source } = body

    if (!fullName || typeof fullName !== 'string' || !fullName.trim()) {
      return NextResponse.json(
        { error: 'Please provide your full name.' },
        { status: 400 }
      )
    }

    if (!email || typeof email !== 'string' || !email.trim()) {
      return NextResponse.json(
        { error: 'Please provide a valid email address.' },
        { status: 400 }
      )
    }

    const trimmedEmail = email.trim().toLowerCase()
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(trimmedEmail)) {
      return NextResponse.json(
        { error: 'Please provide a valid email address format.' },
        { status: 400 }
      )
    }

    const payload = await getPayload({ config })
    const targetSlug = (bookSlug && typeof bookSlug === 'string' && bookSlug.trim()) || 'behind-the-veil'
    const targetTitle = (bookTitle && typeof bookTitle === 'string' && bookTitle.trim()) || 'Behind the Veil'

    // Fetch Book Launch Settings configured in Admin Dashboard
    let launchSettings: any = null
    try {
      launchSettings = await payload.findGlobal({
        slug: 'book-launch-settings' as any,
      })
    } catch {
      // Graceful fallback if settings haven't been saved yet
    }

    // Check for existing registration
    const existing = await payload.find({
      collection: 'book-launch-registrations',
      where: {
        and: [
          { email: { equals: trimmedEmail } },
          { bookSlug: { equals: targetSlug } },
        ],
      },
      limit: 1,
    })

    if (existing.docs.length > 0) {
      const existingDoc = existing.docs[0]
      // Optionally update WhatsApp or Country if newly provided
      await payload.update({
        collection: 'book-launch-registrations',
        id: existingDoc.id,
        data: {
          fullName: fullName.trim(),
          ...(whatsapp ? { whatsapp: String(whatsapp).trim() } : {}),
          ...(country ? { country: String(country).trim() } : {}),
        },
      })

      // Send or re-send confirmation email with meeting link
      if (launchSettings?.sendConfirmationEmail !== false) {
        sendBookLaunchConfirmationEmail({
          to: trimmedEmail,
          fullName: fullName.trim(),
          bookTitle: launchSettings?.bookTitle || targetTitle,
          meetingLink: launchSettings?.meetingLink || '',
          meetingPlatform: launchSettings?.meetingPlatform || 'Online',
          meetingPasscode: launchSettings?.meetingPasscode || '',
          eventDate: launchSettings?.eventDate || 'Saturday, 21 November 2026',
          customNote: launchSettings?.customNote || '',
        }).catch((err) => console.error('Failed to send confirmation email:', err))
      }

      return NextResponse.json({
        success: true,
        alreadyRegistered: true,
        message: "You are already on the launch guest list! We've updated your information and sent confirmation details to your email.",
        hasMeetingLink: Boolean(launchSettings?.meetingLink),
      })
    }

    const created = await payload.create({
      collection: 'book-launch-registrations',
      data: {
        fullName: fullName.trim(),
        email: trimmedEmail,
        whatsapp: whatsapp ? String(whatsapp).trim() : '',
        country: country ? String(country).trim() : '',
        book: targetTitle,
        bookSlug: targetSlug,
        source: source ? String(source).trim() : 'landing-page',
        reminderSent: false,
        attended: false,
      },
    })

    // Send instant confirmation email with meeting link if configured
    if (launchSettings?.sendConfirmationEmail !== false) {
      sendBookLaunchConfirmationEmail({
        to: trimmedEmail,
        fullName: fullName.trim(),
        bookTitle: launchSettings?.bookTitle || targetTitle,
        meetingLink: launchSettings?.meetingLink || '',
        meetingPlatform: launchSettings?.meetingPlatform || 'Online',
        meetingPasscode: launchSettings?.meetingPasscode || '',
        eventDate: launchSettings?.eventDate || 'Saturday, 21 November 2026',
        customNote: launchSettings?.customNote || '',
      }).catch((err) => console.error('Failed to send confirmation email:', err))
    }

    return NextResponse.json({
      success: true,
      message: "You're registered for the Behind the Veil online launch! A confirmation email with access details has been sent.",
      id: created.id,
      hasMeetingLink: Boolean(launchSettings?.meetingLink),
    })
  } catch (error) {
    console.error('Error creating book launch registration:', error)
    return NextResponse.json(
      { error: 'Failed to process registration. Please try again.' },
      { status: 500 }
    )
  }
}

