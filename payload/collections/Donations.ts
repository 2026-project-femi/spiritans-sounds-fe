import { anyone } from '@/access/anyone'
import { isAdmin, isAdminOrEditor } from '@/access/roles'
import { CollectionConfig } from 'payload'

export const Donations: CollectionConfig = {
  slug: 'donations',
  admin: {
    useAsTitle: 'reference',
    hidden: ({user}) => user.role === 'contributor',
  },
  access: {
    read: isAdminOrEditor,
    update: isAdminOrEditor,
    delete: isAdmin,
    create: anyone,
  },
  fields: [
    {
      name: 'reference',
      type: 'text',
      required: true,
      unique: true,
    },
    {
      name: 'amount',
      type: 'number',
      required: true,
    },
    {
      name: 'currency',
      type: 'text',
      required: true,
    },
    {
      name: 'donorEmail',
      type: 'email',
      required: true,
    },
    {
      name: 'donorName',
      type: 'text',
    },
    {
      name: 'message',
      type: 'textarea',
    },
    {
      name: 'paidAt',
      type: 'date',
      required: true,
    },
  ],
}
