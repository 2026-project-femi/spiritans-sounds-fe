import { revalidatePath } from 'next/cache';
import { CollectionConfig } from 'payload'

export const HomePage: CollectionConfig = {
  slug: 'homepage',
  hooks: {
    afterChange: [({doc})=>{
      revalidatePath('/');
      return doc;
    }]
  },
  admin: {
    hidden: ({user})=>user.role === 'contributor'
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
