import { authenticated } from '@/access/authenticated'
import { authenticatedOrPublished } from '@/access/authenticatedOrPublished'
import { isAdmin, isAdminOrEditor } from '@/access/roles';
import { publishedAtField } from '@/payload/fields/statusField';
import { revalidatePath } from 'next/cache';
import { CollectionConfig } from 'payload'

export const LyricsOfLight: CollectionConfig = {
  slug: 'lyrics-of-light',
  admin: {
    useAsTitle: 'title',
    hidden: ({user}) => user.role === 'contributor',
    defaultColumns: ['title', '_status', 'publishedAt', 'updatedAt'],
    group: 'Content',
  },
  access: {
    read: authenticatedOrPublished,
    readVersions: authenticated,
    update: isAdminOrEditor,
    delete: isAdmin,
    create: isAdminOrEditor,
  },
  hooks: {
    afterChange: [({doc}) => {
      revalidatePath('/lyrics-of-light');
      revalidatePath('/');
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
      name: 'audio',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Audio file for the song (MP3)',
      },
    },
    {
      name: 'youtubeLink',
      type: 'text',
      admin: {
        description: 'YouTube Video ID or Full URL (e.g. "https://www.youtube.com/watch?v=...")',
      },
    },
    {
      name: 'bookletTitle',
      type: 'text',
      admin: {
        description: 'Title of the booklet',
      }
    },
    {
      name: 'bookletImage',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Cover image of the booklet',
      }
    },
    {
      name: 'bookletDescription',
      type: 'textarea',
      admin: {
        description: 'Short description of the booklet',
      }
    },
    {
      name: 'bookletBuyLink',
      type: 'text',
      admin: {
        description: 'Link for "Buy Now" or "Request Copy" (can be internal like /contact or external)',
      }
    },
    {
      name: 'bookletFile',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Upload the PDF E-Book for free download',
      }
    },
    {
      name: 'lyrics',
      type: 'textarea',
      admin: {
        description: 'Optional lyrics of the song',
      }
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
