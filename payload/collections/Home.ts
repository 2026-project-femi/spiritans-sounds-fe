import { isAdmin, isAdminOrEditor } from '@/access/roles';
import { anyoneExceptAuthor } from '@/access/anyoneExceptAuthor';
import { safeRevalidatePath } from '@/lib/revalidate';
import { CollectionConfig } from 'payload'

export const HomePage: CollectionConfig = {
  slug: 'homepage',
  hooks: {
    afterChange: [({doc})=>{
      safeRevalidatePath('/');
      return doc;
    }],
		afterDelete: [({doc})=>{
			safeRevalidatePath('/');
			return doc;
		}]
  },
  admin: {
    hidden: ({ user }) => user?.role === 'contributor' || user?.role === 'publishing_admin' || user?.role === 'author',
  },
  access: {
    read: anyoneExceptAuthor,
    create: isAdminOrEditor,
    update: isAdminOrEditor,
    delete: isAdmin,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'heroText',
      type: 'textarea',
    },
    {
      name: 'carouselImages',
      type: 'array',
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
        },
      ],
    },
    {
      name: 'ctaSection',
      type: 'group',
      fields: [
        {
          name: 'buttonText',
          type: 'text',
        },
        {
          name: 'buttonLink',
          type: 'text',
        },
      ],
    },
  ],
}
