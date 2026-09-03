import { CollectionConfig } from 'payload'
import {anyone} from '@/access/anyone'
import { isAdmin, isAdminOrEditor, isAdminOrPublishingAdmin } from '@/access/roles'
import { authenticated } from '@/access/authenticated'
export const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  admin: {
    useAsTitle: 'email',
    hidden: ({ user }) => user?.role !== 'admin',
  },
  access: {
    read: ({ req: { user } }) => {
      // Allow super admins to read all users
      if (user?.role === 'admin') {
        return true;
      }
      // Allow any authenticated user to read their own profile
      if (user) {
        return {
          id: {
            equals: user.id,
          },
        };
      }
      return false;
    },
    update: ({ req: { user } }) => {
      if (user?.role === 'admin') return true;
      if (user) return { id: { equals: user.id } };
      return false;
    },
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
        { label: 'Publishing Admin', value: 'publishing_admin' },
        { label: 'Editor', value: 'editor' },
        { label: 'Contributor', value: 'contributor' },
        { label: 'Author', value: 'author' },
      ],
      defaultValue: 'contributor',
      required: true,
    },
    {
      name: 'authorType',
      type: 'select',
      options: [
        { label: 'Standard', value: 'standard' },
        { label: 'Young Creator', value: 'young_creator' },
      ],
      defaultValue: 'standard',
      admin: {
        condition: (data, siblingData) => data?.role === 'author',
      },
    },
    {
      name: 'authorBio',
      type: 'textarea',
      admin: {
        condition: (data, siblingData) => data?.role === 'author',
      },
    },
    {
      name: 'bankDetails',
      type: 'group',
      admin: {
        condition: (data, siblingData) => data?.role === 'author',
      },
      fields: [
        { name: 'bankName', type: 'text' },
        { name: 'accountName', type: 'text' },
        { name: 'accountNumber', type: 'text' },
        { name: 'sortCodeOrRoutingNumber', type: 'text' },
      ],
    },
  ],
}
