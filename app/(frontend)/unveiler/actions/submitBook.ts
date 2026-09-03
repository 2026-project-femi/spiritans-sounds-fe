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

    if (!coverFile || !pdfFile) {
      return { success: false, error: 'Both cover image and PDF file are required.' }
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

    const [coverDoc, pdfDoc] = await Promise.all([
      uploadMedia(coverFile, `Cover for ${formData.get('bookTitle')}`),
      uploadMedia(pdfFile, `PDF for ${formData.get('bookTitle')}`),
    ])

    // Create the BookSubmission
    const submission = await payload.create({
      collection: 'book-submissions',
      data: {
        submitter: user ? user.id : undefined,
        fullName: formData.get('fullName') as string,
        email: formData.get('email') as string,
        phone: formData.get('phone') as string,
        country: formData.get('country') as string,
        authorName: formData.get('authorName') as string,
        bookTitle: formData.get('bookTitle') as string,
        description: formData.get('description') as string,
        authorBio: formData.get('authorBio') as string,
        sellingPrice: Number(formData.get('sellingPrice')),
        bookCover: coverDoc.id,
        bookPdf: pdfDoc.id,
        bankDetails: {
          bankName: formData.get('bankName') as string,
          accountName: formData.get('accountName') as string,
          accountNumber: formData.get('accountNumber') as string,
          sortCodeOrRoutingNumber: formData.get('sortCodeOrRoutingNumber') as string,
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
