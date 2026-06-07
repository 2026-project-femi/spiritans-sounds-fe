import { CollectionConfig } from 'payload'

export const MagazineIssues: CollectionConfig = {
  slug: 'magazineIssues',
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
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'excerpt',
      type: 'textarea',
    },
    {
      name: 'price',
      type: 'text',
    },
    {
      name: 'priceAmount',
      type: 'number',
    },
    {
      name: 'cover',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'file',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'publishedAt',
      type: 'date',
    },
  ],
}
