import type { Field } from 'payload'

/**
 * Link fields for an image placement (featured image, media block, etc.).
 * Kept in one place so every image type exposes the same admin UI.
 */
export const imageLinkFields = (): Field[] => [
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
]
