import { isAdmin, isAdminOrEditor } from '@/access/roles'
import { sendPrayerRoomAdminNotification } from '@/lib/emails/prayerRoom'
import { safeRevalidatePath } from '@/lib/revalidate'
import type { CollectionAfterChangeHook, CollectionAfterDeleteHook, CollectionConfig } from 'payload'

const notifyPrayerTeam: CollectionAfterChangeHook = async ({ doc, operation, req }) => {
  if (operation !== 'create') return doc

  await sendPrayerRoomAdminNotification({
    reference: String(doc.id),
    name: String(doc.name || ''),
    email: String(doc.email || ''),
    category: String(doc.category || 'other'),
    intention: String(doc.intention || ''),
    isAnonymous: Boolean(doc.isAnonymous),
    consentToPublish: Boolean(doc.consentToPublish),
  }).catch((error) =>
    req.payload.logger.error({ err: error, msg: 'Prayer Room notification failed' }),
  )

  return doc
}

const revalidatePrayerRoom: CollectionAfterChangeHook = ({ doc }) => {
  for (const path of [
    '/prayer-room',
    '/prayer-room/pray',
    '/prayer-room/intentions',
    '/prayer-room/chapel',
    '/prayer-room/notifications',
  ]) {
    safeRevalidatePath(path)
  }
  return doc
}

const revalidateAfterDelete: CollectionAfterDeleteHook = ({ doc }) => {
  for (const path of [
    '/prayer-room',
    '/prayer-room/pray',
    '/prayer-room/intentions',
    '/prayer-room/chapel',
    '/prayer-room/notifications',
  ]) {
    safeRevalidatePath(path)
  }
  return doc
}

export const PrayerRequests: CollectionConfig = {
  slug: 'prayer-requests',
  labels: {
    singular: 'Prayer Request',
    plural: 'Prayer Requests',
  },
  admin: {
    group: 'Prayer Room',
    useAsTitle: 'intention',
    defaultColumns: ['name', 'category', 'status', 'consentToPublish', 'createdAt'],
    description:
      'Intentions submitted through the public Prayer Room form. Approve and mark a request as shareable to display it on the prayer wall. Contact details are never shown publicly.',
    hidden: ({ user }) => user?.role !== 'admin' && user?.role !== 'editor',
  },
  access: {
    // Public submissions go through a validated server action using the Local API.
    // The REST endpoint stays private so bots cannot post directly to it.
    read: isAdminOrEditor,
    create: isAdminOrEditor,
    update: isAdminOrEditor,
    delete: isAdmin,
  },
  hooks: {
    afterChange: [notifyPrayerTeam, revalidatePrayerRoom],
    afterDelete: [revalidateAfterDelete],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      label: 'Name',
      maxLength: 100,
      admin: {
        description: 'Private. Shown as “Anonymous” on the wall when the request is anonymous.',
      },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'email',
          type: 'email',
          label: 'Email',
          admin: { description: 'Optional. Never published.' },
        },
        {
          name: 'phone',
          type: 'text',
          label: 'Phone',
          maxLength: 40,
          admin: { description: 'Optional. Never published.' },
        },
      ],
    },
    {
      name: 'category',
      type: 'select',
      label: 'Category',
      required: true,
      defaultValue: 'general-intention',
      options: [
        { label: 'Family', value: 'family' },
        { label: 'Healing', value: 'healing' },
        { label: 'Marriage', value: 'marriage' },
        { label: 'Children', value: 'children' },
        { label: 'Work', value: 'work' },
        { label: 'Exams', value: 'exams' },
        { label: 'Discernment', value: 'discernment' },
        { label: 'Bereavement', value: 'bereavement' },
        { label: 'Peace', value: 'peace' },
        { label: 'Forgiveness', value: 'forgiveness' },
        { label: 'Protection', value: 'protection' },
        { label: 'Spiritual Growth', value: 'spiritual-growth' },
        { label: 'Difficult Situations', value: 'difficult-situations' },
        { label: 'Thanksgiving', value: 'thanksgiving' },
        { label: 'General Intention', value: 'general-intention' },
        // Legacy values kept so existing requests remain valid.
        { label: 'Vocation', value: 'vocation' },
        { label: 'Grief', value: 'grief' },
        { label: 'Other', value: 'other' },
      ],
    },
    {
      name: 'privacy',
      type: 'select',
      label: 'Who can see this?',
      required: true,
      defaultValue: 'public',
      options: [
        { label: 'Public prayer board', value: 'public' },
        { label: 'Prayer Partners only', value: 'partners' },
        { label: 'Private', value: 'private' },
      ],
      admin: {
        position: 'sidebar',
        description: 'Only public, approved intentions appear on the prayer board.',
      },
    },
    {
      name: 'intention',
      type: 'textarea',
      label: 'Prayer Intention',
      required: true,
      minLength: 10,
      maxLength: 2000,
    },
    {
      type: 'row',
      fields: [
        {
          name: 'isAnonymous',
          type: 'checkbox',
          label: 'Share anonymously',
          defaultValue: false,
        },
        {
          name: 'consentToPublish',
          type: 'checkbox',
          label: 'May be shared on the prayer wall',
          defaultValue: false,
        },
      ],
    },
    {
      name: 'status',
      type: 'select',
      label: 'Status',
      required: true,
      defaultValue: 'pending',
      options: [
        { label: 'Pending review', value: 'pending' },
        { label: 'Approved', value: 'approved' },
        { label: 'Archived', value: 'archived' },
      ],
      admin: {
        position: 'sidebar',
        description: 'Only approved public requests appear on the prayer board.',
      },
    },
    {
      name: 'prayedCount',
      type: 'number',
      label: 'Prayers Offered',
      defaultValue: 0,
      admin: {
        position: 'sidebar',
        readOnly: true,
        description: 'Incremented when someone taps “I will pray” or lights a candle.',
      },
    },
    {
      name: 'candleCount',
      type: 'number',
      label: 'Candles Lit',
      defaultValue: 0,
      admin: {
        position: 'sidebar',
        readOnly: true,
        description: 'Incremented when someone lights a candle after praying.',
      },
    },
    {
      name: 'adminNotes',
      type: 'textarea',
      label: 'Internal Notes',
      admin: {
        position: 'sidebar',
        description: 'Visible to the prayer team only.',
      },
    },
  ],
}
