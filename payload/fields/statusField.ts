import type { DateField } from 'payload'

/**
 * Shared `publishedAt` sidebar field for draft-enabled collections.
 * Automatically sets the date when a document is first published.
 */
export const publishedAtField: DateField = {
  name: 'publishedAt',
  type: 'date',
  admin: {
    date: {
      pickerAppearance: 'dayAndTime',
    },
    position: 'sidebar',
  },
  hooks: {
    beforeChange: [
      ({ siblingData, value }) => {
        // Auto-set publish date on first publish, but never overwrite a manually set date
        if (siblingData._status === 'published' && !value) {
          return new Date()
        }
        return value
      },
    ],
  },
}
