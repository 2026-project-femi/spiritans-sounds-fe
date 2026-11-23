import { isAdmin, isAdminOrEditor } from '@/access/roles'
import { normalizeExternalUrl } from '@/lib/externalUrl'
import { safeRevalidatePath } from '@/lib/revalidate'
import type { CollectionAfterChangeHook, CollectionAfterDeleteHook, CollectionConfig } from 'payload'

const revalidatePrayerRoom: CollectionAfterChangeHook = ({ doc }) => {
  safeRevalidatePath('/prayer-room')
  safeRevalidatePath('/prayer-room/live')
  return doc
}

const revalidateAfterDelete: CollectionAfterDeleteHook = ({ doc }) => {
  safeRevalidatePath('/prayer-room')
  safeRevalidatePath('/prayer-room/live')
  return doc
}

export const PrayerRooms: CollectionConfig = {
  slug: 'prayer-rooms',
  labels: {
    singular: 'Prayer Room',
    plural: 'Prayer Rooms',
  },
  admin: {
    group: 'Prayer Room',
    useAsTitle: 'title',
    defaultColumns: ['title', 'dayOfWeek', 'startTime', 'platform', 'isLive', 'isActive', 'order'],
    description:
      'Recurring prayer sessions shown on the Prayer Room page. Use the order field to control their position.',
    hidden: ({ user }) => user?.role !== 'admin' && user?.role !== 'editor',
  },
  access: {
    // Public can only read active rooms; editors see everything in the admin.
    read: ({ req: { user } }) =>
      user ? true : { isActive: { equals: true } },
    create: isAdminOrEditor,
    update: isAdminOrEditor,
    delete: isAdmin,
  },
  hooks: {
    beforeChange: [
      ({ data }) => {
        data.meetingUrl = normalizeExternalUrl(data?.meetingUrl) ?? null
        return data
      },
    ],
    afterChange: [revalidatePrayerRoom],
    afterDelete: [revalidateAfterDelete],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      maxLength: 120,
      admin: { placeholder: 'e.g. Evening Prayer & Adoration' },
    },
    {
      name: 'focus',
      type: 'textarea',
      label: 'What We Pray For',
      maxLength: 500,
      admin: {
        placeholder: 'A short description of the intention or rhythm of this session.',
      },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'dayOfWeek',
          type: 'select',
          label: 'Day',
          required: true,
          defaultValue: 'wednesday',
          options: [
            { label: 'Daily', value: 'daily' },
            { label: 'Sunday', value: 'sunday' },
            { label: 'Monday', value: 'monday' },
            { label: 'Tuesday', value: 'tuesday' },
            { label: 'Wednesday', value: 'wednesday' },
            { label: 'Thursday', value: 'thursday' },
            { label: 'Friday', value: 'friday' },
            { label: 'Saturday', value: 'saturday' },
          ],
        },
        {
          name: 'startTime',
          type: 'text',
          label: 'Start Time',
          required: true,
          defaultValue: '8:00 PM',
          maxLength: 40,
          admin: { placeholder: 'e.g. 8:00 PM' },
        },
        {
          name: 'timezone',
          type: 'text',
          label: 'Time Zone',
          defaultValue: 'WAT',
          maxLength: 20,
          admin: { description: 'Shown next to the time, e.g. WAT, GMT, EST.' },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'durationMinutes',
          type: 'number',
          label: 'Duration (minutes)',
          defaultValue: 60,
          min: 5,
          max: 600,
        },
        {
          name: 'host',
          type: 'text',
          label: 'Hosted By',
          maxLength: 120,
          admin: { placeholder: 'e.g. Spiritans Sound Prayer Team' },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'platform',
          type: 'select',
          label: 'Platform',
          required: true,
          defaultValue: 'zoom',
          options: [
            { label: 'Zoom', value: 'zoom' },
            { label: 'Google Meet', value: 'google-meet' },
            { label: 'YouTube', value: 'youtube' },
            { label: 'In person', value: 'in-person' },
            { label: 'Other', value: 'other' },
          ],
        },
        {
          name: 'isLive',
          type: 'checkbox',
          label: 'Happening now',
          defaultValue: false,
          admin: { description: 'Highlights this room as live on the page.' },
        },
        {
          name: 'isFeatured',
          type: 'checkbox',
          label: 'Featured',
          defaultValue: false,
          admin: { description: 'Featured rooms appear first in the schedule.' },
        },
      ],
    },
    {
      name: 'meetingUrl',
      type: 'text',
      label: 'Join Link',
      admin: {
        placeholder: 'https://zoom.us/j/...',
        description: 'Required for online rooms. Leave blank for in-person gatherings.',
      },
    },
    {
      name: 'location',
      type: 'text',
      label: 'Location',
      maxLength: 240,
      admin: {
        placeholder: 'e.g. Spiritans Sound Chapel, Abuja',
        condition: (data) => data?.platform === 'in-person',
      },
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      label: 'Room Image',
      admin: { description: 'Optional background image for this session card.' },
    },
    {
      name: 'isActive',
      type: 'checkbox',
      label: 'Show on the Prayer Room page',
      defaultValue: true,
      admin: { position: 'sidebar' },
    },
    {
      name: 'order',
      type: 'number',
      label: 'Display Order',
      defaultValue: 0,
      admin: {
        position: 'sidebar',
        description: 'Lower numbers appear first.',
      },
    },
  ],
}
