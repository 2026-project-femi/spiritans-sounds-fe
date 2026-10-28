import { anyoneExceptAuthor } from '@/access/anyoneExceptAuthor'
import { isAdminOrPublishingAdmin } from '@/access/roles'
import type { GlobalConfig, TextFieldSingleValidation } from 'payload'

export const YcnSettings: GlobalConfig = {
  slug: 'ycn-settings',
  label: 'Young Creators Settings',
  admin: {
    group: 'Young Creators',
    description:
      'Programme-wide media, verified impact figures and contact details shown across the Young Creators Network.',
    hidden: ({ user }) => user?.role !== 'admin' && user?.role !== 'publishing_admin',
  },
  access: {
    read: anyoneExceptAuthor,
    update: isAdminOrPublishingAdmin,
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Media',
          fields: [
            {
              name: 'heroImage',
              type: 'upload',
              relationTo: 'media',
              label: 'Landing Hero Image',
              admin: {
                description: 'Wide photograph used behind the landing page hero. Add alt text on the Media item.',
              },
            },
            {
              name: 'workshopImage',
              type: 'upload',
              relationTo: 'media',
              label: 'Impact Section Image',
              admin: {
                description: 'Photograph of mentoring, workshops or a showcase.',
              },
            },
          ],
        },
        {
          label: 'Impact',
          fields: [
            {
              name: 'impactStats',
              type: 'array',
              label: 'Verified Impact Figures',
              labels: { singular: 'Figure', plural: 'Figures' },
              admin: {
                description:
                  'Only add figures that can be verified. Leave empty to show the qualitative impact pillars without numbers.',
              },
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'value',
                      type: 'text',
                      required: true,
                      maxLength: 24,
                      label: 'Value (e.g. 120+)',
                    },
                    {
                      name: 'label',
                      type: 'text',
                      required: true,
                      maxLength: 80,
                      label: 'Label (e.g. creators supported)',
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'Contact',
          fields: [
            {
              name: 'contactLabel',
              type: 'text',
              label: 'Contact Link Label',
              defaultValue: 'Contact the Young Creators Team',
            },
            {
              name: 'contactHref',
              type: 'text',
              label: 'Contact Link URL',
              validate: ((value) => {
                if (!value) return true
                if (value.startsWith('mailto:')) return true
                try {
                  const url = new URL(value)
                  return url.protocol === 'https:' || url.protocol === 'http:' || 'Enter a valid https URL or mailto: address.'
                } catch {
                  return 'Enter a valid https URL or mailto: address.'
                }
              }) as TextFieldSingleValidation,
              admin: {
                description: 'Leave blank to hide the contact link in the footer.',
              },
            },
          ],
        },
      ],
    },
  ],
}
