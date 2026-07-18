import { authenticated } from '@/access/authenticated'
import { authenticatedOrPublished } from '@/access/authenticatedOrPublished';
import { isAdmin, isAdminOrEditor } from '@/access/roles';
import { publishedAtField } from '@/payload/fields/statusField';
import { revalidatePath } from 'next/cache';
import { CollectionConfig } from 'payload'

export const Publications: CollectionConfig = {
  slug: 'publications',
  admin: {
    useAsTitle: 'title',
    hidden: ({user})=>user.role === 'contributor',
    defaultColumns: ['title', '_status', 'publishedAt', 'updatedAt'],
  },
  access: {
    read: authenticatedOrPublished,
    readVersions: authenticated,
    update: isAdmin,
    delete: isAdmin,
    create: isAdminOrEditor,
    
  },hooks: {
    afterChange: [({doc})=>{
      revalidatePath('/unveiler/books');
      return doc;
    }],
    afterDelete: [({doc})=>{
      revalidatePath('/unveiler/books');
      return doc;
    }],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      unique: true,
      required: true,
      admin: {
        position: 'sidebar',
      },
      hooks: {
        beforeValidate: [
          ({ value, data }) => {
            if (value) return value
            const title = data?.title ?? ''
            return title
              .toLowerCase()
              .replace(/\s+/g, '-')
              .replace(/[^\w-]/g, '')
              .slice(0, 96)
          },
        ],
      },
    },
    {
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'price',
      type: 'select',
      defaultValue: 'free',
      options: [
        { label: 'Free', value: 'free' },
        { label: 'Paid', value: 'paid' },
      ],
    },
    {
      name: 'priceAmount',
      type: 'number',
    },
    {
      name: 'priceAmountUSD',
      type: 'number',
    },
    {
      name: 'priceAmountGBP',
      type: 'number',
    },
    {
      name: 'cover',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'file',
      type: 'upload',
      relationTo: 'media',
    },
    publishedAtField,
  ],
  versions: {
    drafts: {
      autosave: false,
      schedulePublish: true,
    },
    maxPerDoc: 25,
  },
}
