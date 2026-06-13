import { Banner } from '@/blocks/Banner/config'
import { Code } from '@/blocks/Code/config'
import { MediaBlock } from '@/blocks/MediaBlock/config'
import { BlocksFeature, FixedToolbarFeature, HeadingFeature, HorizontalRuleFeature, InlineToolbarFeature, lexicalEditor } from '@payloadcms/richtext-lexical'
import { revalidatePath } from 'next/cache'
import { CollectionConfig } from 'payload'

export const Homilies: CollectionConfig = {
  slug: 'homily',
  admin: {
    useAsTitle: 'title',
    hidden: ({user})=>user.role === 'contributor' 

  },
  access: {
    read: () => true,
  },
  hooks: {
    afterChange: [({doc})=>{
      revalidatePath('/homilies');
      revalidatePath('/')
      return doc;
    }],
    afterDelete: [({doc})=>{
      revalidatePath('/homilies');
      revalidatePath('/')
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
      name: 'date',
      type: 'date',
      required: true,
    },
    {
      name: 'scripture',
      type: 'text',
    },
    {
      name: 'category',
      type: 'text', // You could change this to select or relationship
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
              editor: lexicalEditor({
                features: ({ rootFeatures }) => {
                  return [
                    ...rootFeatures,
                    HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
                    BlocksFeature({ blocks: [Banner, Code, MediaBlock] }),
                    FixedToolbarFeature(),
                    InlineToolbarFeature(),
                    HorizontalRuleFeature(),
                  ]
                },
              }),
              label: 'Content text',
            },
    {
      name: 'audio',
      type: 'upload',
      relationTo: 'media', // Can reuse media or create a separate audio collection
    },
    {
      name: 'youtubeUrl',
      type: 'text',
    },
    {
      name: 'publishedAt',
      type: 'date',
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
  ],
}
