import { GlobalConfig } from 'payload'
import { isAdminOrPublishingAdmin } from '@/access/roles'

export const BookLaunchSettings: GlobalConfig = {
  slug: 'book-launch-settings',
  label: 'Book Launch Settings',
  access: {
    read: () => true, // Publicly readable by API routes and pages
    update: isAdminOrPublishingAdmin,
  },
  admin: {
    group: 'Funnels & Marketing',
    description: 'Manage the launch event plus the book details, prices, preview PDF, videos, audiobook clips, bookshops and reader reviews shown on the Behind the Veil page.',
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Event & Stream',
          description: 'Online launch event details, streaming link, and registration confirmation settings.',
          fields: [
            {
              name: 'bookTitle',
              type: 'text',
              label: 'Book Title',
              required: true,
              defaultValue: 'Behind the Veil',
              admin: {
                description: 'Title of the book being launched.',
              },
            },
            {
              name: 'bookSlug',
              type: 'text',
              label: 'Book Slug',
              required: true,
              defaultValue: 'behind-the-veil',
              admin: {
                description: 'URL slug for the book launch page.',
              },
            },
            {
              name: 'launchDateISO',
              type: 'text',
              label: 'Launch Target Date (ISO Format for Countdown)',
              defaultValue: '2026-11-21T17:00:00+01:00',
              admin: {
                description: 'Used by the countdown timer on the launch page (e.g. 2026-11-21T17:00:00+01:00).',
              },
            },
            {
              name: 'eventDate',
              type: 'text',
              label: 'Event Date & Time (Display String)',
              defaultValue: 'Saturday, 21 November 2026 at 5:00 PM (WAT) / 4:00 PM (GMT)',
              admin: {
                description: 'Human-friendly date and time displayed in confirmation emails and UI headers.',
              },
            },
            {
              name: 'meetingPlatform',
              type: 'select',
              label: 'Meeting Platform',
              defaultValue: 'Zoom',
              options: [
                { label: 'Zoom', value: 'Zoom' },
                { label: 'Google Meet', value: 'Google Meet' },
                { label: 'YouTube Live', value: 'YouTube Live' },
                { label: 'Microsoft Teams', value: 'Microsoft Teams' },
                { label: 'Other', value: 'Other' },
              ],
            },
            {
              name: 'meetingLink',
              type: 'text',
              label: 'Zoom Meeting / Primary Stream URL',
              admin: {
                placeholder: 'https://zoom.us/j/123456789',
                description: 'Primary Zoom stream. Emailed to registered attendees and shown on the landing page while the stream is live.',
              },
            },
            {
              name: 'meetingPasscode',
              type: 'text',
              label: 'Meeting Passcode / Access PIN (Optional)',
              admin: {
                description: 'Passcode or meeting ID required to join the stream.',
              },
            },
            {
              name: 'streamGoLive',
              type: 'checkbox',
              label: 'Go Live — Show the Live Stream Section on the Landing Page',
              defaultValue: false,
              admin: {
                description: 'Turn on while the launch stream is live. Visitors then see the Zoom, YouTube and Facebook stream links and the YouTube player.',
              },
            },
            {
              name: 'youtubeStreamUrl',
              type: 'text',
              label: 'YouTube Stream URL (Optional)',
              admin: {
                placeholder: 'https://www.youtube.com/live/... or https://youtu.be/...',
                description: 'Secondary stream. When set, it is embedded as a player in the live section.',
              },
            },
            {
              name: 'facebookStreamUrl',
              type: 'text',
              label: 'Facebook Stream URL (Optional)',
              admin: {
                placeholder: 'https://www.facebook.com/.../videos/...',
                description: 'Secondary stream. When set, a "Watch on Facebook" button is shown.',
              },
            },
            {
              name: 'customNote',
              type: 'textarea',
              label: 'Additional Attendee Instructions (Optional)',
              admin: {
                description: 'Custom notes or instructions appended to the registration confirmation email.',
              },
            },
            {
              name: 'sendConfirmationEmail',
              type: 'checkbox',
              label: 'Send Automatic Confirmation Email on Registration',
              defaultValue: true,
              admin: {
                description: 'When enabled, registrants receive an instant confirmation email with access details.',
              },
            },
          ],
        },
        {
          label: 'Book Details',
          description: 'Publication facts shown in the Publication Information card.',
          fields: [
            {
              name: 'publisher',
              type: 'text',
              label: 'Publisher',
              defaultValue: 'Spiritans Sound',
            },
            {
              name: 'imprint',
              type: 'text',
              label: 'Imprint',
              defaultValue: 'Treasures Unveiler',
            },
            {
              name: 'publicationDate',
              type: 'text',
              label: 'Publication Date',
              defaultValue: '21 November 2026',
              admin: {
                description: 'Human-friendly publication date shown in the book details card.',
              },
            },
            {
              name: 'language',
              type: 'text',
              label: 'Language',
              defaultValue: 'English',
            },
            {
              name: 'pages',
              type: 'text',
              label: 'Pages of Book',
              defaultValue: '320 pages',
              admin: {
                placeholder: 'e.g. 320 pages or TBC',
                description: 'Total number of pages of the book.',
              },
            },
            {
              name: 'isbn',
              type: 'text',
              label: 'ISBN',
              defaultValue: '978-978-782-140-3',
              admin: {
                placeholder: 'e.g. 978-978-782-140-3',
                description: 'International Standard Book Number.',
              },
            },
            {
              name: 'category',
              type: 'text',
              label: 'Category',
              defaultValue: 'Christian Living · Relationships · Psychology',
            },
          ],
        },
        {
          label: 'Pricing & Formats',
          description: 'Prices for the eBook and physical Paperback editions.',
          fields: [
            {
              name: 'isPreorder',
              type: 'checkbox',
              label: 'Sell as Pre-Order',
              defaultValue: true,
              admin: {
                description: 'When checked, purchases are treated as pre-orders and confirmation emails specify launch release delivery.',
              },
            },
            {
              name: 'publication',
              type: 'relationship',
              relationTo: 'publications',
              label: 'Linked Publication in Library',
              admin: {
                description: 'Attach to the Behind the Veil publication for tracking inventory, orders, and sales metrics.',
              },
            },
            // eBook pricing
            {
              type: 'collapsible',
              label: 'eBook (Digital Edition)',
              admin: {
                initCollapsed: false,
              },
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'ebookPriceNGN',
                      type: 'number',
                      label: 'Price in Naira (NGN - Paystack)',
                      defaultValue: 5000,
                      required: true,
                    },
                    {
                      name: 'ebookPriceUSD',
                      type: 'number',
                      label: 'Price in USD ($ - Stripe)',
                      defaultValue: 10,
                      required: true,
                    },
                    {
                      name: 'ebookPriceGBP',
                      type: 'number',
                      label: 'Price in Pounds (£ - Stripe)',
                      defaultValue: 8,
                      required: true,
                    },
                  ],
                },
              ],
            },
            // Paperback pricing
            {
              type: 'collapsible',
              label: 'Paperback (Physical Edition)',
              admin: {
                initCollapsed: false,
              },
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'paperbackPriceNGN',
                      type: 'number',
                      label: 'Price in Naira (NGN - Paystack)',
                      defaultValue: 12000,
                      required: true,
                    },
                    {
                      name: 'paperbackPriceUSD',
                      type: 'number',
                      label: 'Price in USD ($ - Stripe)',
                      defaultValue: 25,
                      required: true,
                    },
                    {
                      name: 'paperbackPriceGBP',
                      type: 'number',
                      label: 'Price in Pounds (£ - Stripe)',
                      defaultValue: 20,
                      required: true,
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'Preview of Book',
          description: 'The preview chapter text shown in the "Read a preview" section.',
          fields: [
            {
              name: 'previewChapterTitle',
              type: 'text',
              label: 'Preview Subheading',
              defaultValue: 'From Chapter One — The Veil',
              admin: {
                placeholder: 'e.g. From Chapter One — The Veil',
                description: 'Small caption shown above the preview chapter.',
              },
            },
            {
              name: 'previewChapter',
              type: 'richText',
              label: 'Preview Chapter',
              admin: {
                description: 'Chapter text shown on the landing page. Supports headings, paragraphs, lists, quotes and links.',
              },
            },
          ],
        },
        {
          label: 'Watch & Listen',
          description: 'YouTube / video links displayed in the Watch & Listen section.',
          fields: [
            {
              name: 'videos',
              type: 'array',
              label: 'Videos List',
              labels: {
                singular: 'Video',
                plural: 'Videos',
              },
              fields: [
                {
                  name: 'title',
                  type: 'text',
                  required: true,
                  label: 'Video Title',
                  admin: {
                    placeholder: 'e.g. Behind the Veil — Author Introduction',
                  },
                },
                {
                  name: 'url',
                  type: 'text',
                  required: true,
                  label: 'YouTube / Video URL',
                  admin: {
                    placeholder: 'https://www.youtube.com/watch?v=... or https://youtu.be/...',
                  },
                },
                {
                  name: 'description',
                  type: 'textarea',
                  label: 'Short Description',
                },
              ],
            },
          ],
        },
        {
          label: 'Audio Book Preview',
          description: 'Audio clips displayed in the "Listen to a Preview" section.',
          fields: [
            {
              name: 'audioPreviews',
              type: 'array',
              label: 'Audio Preview Clips',
              labels: {
                singular: 'Audio Clip',
                plural: 'Audio Clips',
              },
              fields: [
                {
                  name: 'title',
                  type: 'text',
                  required: true,
                  label: 'Clip Title',
                  admin: {
                    placeholder: 'e.g. Chapter One — The Veil',
                  },
                },
                {
                  name: 'description',
                  type: 'text',
                  label: 'Short Description',
                  admin: {
                    placeholder: 'e.g. Opening chapter narrated by Fr. Oluwafemi Victor Orilua',
                  },
                },
                {
                  name: 'audioFile',
                  type: 'upload',
                  relationTo: 'media',
                  label: 'Uploaded Audio File (MP3/WAV)',
                },
                {
                  name: 'audioUrl',
                  type: 'text',
                  label: 'Or Audio Stream / MP3 URL',
                  admin: {
                    placeholder: 'https://...',
                  },
                },
              ],
            },
          ],
        },
        {
          label: 'Bookshops in Nigeria',
          description: 'Physical bookstore locations stocking copies in Nigeria.',
          fields: [
            {
              name: 'bookshops',
              type: 'array',
              label: 'Bookstores',
              labels: {
                singular: 'Bookstore',
                plural: 'Bookstores',
              },
              fields: [
                {
                  name: 'name',
                  type: 'text',
                  required: true,
                  label: 'Bookshop Name',
                  admin: {
                    placeholder: 'e.g. Paulines Media Centre',
                  },
                },
                {
                  name: 'address',
                  type: 'text',
                  required: true,
                  label: 'Street / Compound Address',
                  admin: {
                    placeholder: 'e.g. St. Agnes Catholic Church Compound, Maryland',
                  },
                },
                {
                  name: 'city',
                  type: 'text',
                  required: true,
                  label: 'City & State',
                  admin: {
                    placeholder: 'e.g. Lagos',
                  },
                },
                {
                  name: 'phone',
                  type: 'text',
                  label: 'Phone Number',
                  admin: {
                    placeholder: 'e.g. +234 803 000 0000',
                  },
                },
              ],
            },
          ],
        },
        {
          label: 'What Readers Are Saying',
          description: 'Reader reviews captured for the testimonials section.',
          fields: [
            {
              name: 'testimonials',
              type: 'array',
              label: 'Testimonials',
              labels: {
                singular: 'Testimonial',
                plural: 'Testimonials',
              },
              fields: [
                {
                  name: 'name',
                  type: 'text',
                  required: true,
                  label: 'Reader / Reviewer Name',
                  admin: {
                    placeholder: 'e.g. Dr. Ngozi Adeleke',
                  },
                },
                {
                  name: 'detail',
                  type: 'text',
                  label: 'Role / Location',
                  admin: {
                    placeholder: 'e.g. Clinical Psychologist, Lagos',
                  },
                },
                {
                  name: 'quote',
                  type: 'textarea',
                  required: true,
                  label: 'Review / Quote',
                  admin: {
                    placeholder: 'What the reader said about the book...',
                  },
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}
