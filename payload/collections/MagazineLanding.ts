import { CollectionConfig } from 'payload'

export const MagazineLanding: CollectionConfig = {
  slug: 'magazineLanding',
  admin: {
    hidden: true
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'featuredIssue',
      type: 'relationship',
      relationTo: 'magazineIssues',
    },
  ],
}
