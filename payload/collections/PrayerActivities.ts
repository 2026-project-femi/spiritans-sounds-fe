import { isAdmin, isAdminOrEditor } from '@/access/roles'
import type { CollectionConfig } from 'payload'

/**
 * Internal activity log used for the Prayer Room counters
 * (candles lit, prayers offered today and this week).
 */
export const PrayerActivities: CollectionConfig = {
  slug: 'prayer-activities',
  labels: { singular: 'Prayer Activity', plural: 'Prayer Activity' },
  admin: {
    group: 'Prayer Room',
    useAsTitle: 'type',
    defaultColumns: ['type', 'intention', 'createdAt'],
    description: 'Automatic log of prayers and candles offered from the public pages.',
    hidden: true,
  },
  access: {
    read: isAdminOrEditor,
    create: isAdminOrEditor,
    update: isAdminOrEditor,
    delete: isAdmin,
  },
  fields: [
    {
      name: 'type',
      type: 'select',
      required: true,
      options: [
        { label: 'Prayer offered', value: 'pray' },
        { label: 'Candle lit', value: 'candle' },
      ],
    },
    {
      name: 'intention',
      type: 'relationship',
      relationTo: 'prayer-requests',
      required: true,
      index: true,
    },
  ],
}
