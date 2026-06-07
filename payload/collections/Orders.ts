import { CollectionConfig } from 'payload'

export const Orders: CollectionConfig = {
  slug: 'orders',
  admin: {
    useAsTitle: 'id',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'customerName',
      type: 'text',
      required: true,
    },
    {
      name: 'customerEmail',
      type: 'email',
      required: true,
    },
    {
      name: 'amount',
      type: 'number',
      required: true,
    },
    {
      name: 'status',
      type: 'select',
      options: [
        { label: 'Pending', value: 'pending' },
        { label: 'Completed', value: 'completed' },
        { label: 'Failed', value: 'failed' },
      ],
      defaultValue: 'pending',
    },
    {
      name: 'items',
      type: 'relationship',
      relationTo: ['publications', 'magazineIssues'],
      hasMany: true,
    },
    {
      name: 'paystackReference',
      type: 'text',
    },
  ],
}
