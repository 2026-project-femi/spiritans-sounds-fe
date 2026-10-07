import { isAdmin, isAdminOrPublishingAdmin } from '@/access/roles'
import { CollectionConfig } from 'payload'

export const Subscribers: CollectionConfig = {
  slug: 'subscribers',
  admin: {
    useAsTitle: 'email',
    hidden: ({ user }) => user?.role !== 'admin' && user?.role !== 'publishing_admin',
  },
  access: {
    read: isAdminOrPublishingAdmin,
    create: () => true,
    update: isAdminOrPublishingAdmin,
    delete: isAdmin,
  },
  fields: [
    {
      name: 'email',
      type: 'email',
      required: true,
      unique: true,
    },
    {
      name: 'name',
      type: 'text',
    },
    {
      name: 'status',
      type: 'select',
      options: [
        { label: 'Subscribed', value: 'subscribed' },
        { label: 'Unsubscribed', value: 'unsubscribed' },
      ],
      defaultValue: 'subscribed',
    },
  ],
}
