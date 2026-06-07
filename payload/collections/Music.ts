import { CollectionConfig } from 'payload'

export const Music: CollectionConfig = {
  slug: 'music',
  admin: {
    useAsTitle: 'title',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      unique: true,
      required: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'artist',
      type: 'text',
    },
    {
      name: 'audio',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'lyrics',
      type: 'textarea',
    },
    {
      name: 'featuredImage',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'excerpt',
      type: 'textarea',
    },
    {
      name: 'content',
      type: 'richText',
    },
    {
      name: 'publishedAt',
      type: 'date',
    },
  ],
}
