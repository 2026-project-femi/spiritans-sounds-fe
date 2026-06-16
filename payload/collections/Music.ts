import { authenticated } from '@/access/authenticated'
import { authenticatedOrPublished } from '@/access/authenticatedOrPublished'
import { isAdmin, isAdminOrEditor } from '@/access/roles';
import { publishedAtField } from '@/payload/fields/statusField';
import { revalidatePath } from 'next/cache';
import { CollectionConfig } from 'payload'

export const Music: CollectionConfig = {
  slug: 'music',
  admin: {
    useAsTitle: 'title',
    hidden: ({user})=>user.role === 'contributor',
    defaultColumns: ['title', '_status', 'publishedAt', 'updatedAt'],
  },
  access: {
    read: authenticatedOrPublished,
    readVersions: authenticated,
    update: isAdminOrEditor,
    delete: isAdmin,
    create: isAdminOrEditor,
  },
  hooks: {
    afterChange: [({doc})=>{
      revalidatePath('/music');
      revalidatePath('/')
      return doc;
    }]
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
      name: 'artist',
      type: 'text',
    },
    {
      name: 'audio',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'lyrics',
      type: 'textarea',
    },
    {
      name: 'featuredImage',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'excerpt',
      type: 'textarea',
    },
    {
      name: 'content',
      type: 'richText',
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
