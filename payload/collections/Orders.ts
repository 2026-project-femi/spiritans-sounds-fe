import { anyone } from '@/access/anyone'
import { isAdmin, isAdminOrEditor } from '@/access/roles'
import { CollectionConfig } from 'payload'

export const Orders: CollectionConfig = {
  slug: 'orders',
  admin: {
    useAsTitle: 'id',
    hidden: ({user})=>user.role === 'contributor' 

  },
  access: {
      read: isAdminOrEditor,
        update: isAdminOrEditor,
        delete: isAdmin,
        create: anyone,
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
      name: 'currency',
      type: 'select',
      options: [
        { label: 'NGN', value: 'NGN' },
        { label: 'USD', value: 'USD' },
        { label: 'GBP', value: 'GBP' },
      ],
      defaultValue: 'NGN',
    },
    {
      name: 'paymentProvider',
      type: 'select',
      options: [
        { label: 'Paystack', value: 'paystack' },
        { label: 'Stripe', value: 'stripe' },
      ],
      defaultValue: 'paystack',
    },
    {
      name: 'paystackReference',
      type: 'text',
    },
    {
      name: 'stripeSessionId',
      type: 'text',
    },
  ],
}
