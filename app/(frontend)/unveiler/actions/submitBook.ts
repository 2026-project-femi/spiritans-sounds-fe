'use server'

import { getPayload } from 'payload'
import config from '@/payload.config'
import { sendBookSubmissionEmail } from '@/lib/emails/sendEmail'
import { cookies, headers } from 'next/headers'

export async function submitBookAction(formData: FormData) {
  try {
    const payload = await getPayload({ config })
    const req = {
      headers: await headers(),
      cookies: await cookies(),
    }
    const { user } = await payload.auth(req as any)

    // Extract files
    const coverFile = formData.get('bookCover') as File | null
    const pdfFile = formData.get('bookPdf') as File | null

    if (!pdfFile || pdfFile.size === 0) {
      return { success: false, error: 'Book manuscript PDF is required.' }
    }

    const fullName = (formData.get('fullName') as string)?.trim()
    const email = (formData.get('email') as string)?.trim()
    const phone = (formData.get('phone') as string)?.trim()
    const bookTitle = (formData.get('bookTitle') as string)?.trim()
    const description = (formData.get('description') as string)?.trim()

    if (!fullName || !email || !phone || !bookTitle || !description) {
      return { success: false, error: 'Please fill in all required fields (Full name, email, phone, book title, and description).' }
    }

    // Helper to upload a file to the media collection
    const uploadMedia = async (file: File, alt: string) => {
      const buffer = Buffer.from(await file.arrayBuffer())
      return await payload.create({
        collection: 'media',
        data: { alt },
        file: {
          data: buffer,
          name: file.name,
          mimetype: file.type,
          size: file.size,
        },
      })
    }

    const pdfDoc = await uploadMedia(pdfFile, `PDF for ${bookTitle}`)

    let coverDocId: string | undefined = undefined
    if (coverFile && coverFile.size > 0) {
      const coverDoc = await uploadMedia(coverFile, `Cover for ${bookTitle}`)
      coverDocId = coverDoc.id
    }

    // Create the BookSubmission
    const submission = await payload.create({
      collection: 'book-submissions',
      data: {
        submitter: user ? user.id : undefined,
        fullName,
        email,
        phone,
        country: (formData.get('country') as string) || undefined,
        authorName: (formData.get('authorName') as string) || fullName,
        bookTitle,
        description,
        authorBio: (formData.get('authorBio') as string) || undefined,
        sellingPrice: formData.get('sellingPrice') ? Number(formData.get('sellingPrice')) : 0,
        bookCover: coverDocId,
        bookPdf: pdfDoc.id,
        bankDetails: {
          bankName: (formData.get('bankName') as string) || undefined,
          accountName: (formData.get('accountName') as string) || undefined,
          accountNumber: (formData.get('accountNumber') as string) || undefined,
          sortCodeOrRoutingNumber: (formData.get('sortCodeOrRoutingNumber') as string) || undefined,
        },
        status: 'pending',
      },
    })

    // Send confirmation email
    await sendBookSubmissionEmail({
      email: submission.email,
      fullName: submission.fullName,
      bookTitle: submission.bookTitle,
    })

    return { success: true, submissionId: submission.id }
  } catch (error: any) {
    console.error('Book submission error:', error)
    return { success: false, error: error.message || 'An error occurred during submission.' }
  }
}
