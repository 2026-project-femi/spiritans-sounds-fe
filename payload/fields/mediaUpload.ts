import { UploadFeature } from '@payloadcms/richtext-lexical'

/**
 * Inline upload feature shared by every rich-text body that allows images.
 *
 * The extra node fields are stored inside the Lexical JSON, so adding them does
 * not require a database migration. `components/RichText` reads `linkUrl` and
 * `openInNewTab` to render the image as a link; without a URL it opens the
 * lightbox instead.
 */
export const mediaUploadFeature = () =>
  UploadFeature({
    collections: {
      media: {
        fields: [
          {
            name: 'caption',
            type: 'text',
            label: 'Caption (Optional)',
          },
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
  })
