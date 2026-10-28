import { authenticated } from '@/access/authenticated'
import { authenticatedOrPublished } from '@/access/authenticatedOrPublished'
import { adminOrEditorField, authenticatedField } from '@/access/fieldAccess'
import { isAdmin, isAdminOrEditor } from '@/access/roles'
import { publishedAtField } from '@/payload/fields/statusField'
import { revalidatePath } from 'next/cache'
import type { CollectionConfig, FieldHook } from 'payload'

const TALENT_CATEGORIES = [
  { label: 'Writer', value: 'writing' },
  { label: 'Musician', value: 'music' },
  { label: 'Visual Artist', value: 'visual-art' },
  { label: 'Photographer', value: 'photography' },
  { label: 'Dancer', value: 'dance' },
  { label: 'Digital Creator', value: 'digital' },
  { label: 'Technology & Innovation', value: 'technology' },
]

const WORK_TYPES = [
  { label: 'Writing', value: 'Writing' },
  { label: 'Music', value: 'Music' },
  { label: 'Artwork', value: 'Artwork' },
  { label: 'Photo series', value: 'Photo series' },
  { label: 'Performance', value: 'Performance' },
  { label: 'Video', value: 'Video' },
  { label: 'Project', value: 'Project' },
]

const isHttpUrl = (value: unknown): boolean => {
  if (!value) return true
  if (typeof value !== 'string') return false
  try {
    const url = new URL(value)
    return url.protocol === 'https:' || url.protocol === 'http:'
  } catch {
    return false
  }
}

const isEmbeddableVideoUrl = (value: unknown): boolean => {
  if (!value) return true
  if (!isHttpUrl(value)) return false
  const host = new URL(String(value)).hostname.replace(/^www\./, '')
  return ['youtube.com', 'youtu.be', 'player.vimeo.com', 'vimeo.com'].includes(host)
}

const slugify: FieldHook = ({ value, data }) => {
  if (value && typeof value === 'string') {
    const cleaned = value.replace(/^undefined-/, '').trim()
    if (cleaned) return cleaned
  }
  const name = (data?.publicDisplayName as string) || ''
  return name
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]/g, '')
    .slice(0, 96)
}

const safeRevalidate = (path: string) => {
  try {
    revalidatePath(path)
  } catch {
    // revalidatePath is only available inside a Next.js request context
    // (for example, not when running seed scripts).
  }
}

const revalidateCreator = ({ doc }: { doc?: { slug?: string } | null }) => {
  safeRevalidate('/young-creators')
  safeRevalidate('/young-creators/creators')
  if (doc?.slug) safeRevalidate(`/young-creators/creators/${doc.slug}`)
  return doc
}

