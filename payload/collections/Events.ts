import { Banner } from '@/blocks/Banner/config'
import { Code } from '@/blocks/Code/config'
import { MediaBlock } from '@/blocks/MediaBlock/config'
import { BlocksFeature, FixedToolbarFeature, HeadingFeature, HorizontalRuleFeature, InlineToolbarFeature, lexicalEditor, UploadFeature } from '@payloadcms/richtext-lexical'
import { CollectionConfig } from 'payload'

export const Events: CollectionConfig = {
  slug: 'events',
  admin: {
    useAsTitle: 'title',
  },
  access: {
    read: () => true,
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
      name: 'date',
      type: 'date',
      required: true,
    },
    {
      name: 'location',
      type: 'text',
    },
    {
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'excerpt',
      type: 'textarea',
    },
    {
      name: 'youtubeUrl',
      type: 'text',
      required: false
    },
{
  name: 'body',
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
                  name: 'linkUrl',
                  type: 'text',
                  label: 'Clickable Link URL (Optional)',
                  admin: {
                    placeholder: 'https://... or /relative-path',
                  },
                },
                {
                  name: 'openInNewTab',
                  type: 'checkbox',
                  label: 'Open link in new tab',
                  defaultValue: false,
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
      name: 'isFeatured',
      type: 'checkbox',
      defaultValue: false,
    },
    {
      name: 'isPopular',
      type: 'checkbox',
      defaultValue: false,
    },
    {
      name: 'featuredImage',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'publishedAt',
      type: 'date',
    },
  ],
}
