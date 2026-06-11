import { revalidatePath } from 'next/cache';
import { CollectionConfig } from 'payload'

export const Publications: CollectionConfig = {
  slug: 'publications',
  admin: {
    useAsTitle: 'title',
  },
  access: {
    read: () => true,
  },hooks: {
    afterChange: [({doc})=>{
      revalidatePath('/unveiler/books');
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
      name: 'cover',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'file',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'publishedAt',
      type: 'date',
    },
  ],
}
