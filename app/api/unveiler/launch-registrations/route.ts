import { getPayload } from 'payload'
import config from '@/payload.config'
import { NextResponse } from 'next/server'

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

      return NextResponse.json({
        success: true,
        alreadyRegistered: true,
        message: "You are already on the launch guest list! We've updated your information.",
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

    return NextResponse.json({
      success: true,
      message: "You're registered for the Behind the Veil online launch! Details will follow by email.",
      id: created.id,
    })
  } catch (error) {
    console.error('Error creating book launch registration:', error)
    return NextResponse.json(
      { error: 'Failed to process registration. Please try again.' },
      { status: 500 }
    )
  }
}