export const YoungCreators: CollectionConfig = {
  slug: 'young-creators',
  labels: {
    singular: 'Young Creator',
    plural: 'Young Creators',
  },
  admin: {
    group: 'Young Creators',
    useAsTitle: 'publicDisplayName',
    defaultColumns: ['publicDisplayName', 'classYear', 'primaryCategory', 'featured', '_status', 'updatedAt'],
    listSearchableFields: ['publicDisplayName', 'slug', 'location', 'talents.label'],
    hidden: ({ user }) => user?.role === 'contributor' || user?.role === 'publishing_admin' || user?.role === 'author',
  },
  access: {
    read: authenticatedOrPublished,
    readVersions: authenticated,
    create: isAdminOrEditor,
    update: isAdminOrEditor,
    delete: isAdmin,
  },
  hooks: {
    afterChange: [revalidateCreator],
    afterDelete: [revalidateCreator],
  },
  versions: {
    drafts: {
      autosave: false,
      schedulePublish: true,
    },
    maxPerDoc: 25,
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Profile',
          fields: [
            {
              name: 'publicDisplayName',
              type: 'text',
              required: true,
              label: 'Public Display Name',
              admin: {
                description:
                  'The only name shown on the website. Set it according to consent (full name, first name + initial, or agreed alias).',
              },
            },
            {
              name: 'slug',
              type: 'text',
              unique: true,
              required: true,
              admin: {
                position: 'sidebar',
                description: 'Public URL: /young-creators/creators/{slug}',
              },
              hooks: {
                beforeValidate: [slugify],
              },
            },
            {
              name: 'portrait',
              type: 'upload',
              relationTo: 'media',
              required: true,
              label: 'Portrait (4:5)',
              admin: {
                description: 'Required. Add alt text on the Media item — it is used for accessibility and social previews.',
              },
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'classYear',
                  type: 'number',
                  required: true,
                  min: 2000,
                  max: 2100,
                  label: 'Class Year',
                },
                {
                  name: 'primaryCategory',
                  type: 'select',
                  required: true,
                  label: 'Primary Talent',
                  options: TALENT_CATEGORIES,
                },
                {
                  name: 'featured',
                  type: 'checkbox',
                  defaultValue: false,
                  label: 'Featured',
                },
              ],
            },
            {
              name: 'location',
              type: 'text',
              label: 'City / Region (optional)',
              admin: {
                description: 'City or region only — never a full address. Leave blank to hide.',
              },
            },
            {
              name: 'talents',
              type: 'array',
              label: 'Talents',
              labels: { singular: 'Talent', plural: 'Talents' },
              fields: [
                {
                  name: 'label',
                  type: 'text',
                  required: true,
                  label: 'Talent',
                },
              ],
            },
            {
              name: 'tagline',
              type: 'textarea',
              required: true,
              maxLength: 240,
              label: 'Tagline',
            },
            {
              name: 'bio',
              type: 'array',
              label: 'Biography',
              labels: { singular: 'Paragraph', plural: 'Paragraphs' },
              fields: [
                {
                  name: 'text',
                  type: 'textarea',
                  required: true,
                  label: 'Paragraph',
                },
              ],
            },
            {
              name: 'giftsAndTalents',
              type: 'textarea',
              label: 'Gifts & Talents',
            },
            {
              name: 'discoveryStory',
              type: 'textarea',
              label: 'Discovery Story',
            },
          ],
        },
        {
          label: 'Interview',
          fields: [
            {
              name: 'interview',
              type: 'array',
              label: 'Interview Q&A',
              labels: { singular: 'Question', plural: 'Questions' },
              fields: [
                {
                  name: 'question',
                  type: 'text',
                  required: true,
                },
                {
                  name: 'answer',
                  type: 'textarea',
                  required: true,
                },
              ],
            },
            {
              name: 'videoUrl',
              type: 'text',
              label: 'Video Interview Embed URL',
              validate: (value: unknown) =>
                isEmbeddableVideoUrl(value)
                  ? true
                  : 'Enter a valid https YouTube or Vimeo embed URL.',
              admin: {
                description: 'YouTube or Vimeo embed URL. Leave blank to show “coming soon”.',
              },
            },
            {
              name: 'videoPoster',
              type: 'upload',
              relationTo: 'media',
              label: 'Video Poster',
            },
          ],
        },
        {
          label: 'Portfolio',
          fields: [
            {
              name: 'works',
              type: 'array',
              label: 'Creative Works',
              labels: { singular: 'Work', plural: 'Works' },
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'title',
                      type: 'text',
                      required: true,
                    },
                    {
                      name: 'type',
                      type: 'select',
                      required: true,
                      options: WORK_TYPES,
                    },
                    {
                      name: 'year',
                      type: 'number',
                      required: true,
                      min: 2000,
                      max: 2100,
                    },
                  ],
                },
                {
                  name: 'description',
                  type: 'textarea',
                  required: true,
                },
                {
                  name: 'image',
                  type: 'upload',
                  relationTo: 'media',
                },
                {
                  name: 'href',
                  type: 'text',
                  label: 'External Link',
                  validate: (value: unknown) =>
                    isHttpUrl(value) ? true : 'Enter a valid http(s) URL.',
                },
              ],
            },
            {
              name: 'achievements',
              type: 'array',
              label: 'Achievements',
              labels: { singular: 'Achievement', plural: 'Achievements' },
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'year',
                      type: 'number',
                      required: true,
                      min: 2000,
                      max: 2100,
                    },
                    {
                      name: 'title',
                      type: 'text',
                      required: true,
                    },
                  ],
                },
                {
                  name: 'detail',
                  type: 'text',
                },
              ],
            },
            {
              name: 'gallery',
              type: 'array',
              label: 'Gallery',
              labels: { singular: 'Image', plural: 'Images' },
              fields: [
                {
                  name: 'image',
                  type: 'upload',
                  relationTo: 'media',
                  required: true,
                },
                {
                  name: 'caption',
                  type: 'text',
                },
              ],
            },
          ],
        },
      ],
    },
    publishedAtField,
    // ── Safeguarding: admin-only fields ─────────────────────────────────────
    {
      type: 'collapsible',
      label: 'Safeguarding & Consent (Admin Only)',
      admin: {
        initCollapsed: true,
        description: 'Never exposed to the public API. Used to record consent decisions and internal notes.',
      },
      fields: [
        {
          name: 'nameVisibility',
          type: 'select',
          label: 'Approved Naming Basis',
          options: [
            { label: 'Full name (consented)', value: 'full-name' },
            { label: 'First name + initial', value: 'first-name-initial' },
            { label: 'Alias', value: 'alias' },
          ],
          access: {
            read: authenticatedField,
            create: adminOrEditorField,
            update: adminOrEditorField,
          },
        },
        {
          name: 'legalName',
          type: 'text',
          label: 'Legal Name',
          access: {
            read: authenticatedField,
            create: adminOrEditorField,
            update: adminOrEditorField,
          },
        },
        {
          name: 'isMinor',
          type: 'checkbox',
          label: 'Creator is under 18',
          defaultValue: false,
          access: {
            read: authenticatedField,
            create: adminOrEditorField,
            update: adminOrEditorField,
          },
        },
        {
          name: 'guardianConsentOnFile',
          type: 'checkbox',
          label: 'Guardian / parental consent on file',
          defaultValue: false,
          access: {
            read: authenticatedField,
            create: adminOrEditorField,
            update: adminOrEditorField,
          },
        },
        {
          name: 'consentDate',
          type: 'date',
          label: 'Consent Date',
          admin: {
            date: { pickerAppearance: 'dayOnly' },
          },
          access: {
            read: authenticatedField,
            create: adminOrEditorField,
            update: adminOrEditorField,
          },
        },
        {
          name: 'internalNotes',
          type: 'textarea',
          label: 'Internal Notes',
          access: {
            read: authenticatedField,
            create: adminOrEditorField,
            update: adminOrEditorField,
          },
        },
      ],
    },
  ],
}
