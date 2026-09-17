'use server'

import { getPayload } from 'payload'
import configPromise from '@/payload.config'
import { cookies, headers } from 'next/headers'
import { revalidatePath } from 'next/cache'

export interface UpdateAuthorProfileInput {
  name: string
  phone?: string
  country?: string
  authorBio?: string
  bankDetails?: {
    bankName?: string
    accountName?: string
    accountNumber?: string
    sortCodeOrRoutingNumber?: string
  }
  newPassword?: string
}

export async function updateAuthorProfileAction(data: UpdateAuthorProfileInput) {
  try {
    const payload = await getPayload({ config: configPromise })
    const req = {
      headers: await headers(),
      cookies: await cookies(),
    }

    const { user } = await payload.auth(req as any)
    if (!user) {
      return { success: false, error: 'You must be logged in to update your profile.' }
    }

    if (!data.name || !data.name.trim()) {
      return { success: false, error: 'Full name is required.' }
    }

    const updatePayload: Record<string, any> = {
      name: data.name.trim(),
      phone: data.phone?.trim() || '',
      country: data.country?.trim() || '',
      authorBio: data.authorBio?.trim() || '',
      bankDetails: {
        bankName: data.bankDetails?.bankName?.trim() || '',
        accountName: data.bankDetails?.accountName?.trim() || '',
        accountNumber: data.bankDetails?.accountNumber?.trim() || '',
        sortCodeOrRoutingNumber: data.bankDetails?.sortCodeOrRoutingNumber?.trim() || '',
      },
    }

    // Optional password change
    if (data.newPassword && data.newPassword.trim()) {
      if (data.newPassword.length < 6) {
        return { success: false, error: 'Password must be at least 6 characters long.' }
      }
      updatePayload.password = data.newPassword
    }

    const updatedUser = await payload.update({
      collection: 'users',
      id: user.id,
      data: updatePayload,
    })

    // Revalidate dashboard pages
    revalidatePath('/unveiler/dashboard/profile')
    revalidatePath('/unveiler/dashboard')
    revalidatePath('/unveiler/dashboard/earnings')
    revalidatePath('/unveiler/dashboard/books')

    return {
      success: true,
      message: 'Profile updated successfully!',
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: (updatedUser as any).phone,
        country: (updatedUser as any).country,
        authorBio: updatedUser.authorBio,
        bankDetails: updatedUser.bankDetails,
      },
    }
  } catch (error: any) {
    console.error('Update author profile error:', error)
    return {
      success: false,
      error: error.message || 'An error occurred while updating profile.',
    }
  }
}
