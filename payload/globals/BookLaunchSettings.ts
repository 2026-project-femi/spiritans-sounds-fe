import { GlobalConfig } from 'payload'
import { isAdminOrPublishingAdmin } from '@/access/roles'
import { normalizeExternalUrl } from '@/lib/externalUrl'

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
    hidden: ({ user }) => user?.role !== 'admin' && user?.role !== 'publishing_admin',
  },
  hooks: {
    beforeChange: [
      ({ data }) => {
        // Normalise stream URLs on save so a bare "zoom.com" is stored (and
        // later linked/embedded) as an absolute https URL.
        // `?? null` (not undefined) is important: undefined is treated as "leave
        // unchanged", which would make it impossible to clear a URL in the admin.
        data.meetingLink = normalizeExternalUrl(data?.meetingLink) ?? null
        data.youtubeStreamUrl = normalizeExternalUrl(data?.youtubeStreamUrl) ?? null
        data.launchReplayUrl = normalizeExternalUrl(data?.launchReplayUrl) ?? null
        data.facebookStreamUrl = normalizeExternalUrl(data?.facebookStreamUrl) ?? null
        // External retailer links (Amazon / Selar) accept bare domains too.
        data.amazonKindleUrl = normalizeExternalUrl(data?.amazonKindleUrl) ?? null
        data.amazonPaperbackUrl = normalizeExternalUrl(data?.amazonPaperbackUrl) ?? null
        data.selarUrl = normalizeExternalUrl(data?.selarUrl) ?? null
        return data
      },
    ],
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
              name: 'launchDateTime',
              type: 'date',
              label: 'Launch Date & Time',
              required: true,
              defaultValue: '2026-11-21T17:00:00+01:00',
              admin: {
                date: {
                  pickerAppearance: 'dayAndTime',
                },
                description:
                  'Drives the countdown timer and the Date & Time shown on the launch page and in confirmation emails.',
              },
            },
            {
              name: 'timezone',
              type: 'text',
              label: 'Event Timezone',
              defaultValue: 'Africa/Lagos',
              admin: {
                description:
                  'IANA timezone used to display the launch date and time (e.g. Africa/Lagos, Europe/London, America/New_York).',
              },
            },
            {
              // Deprecated: replaced by `launchDateTime`. Retained for backwards
              // compatibility with existing data; hidden from the admin UI.
              name: 'launchDateISO',
              type: 'text',
              admin: {
                hidden: true,
              },
            },
            {
              // Deprecated: the display string is now derived from `launchDateTime`.
              name: 'eventDate',
              type: 'text',
              admin: {
                hidden: true,
              },
            },
            {
              name: 'meetingPlatform',
              type: 'text',
              label: 'Meeting Platform',
              admin: {
                placeholder: 'Zoom, Google Meet, YouTube Live…',
                description:
                  'Shown on the launch page and in confirmation emails. Leave blank to show a generic label.',
              },
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
                description:
                  'Turn on while the launch stream is live. Visitors then see the Watch Live section and the buy buttons.',
              },
            },
            {
              name: 'youtubeStreamUrl',
              type: 'text',
              label: 'Live YouTube Stream URL (Optional)',
              admin: {
                placeholder: 'https://www.youtube.com/live/... or https://youtu.be/...',
                description:
                  'The YouTube live stream. When set, it is embedded as the player in the Watch Live section.',
              },
            },
            {
              name: 'launchReplayUrl',
              type: 'text',
              label: 'Launch Replay — Edited YouTube URL',
              admin: {
                placeholder: 'https://www.youtube.com/watch?v=... or https://youtu.be/...',
                description:
                  'Paste the edited/final YouTube video of the launch. It plays in the Watch Live section, and the replay stays visible even when "Go Live" is switched off.',
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
          description: 'Prices for the eBook and physical Paperback editions, plus external retailer links.',
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
            // External retailer links
            {
              type: 'collapsible',
              label: 'Buy from Amazon or Selar',
              admin: {
                initCollapsed: false,
                description:
                  'These links appear as "Also available from" buttons under the purchase cards. Leave a field empty to hide that button.',
              },
              fields: [
                {
                  name: 'amazonKindleUrl',
                  type: 'text',
                  label: 'Amazon Kindle Link',
                  admin: {
                    placeholder: 'https://www.amazon.com/dp/B0XXXXXXXX',
                    description: 'Direct link to the Kindle edition on Amazon.',
                  },
                },
                {
                  name: 'amazonPaperbackUrl',
                  type: 'text',
                  label: 'Amazon Paperback Link',
                  admin: {
                    placeholder: 'https://www.amazon.com/dp/XXXXXXXXXX',
                    description: 'Direct link to the paperback edition on Amazon.',
                  },
                },
                {
                  name: 'selarUrl',
                  type: 'text',
                  label: 'Selar Link',
                  admin: {
                    placeholder: 'https://selar.co/behind-the-veil',
                    description: 'Link to the book on Selar.',
                  },
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
