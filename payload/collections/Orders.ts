import { anyone } from '@/access/anyone'
import { isAdmin, isAdminOrEditor, isAdminOrPublishingAdmin } from '@/access/roles'
import { CollectionConfig } from 'payload'

export const Orders: CollectionConfig = {
  slug: 'orders',
  admin: {
    useAsTitle: 'id',
    defaultColumns: [
      'customerName',
      'customerEmail',
      'format',
      'status',
      'fulfillmentStatus',
      'amount',
      'currency',
      'createdAt',
    ],
    hidden: ({ user }) => user.role === 'contributor' || user.role === 'author',
  },
  access: {
      read: isAdminOrPublishingAdmin,
      update: isAdminOrPublishingAdmin,
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
      name: 'format',
      type: 'select',
      label: 'Item Format',
      defaultValue: 'ebook',
      options: [
        { label: 'eBook (Digital)', value: 'ebook' },
        { label: 'Paperback (Physical)', value: 'paperback' },
      ],
      admin: {
        description: 'Format purchased (eBook download vs physical Paperback for delivery)',
      },
    },
    {
      name: 'isPreorder',
      type: 'checkbox',
      label: 'Pre-Order',
      defaultValue: false,
      admin: {
        description: 'Resolved at checkout from launch settings; drives pre-order vs download fulfillment.',
      },
    },
    {
      name: 'shippingAddress',
      type: 'textarea',
      label: 'Shipping Address',
      admin: {
        description: 'Physical delivery address (for paperback orders)',
      },
    },
    {
      name: 'shippingCity',
      type: 'text',
      label: 'Shipping City / State',
    },
    {
      name: 'shippingCountry',
      type: 'text',
      label: 'Shipping Country',
    },
    {
      name: 'shippingPhone',
      type: 'text',
      label: 'Customer Contact Phone',
    },
    {
      name: 'fulfillmentStatus',
      type: 'select',
      label: 'Fulfillment Status',
      defaultValue: 'pending',
      options: [
        { label: 'Pending Dispatch', value: 'pending' },
        { label: 'Packed', value: 'packed' },
        { label: 'Dispatched', value: 'dispatched' },
        { label: 'Delivered', value: 'delivered' },
        { label: 'Cancelled', value: 'cancelled' },
      ],
      admin: {
        description: 'Dispatch workflow for physical paperback orders.',
        condition: (data) => data?.format === 'paperback',
      },
    },
    {
      name: 'dispatchedAt',
      type: 'date',
      label: 'Dispatched At',
      admin: {
        date: { pickerAppearance: 'dayAndTime' },
        condition: (data) => data?.format === 'paperback',
      },
    },
    {
      name: 'courier',
      type: 'text',
      label: 'Courier / Delivery Service',
      admin: {
        condition: (data) => data?.format === 'paperback',
      },
    },
    {
      name: 'trackingNumber',
      type: 'text',
      label: 'Tracking Number',
      admin: {
        condition: (data) => data?.format === 'paperback',
      },
    },
    {
      name: 'adminNotes',
      type: 'textarea',
      label: 'Internal Fulfillment Notes',
      admin: {
        condition: (data) => data?.format === 'paperback',
      },
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
    {
      name: 'paymentProcessingFee',
      type: 'number',
      admin: { readOnly: true },
    },
    {
      name: 'commissionRate',
      type: 'number',
      admin: { readOnly: true },
    },
    {
      name: 'commissionAmount',
      type: 'number',
      admin: { readOnly: true },
    },
    {
      name: 'authorEarnings',
      type: 'number',
      admin: { readOnly: true },
    },
  ],
}
