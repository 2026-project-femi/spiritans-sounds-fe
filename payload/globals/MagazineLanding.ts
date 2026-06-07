import { GlobalConfig } from 'payload'

export const MagazineLanding: GlobalConfig = {
  slug: 'magazineLanding',
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
