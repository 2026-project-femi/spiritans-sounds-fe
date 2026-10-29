import { authenticated } from '@/access/authenticated'
import { authenticatedOrPublished } from '@/access/authenticatedOrPublished'
import { isAdmin, isAdminOrEditor } from '@/access/roles'
import { publishedAtField } from '@/payload/fields/statusField'
import { safeRevalidatePath } from '@/lib/revalidate'
import { getYouTubeId } from '@/lib/youtube'
import type { CollectionConfig, TextFieldSingleValidation } from 'payload'

const revalidateUpdates = () => {
  safeRevalidatePath('/young-creators')
}

export const YcnUpdates: CollectionConfig = {
  slug: 'ycn-updates',
  labels: {
    singular: 'Young Creators Update',
    plural: 'Young Creators Updates',
  },
  admin: {
    group: 'Young Creators',
    useAsTitle: 'title',
    defaultColumns: ['title', 'creator', 'kind', 'date', '_status'],
    hidden: ({ user }) =>
      user?.role === 'contributor' || user?.role === 'publishing_admin' || user?.role === 'author',
  },
  access: {
    read: authenticatedOrPublished,
    readVersions: authenticated,
    create: isAdminOrEditor,
    update: isAdminOrEditor,
    delete: isAdmin,
  },
  hooks: {
    afterChange: [revalidateUpdates],
    afterDelete: [revalidateUpdates],
  },
  versions: {
    drafts: {
      autosave: false,
      schedulePublish: true,
    },
    maxPerDoc: 25,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'creator',
      type: 'relationship',
      relationTo: 'young-creators',
      required: true,
      label: 'Creator',
    },
    {
      name: 'kind',
      type: 'select',
      required: true,
      defaultValue: 'New work',
      options: [
        { label: 'New work', value: 'New work' },
        { label: 'Performance', value: 'Performance' },
        { label: 'Milestone', value: 'Milestone' },
        { label: 'Feature', value: 'Feature' },
      ],
    },
    {
      name: 'date',
      type: 'date',
      required: true,
      admin: {
        date: { pickerAppearance: 'dayOnly' },
      },
    },
    {
      name: 'excerpt',
      type: 'textarea',
      required: true,
      maxLength: 280,
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      required: true,
      label: 'Update Image (16:10)',
      admin: {
        description: 'Add alt text on the Media item — it is used for accessibility and social previews.',
      },
    },
    {
      name: 'youtubeUrl',
      type: 'text',
      label: 'YouTube Video URL (optional)',
      admin: {
        description:
          'Optional. When set, the update card renders the YouTube video in place of the image.',
      },
      validate: ((value) => {
        if (!value) return true
        return getYouTubeId(value) ? true : 'Enter a valid YouTube video URL.'
      }) as TextFieldSingleValidation,
    },
    publishedAtField,
  ],
}
