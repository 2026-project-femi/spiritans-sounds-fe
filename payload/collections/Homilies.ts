import { authenticated } from '@/access/authenticated'
import { authenticatedOrPublished } from '@/access/authenticatedOrPublished'
import { Banner } from '@/blocks/Banner/config'
import { Code } from '@/blocks/Code/config'
import { MediaBlock } from '@/blocks/MediaBlock/config'
import { publishedAtField } from '@/payload/fields/statusField'
import { BlocksFeature, FixedToolbarFeature, HeadingFeature, HorizontalRuleFeature, InlineToolbarFeature, lexicalEditor, UploadFeature } from '@payloadcms/richtext-lexical'
import { revalidatePath } from 'next/cache'
import { CollectionConfig } from 'payload'

export const Homilies: CollectionConfig = {
  slug: 'homily',
  admin: {
    useAsTitle: 'title',
    hidden: ({user})=>user?.role === 'contributor' || user?.role === 'publishing_admin',
    defaultColumns: ['title', 'views', '_status', 'publishedAt', 'updatedAt'],
  },
  access: {
    read: authenticatedOrPublished,
    readVersions: authenticated,
    create: authenticated,
    update: authenticated,
    delete: authenticated,
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
      name: 'views',
      type: 'number',
      defaultValue: 0,
      admin: {
        position: 'sidebar',
        description: 'Total number of homily views/reads',
      },
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
      type: 'select',
      options: [
        { label: 'Sunday', value: 'Sunday' },
        { label: 'Feast Day', value: 'Feast Day' },
        { label: 'Special', value: 'Special' },
        { label: 'Weekday', value: 'Weekday' },
        { label: 'Memorial', value: 'Memorial' },
        { label: 'Solemnity', value: 'Solemnity' },
      ],
      admin: {
        description: 'Select the homily category',
      },
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
                    UploadFeature({
                      collections: {
                        media: {
                          fields: [
                            {
                              name: 'caption',
                              type: 'text',
                              label: 'Caption (Optional)',
                            },
                          ],
                        },
                      },
                    }),
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
    publishedAtField,
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
            if (value && typeof value === 'string') {
              const cleaned = value.replace(/^undefined-/, '').trim()
              if (cleaned) return cleaned
            }
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
  versions: {
    drafts: {
      autosave: false,
      schedulePublish: true,
    },
    maxPerDoc: 25,
  },
}
