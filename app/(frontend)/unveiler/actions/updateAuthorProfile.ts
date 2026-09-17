'use server'

import { getPayload } from 'payload'
import configPromise from '@/payload.config'
import { headers } from 'next/headers'
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
}

export interface UpdateAuthorPasswordInput {
  newPassword: string
  confirmPassword: string
}

export async function updateAuthorProfileAction(data: UpdateAuthorProfileInput) {
  try {
    const payload = await getPayload({ config: configPromise })
    const headersList = await headers()

    const { user } = await payload.auth({ headers: headersList })
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

    const updatedUser = await payload.update({
      collection: 'users',
      id: user.id,
      data: updatePayload,
      overrideAccess: true,
    })

    // Revalidate dashboard pages
    revalidatePath('/unveiler/dashboard/profile')
    revalidatePath('/unveiler/dashboard')
    revalidatePath('/unveiler/dashboard/earnings')
    revalidatePath('/unveiler/dashboard/books')

    return {
      success: true,
      message: 'Profile details saved successfully!',
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: (updatedUser as any).phone || '',
        country: (updatedUser as any).country || '',
        authorBio: updatedUser.authorBio || '',
        bankDetails: updatedUser.bankDetails || null,
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

export async function updateAuthorPasswordAction(data: UpdateAuthorPasswordInput) {
  try {
    const payload = await getPayload({ config: configPromise })
    const headersList = await headers()

    const { user } = await payload.auth({ headers: headersList })
    if (!user) {
      return { success: false, error: 'You must be logged in to change your password.' }
    }

    if (!data.newPassword || !data.newPassword.trim()) {
      return { success: false, error: 'Please enter a new password.' }
    }

    if (data.newPassword.length < 6) {
      return { success: false, error: 'New password must be at least 6 characters long.' }
    }

    if (data.newPassword !== data.confirmPassword) {
      return { success: false, error: 'Passwords do not match. Please verify your new password.' }
    }

    await payload.update({
      collection: 'users',
      id: user.id,
      data: {
        password: data.newPassword,
      },
      overrideAccess: true,
    })

    return {
      success: true,
      message: 'Password changed successfully! Please use your new password next time you log in.',
    }
  } catch (error: any) {
    console.error('Update author password error:', error)
    return {
      success: false,
      error: error.message || 'An error occurred while updating password.',
    }
  }
}


