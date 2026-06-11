import { isAdmin } from '@/access/roles'
import { CollectionConfig } from 'payload'

export const Subscribers: CollectionConfig = {
  slug: 'subscribers',
  admin: {
    useAsTitle: 'email',
    hidden: ({user})=>user.role === 'contributor' 

  },
  access: {
    read: () => true,
    update: () => true,
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
