import { CollectionConfig } from 'payload'

export const Comments: CollectionConfig = {
  slug: 'comments',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'comment', 'post', 'approved', 'createdAt'],
    description: "Comments won't show on the site without approval",
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'email',
      type: 'email',
      required: true,
    },
    {
      name: 'comment',
      type: 'textarea',
      required: true,
    },
    {
      name: 'post',
      type: 'relationship',
      relationTo: ['homily', 'article', 'prayer'],
    },
    {
      name: 'approved',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: "Comments won't show on the site without approval",
      },
    },
  ],
}