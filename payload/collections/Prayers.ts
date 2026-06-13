import { anyone } from '@/access/anyone'
import { authenticatedOrPublished } from '@/access/authenticatedOrPublished'
import { isAdmin, isAdminOrEditor } from '@/access/roles'
import { Banner } from '@/blocks/Banner/config'
import { Code } from '@/blocks/Code/config'
import { MediaBlock } from '@/blocks/MediaBlock/config'
import { publishedAtField } from '@/payload/fields/statusField'
import { BlocksFeature, FixedToolbarFeature, HeadingFeature, HorizontalRuleFeature, InlineToolbarFeature, lexicalEditor } from '@payloadcms/richtext-lexical'
import { revalidatePath } from 'next/cache'
import { CollectionConfig } from 'payload'

export const Prayers: CollectionConfig = {
  slug: 'prayer',
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
