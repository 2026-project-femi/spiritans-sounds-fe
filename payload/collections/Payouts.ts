import { isAdmin, isAdminOrPublishingAdmin } from '@/access/roles'
import { CollectionConfig } from 'payload'

export const Payouts: CollectionConfig = {
  slug: 'payouts',
  admin: {
    useAsTitle: 'reference',
    hidden: ({user})=>user.role === 'contributor' || user.role === 'author' || user.role === 'editor',
  },
  access: {
    read: isAdminOrPublishingAdmin,
    update: isAdminOrPublishingAdmin,
    delete: isAdmin,
    create: isAdminOrPublishingAdmin,
  },
  fields: [
    {
      name: 'author',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      hasMany: false,
    },
    {
      name: 'amount',
      type: 'number',
      required: true,
    },
    {
      name: 'paymentDate',
      type: 'date',
    },
    {
      name: 'reference',
      type: 'text',
      required: true,
    },
    {
      name: 'status',
      type: 'select',
      options: [
        { label: 'Pending', value: 'pending' },
        { label: 'Processing', value: 'processing' },
        { label: 'Paid', value: 'paid' },
        { label: 'Failed', value: 'failed' },
      ],
      defaultValue: 'pending',
    },
  ],
}
