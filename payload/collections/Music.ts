import { authenticatedOrPublished } from '@/access/authenticatedOrPublished'
import { isAdmin, isAdminOrEditor } from '@/access/roles';
import { publishedAtField } from '@/payload/fields/statusField';
import { revalidatePath } from 'next/cache';
import { CollectionConfig } from 'payload'

export const Music: CollectionConfig = {
  slug: 'music',
  admin: {
    useAsTitle: 'title',
    hidden: ({user})=>user.role === 'contributor' 

  },
  access: {
    read: authenticatedOrPublished,
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
