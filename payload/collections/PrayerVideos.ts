import { isAdmin, isAdminOrEditor } from '@/access/roles'
import { safeRevalidatePath } from '@/lib/revalidate'
import type { CollectionAfterChangeHook, CollectionAfterDeleteHook, CollectionConfig } from 'payload'

const revalidateVideos: CollectionAfterChangeHook = ({ doc }) => {
  safeRevalidatePath('/prayer-room/videos')
  safeRevalidatePath('/prayer-room')
  return doc
}

const revalidateAfterDelete: CollectionAfterDeleteHook = ({ doc }) => {
  safeRevalidatePath('/prayer-room/videos')
  safeRevalidatePath('/prayer-room')
  return doc
}

export const PrayerVideos: CollectionConfig = {
  slug: 'prayer-videos',
  labels: { singular: 'Prayer Video', plural: 'Prayer Videos' },
  admin: {
    group: 'Prayer Room',
    useAsTitle: 'title',
    defaultColumns: ['title', 'type', 'duration', 'isFeatured', 'order'],
    description: 'YouTube videos shown in the Prayer Room video library.',
    hidden: ({ user }) => user?.role !== 'admin' && user?.role !== 'editor',
  },
  access: {
    read: () => true,
    create: isAdminOrEditor,
    update: isAdminOrEditor,
    delete: isAdmin,
  },
  hooks: {
    afterChange: [revalidateVideos],
    afterDelete: [revalidateAfterDelete],
  },
  fields: [
    { name: 'title', type: 'text', required: true, maxLength: 160 },
    {
      name: 'youtubeId',
      type: 'text',
      required: true,
      label: 'YouTube Video ID',
      admin: { description: 'The ID from the YouTube URL, e.g. Sbr0cLkQgu8.' },
    },
    { name: 'description', type: 'textarea', maxLength: 500 },
    {
      name: 'type',
      type: 'select',
      required: true,
      defaultValue: 'prayer',
      options: [
        { label: 'Prayer', value: 'prayer' },
        { label: 'Worship', value: 'worship' },
        { label: 'Rosary', value: 'rosary' },
        { label: 'Novena', value: 'novena' },
        { label: 'Scripture', value: 'scripture' },
        { label: 'Holy Spirit', value: 'holy-spirit' },
        { label: 'Reflection', value: 'reflection' },
      ],
    },
    { name: 'duration', type: 'text', defaultValue: '20 min', maxLength: 20 },
    { name: 'isFeatured', type: 'checkbox', defaultValue: false, label: 'Feature on the homepage' },
    { name: 'order', type: 'number', defaultValue: 0, admin: { position: 'sidebar' } },
  ],
}
