import { anyone } from '@/access/anyone'
import { authenticated } from '@/access/authenticated'
import { authenticatedOrPublished } from '@/access/authenticatedOrPublished'
import { isAdmin, isAdminOrEditor } from '@/access/roles'
import { Banner } from '@/blocks/Banner/config'
import { Code } from '@/blocks/Code/config'
import { MediaBlock } from '@/blocks/MediaBlock/config'
import { publishedAtField } from '@/payload/fields/statusField'
import { BlocksFeature, FixedToolbarFeature, HeadingFeature, HorizontalRuleFeature, InlineToolbarFeature, lexicalEditor, UploadFeature } from '@payloadcms/richtext-lexical'
import { revalidatePath } from 'next/cache'
import { CollectionConfig } from 'payload'

export const Prayers: CollectionConfig = {
  slug: 'prayer',
  admin: {
    useAsTitle: 'title',
    hidden: ({user})=>user?.role === 'contributor' || user?.role === 'publishing_admin',
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
      revalidatePath('/prayers');
      revalidatePath('/')
      return doc;
    }],
    afterDelete: [({doc})=>{
      revalidatePath('/prayers');
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
    {
      name: 'category',
      type: 'text',
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
