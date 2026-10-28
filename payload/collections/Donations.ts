import { isAdmin, isAdminOrEditor } from '@/access/roles'
import { CollectionConfig } from 'payload'

export const Donations: CollectionConfig = {
  slug: 'donations',
  admin: {
    useAsTitle: 'reference',
    hidden: ({ user }) => user?.role !== 'admin' && user?.role !== 'editor',
  },
  access: {
    read: isAdminOrEditor,
    update: isAdminOrEditor,
    delete: isAdmin,
    create: isAdminOrEditor,
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
    {
      name: 'programme',
      type: 'select',
      defaultValue: 'general',
      options: [
        { label: 'General', value: 'general' },
        { label: 'Young Creators Network', value: 'young-creators' },
      ],
      admin: {
        position: 'sidebar',
        description: 'Programme this gift belongs to.',
      },
    },
    {
      name: 'designation',
      type: 'select',
      options: [
        { label: 'Where most needed', value: 'general' },
        { label: 'Mentoring', value: 'mentorship' },
        { label: 'Tools & materials', value: 'equipment' },
        { label: 'Showcases & events', value: 'showcase' },
      ],
      admin: {
        position: 'sidebar',
        condition: (_data, siblingData) => siblingData?.programme === 'young-creators',
      },
    },
    {
      name: 'supportFrequency',
      type: 'select',
      options: [
        { label: 'One-off', value: 'one-off' },
        { label: 'Monthly', value: 'monthly' },
      ],
      admin: {
        position: 'sidebar',
        condition: (_data, siblingData) => siblingData?.programme === 'young-creators',
      },
    },
  ],
}
