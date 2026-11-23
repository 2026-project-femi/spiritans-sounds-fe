import { isAdmin, isAdminOrEditor } from '@/access/roles'
import { safeRevalidatePath } from '@/lib/revalidate'
import type { CollectionAfterChangeHook, CollectionAfterDeleteHook, CollectionConfig } from 'payload'

const revalidateTestimonies: CollectionAfterChangeHook = ({ doc }) => {
  safeRevalidatePath('/prayer-room/give-thanks')
  safeRevalidatePath('/prayer-room')
  return doc
}

const revalidateAfterDelete: CollectionAfterDeleteHook = ({ doc }) => {
  safeRevalidatePath('/prayer-room/give-thanks')
  safeRevalidatePath('/prayer-room')
  return doc
}

export const PrayerTestimonies: CollectionConfig = {
  slug: 'prayer-testimonies',
  labels: { singular: 'Thanksgiving', plural: 'Thanksgivings' },
  admin: {
    group: 'Prayer Room',
    useAsTitle: 'text',
    defaultColumns: ['name', 'status', 'createdAt'],
    description:
      'Thanksgivings and testimonies submitted through Give Thanks. Only published entries are shown publicly.',
    hidden: ({ user }) => user?.role !== 'admin' && user?.role !== 'editor',
  },
  access: {
    read: ({ req: { user } }) => (user ? true : { status: { equals: 'published' } }),
    // Public submissions go through a validated server action using the Local API.
    create: isAdminOrEditor,
    update: isAdminOrEditor,
    delete: isAdmin,
  },
  hooks: {
    afterChange: [revalidateTestimonies],
    afterDelete: [revalidateAfterDelete],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      label: 'Name to display',
      maxLength: 80,
      admin: { description: 'Leave blank to show as “Anonymous”.' },
    },
    { name: 'text', type: 'textarea', required: true, minLength: 5, maxLength: 1500 },
    { name: 'relatedIntention', type: 'text', label: 'Related intention (optional)', maxLength: 200 },
    {
      name: 'consentToPublish',
      type: 'checkbox',
      label: 'Permission to publish after review',
      defaultValue: false,
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'pending',
      options: [
        { label: 'Pending review', value: 'pending' },
        { label: 'Published', value: 'published' },
        { label: 'Archived', value: 'archived' },
      ],
      admin: { position: 'sidebar' },
    },
    { name: 'adminNotes', type: 'textarea', admin: { position: 'sidebar' } },
  ],
}
