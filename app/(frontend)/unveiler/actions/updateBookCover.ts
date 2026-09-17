'use server'

import { getPayload } from 'payload'
import configPromise from '@/payload.config'
import { cookies, headers } from 'next/headers'
import { revalidatePath } from 'next/cache'

export async function updateBookCoverAction(formData: FormData) {
  try {
    const payload = await getPayload({ config: configPromise })
    const req = {
      headers: await headers(),
      cookies: await cookies(),
    }

    const { user } = await payload.auth(req as any)
    if (!user) {
      return { success: false, error: 'You must be logged in to update a book cover.' }
    }

    const bookId = formData.get('bookId') as string
    const coverFile = formData.get('coverImage') as File | null

    if (!bookId) {
      return { success: false, error: 'Book ID is required.' }
    }

    if (!coverFile || coverFile.size === 0) {
      return { success: false, error: 'Please select a cover image file to upload.' }
    }

    // Fetch the book to check ownership
    const book = await payload.findByID({
      collection: 'publications',
      id: bookId,
    })

    if (!book) {
      return { success: false, error: 'Book not found.' }
    }

    const bookAuthorId = typeof book.author === 'object' && book.author !== null ? (book.author as any).id : book.author
    const isOwner = bookAuthorId === user.id
    const isAdmin = user.role === 'admin' || user.role === 'publishing_admin'

    if (!isOwner && !isAdmin) {
      return { success: false, error: 'You do not have permission to update this book.' }
    }

    // Upload cover image to media collection
    const buffer = Buffer.from(await coverFile.arrayBuffer())
    const mediaDoc = await payload.create({
      collection: 'media',
      data: {
        alt: `Cover for ${book.title}`,
      },
      file: {
        data: buffer,
        name: coverFile.name,
        mimetype: coverFile.type,
        size: coverFile.size,
      },
    })

    // Update publication cover
    await payload.update({
      collection: 'publications',
      id: bookId,
      data: {
        cover: mediaDoc.id,
      },
    })

    revalidatePath('/unveiler/dashboard/books')
    revalidatePath('/unveiler/dashboard')
    if (book.slug) {
      revalidatePath(`/unveiler/books/${book.slug}`)
    }
    revalidatePath('/unveiler/books')

    return {
      success: true,
      message: 'Cover image updated successfully!',
      coverUrl: mediaDoc.url,
    }
  } catch (error: any) {
    console.error('Update book cover error:', error)
    return {
      success: false,
      error: error.message || 'An error occurred while uploading cover image.',
    }
  }
}
