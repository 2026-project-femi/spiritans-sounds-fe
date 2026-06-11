import { CollectionConfig } from 'payload'
import {anyone} from '@/access/anyone'
import { isAdmin, isAdminOrEditor } from '@/access/roles'
import { authenticated } from '@/access/authenticated'
export const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  admin: {
    useAsTitle: 'email',
    hidden: ({user})=>user.role === 'contributor' || user.role === 'editor'

  },
  access: {read:isAdminOrEditor,
    update: isAdmin,
    delete: isAdmin,
    create: isAdmin,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
    },
    {
      name: 'role',
      type: 'select',
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'Editor', value: 'editor' },
        { label: 'Contributor', value: 'contributor' },
      ],
      defaultValue: 'contributor',
    },
  ],
}
