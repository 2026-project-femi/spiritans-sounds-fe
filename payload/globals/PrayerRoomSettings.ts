import { isAdminOrEditor } from '@/access/roles'
import { normalizeExternalUrl } from '@/lib/externalUrl'
import { safeRevalidatePath } from '@/lib/revalidate'
import type { GlobalConfig } from 'payload'

export const PrayerRoomSettings: GlobalConfig = {
  slug: 'prayer-room-settings',
  label: 'Prayer Room Settings',
  admin: {
    group: 'Prayer Room',
    description:
      'Copy, live room details and section headings shown on the Prayer Room landing page. Prayer sessions and intentions are managed in their own collections.',
    hidden: ({ user }) => user?.role !== 'admin' && user?.role !== 'editor',
  },
  access: {
    read: () => true,
    update: isAdminOrEditor,
  },
  hooks: {
    afterChange: [
      () => {
        for (const path of [
          '/prayer-room',
          '/prayer-room/pray',
          '/prayer-room/library',
          '/prayer-room/videos',
          '/prayer-room/live',
          '/prayer-room/prayer-partners',
          '/prayer-room/give-thanks',
          '/prayer-room/intentions',
          '/prayer-room/chapel',
          '/prayer-room/notifications',
        ]) {
          safeRevalidatePath(path)
        }
      },
    ],
    beforeChange: [
      ({ data }) => {
        // Keep links absolute so bare domains typed by editors still work.
        data.meetingUrl = normalizeExternalUrl(data?.meetingUrl) ?? null
        data.contactHref = normalizeExternalUrl(data?.contactHref) ?? null
        return data
      },
    ],
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Hero',
          fields: [
            {
              name: 'eyebrow',
              type: 'text',
              label: 'Eyebrow',
              defaultValue: 'Spiritans Sound Outreach',
            },
            {
              name: 'title',
              type: 'text',
              label: 'Heading',
              required: true,
              defaultValue: 'Spiritans Sound Prayer Room',
            },
            {
              name: 'description',
              type: 'textarea',
              label: 'Intro Text',
              defaultValue:
                'A place to pray. A place to be prayed for. A community united in prayer.',
            },
            {
              name: 'heroQuote',
              type: 'textarea',
              label: 'Hero Quote',
              defaultValue:
                '“Whatever brought you here, you do not have to carry it alone. Leave your intention, pray for someone, or simply spend a moment with God.”',
            },
            {
              name: 'heroImage',
              type: 'upload',
              relationTo: 'media',
              label: 'Hero Image',
              admin: {
                description:
                  'Wide, calm photograph used behind the hero. Add alt text on the Media item.',
              },
            },
          ],
        },
        {
          label: 'Live & Schedule',
          description: 'The live room banner and copy above the weekly prayer schedule.',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'isLive',
                  type: 'checkbox',
                  label: 'A prayer session is live now',
                  defaultValue: false,
                  admin: {
                    description: 'Shows a live badge and makes the join button prominent.',
                  },
                },
                {
                  name: 'meetingPlatform',
                  type: 'select',
                  label: 'Live Platform',
                  defaultValue: 'zoom',
                  options: [
                    { label: 'Zoom', value: 'zoom' },
                    { label: 'Google Meet', value: 'google-meet' },
                    { label: 'YouTube', value: 'youtube' },
                    { label: 'In person', value: 'in-person' },
                    { label: 'Other', value: 'other' },
                  ],
                },
              ],
            },
            {
              name: 'meetingUrl',
              type: 'text',
              label: 'Live Room Link',
              admin: {
                placeholder: 'https://zoom.us/j/...',
                description: 'Used by the “Join the live room” button when the room is live.',
              },
            },
            {
              name: 'liveTitle',
              type: 'text',
              label: 'Live Banner Title',
              defaultValue: 'The room is open',
            },
            {
              name: 'liveDescription',
              type: 'textarea',
              label: 'Live Banner Description',
              defaultValue:
                'Come as you are. You can join with your camera off, and prayer requests can be shared in the chat.',
            },
            {
              name: 'liveNote',
              type: 'text',
              label: 'Small Note',
              admin: {
                placeholder: 'e.g. The room opens 10 minutes before we begin.',
              },
            },
            {
              name: 'scheduleEyebrow',
              type: 'text',
              label: 'Schedule Eyebrow',
              defaultValue: 'Gather with us',
            },
            {
              name: 'scheduleTitle',
              type: 'text',
              label: 'Schedule Heading',
              defaultValue: 'Weekly prayer rhythms',
            },
            {
              name: 'scheduleIntro',
              type: 'textarea',
              label: 'Schedule Intro',
              defaultValue:
                'Every room is hosted by a member of the prayer team. Come for one session or make one of them a weekly habit.',
            },
          ],
        },
        {
          label: 'Intentions',
          description: 'Copy for the prayer wall and the public prayer request form.',
          fields: [
            {
              name: 'showIntentions',
              type: 'checkbox',
              label: 'Show approved intentions publicly',
              defaultValue: true,
              admin: {
                description:
                  'Only requests marked “approved” and “may be shared” appear on the wall.',
              },
            },
            {
              name: 'intentionsEyebrow',
              type: 'text',
              label: 'Intentions Eyebrow',
              defaultValue: 'Stand with one another',
            },
            {
              name: 'intentionsTitle',
              type: 'text',
              label: 'Intentions Heading',
              defaultValue: 'Prayer intentions',
            },
            {
              name: 'intentionsIntro',
              type: 'textarea',
              label: 'Intentions Intro',
              defaultValue:
                'These are prayers left by people like you. Our team prays over every request we receive.',
            },
            {
              name: 'intentionsPrivacyNote',
              type: 'textarea',
              label: 'Privacy Note',
              defaultValue:
                'Contact details are never published. You can share anonymously, and you choose whether your intention may appear on this wall.',
            },
            {
              name: 'requestFormTitle',
              type: 'text',
              label: 'Form Heading',
              defaultValue: 'Submit a prayer request',
            },
            {
              name: 'requestFormIntro',
              type: 'textarea',
              label: 'Form Intro',
              defaultValue:
                'Tell us how we can pray with you. Nothing is too small, and you do not need to use your real name.',
            },
            {
              name: 'requestSuccessMessage',
              type: 'textarea',
              label: 'Success Message',
              defaultValue:
                'Thank you. Your intention has been received, and our prayer team will stand with you.',
            },
          ],
        },
        {
          label: 'Resources & Scripture',
          fields: [
            {
              name: 'resourcesEyebrow',
              type: 'text',
              label: 'Resources Eyebrow',
              defaultValue: 'Pray',
            },
            {
              name: 'resourcesTitle',
              type: 'text',
              label: 'Resources Heading',
              defaultValue: 'Prayers to carry with you',
            },
            {
              name: 'resourcesIntro',
              type: 'textarea',
              label: 'Resources Intro',
              defaultValue:
                'Short prayers and devotionals for the moments when you cannot find the words.',
            },
            {
              name: 'scriptureQuote',
              type: 'textarea',
              label: 'Scripture Quote',
              defaultValue:
                'Come to me, all you who are weary and burdened, and I will give you rest.',
            },
            {
              name: 'scriptureReference',
              type: 'text',
              label: 'Scripture Reference',
              defaultValue: 'Matthew 11:28',
            },
          ],
        },
        {
          label: 'FAQ',
          fields: [
            {
              name: 'faq',
              type: 'array',
              label: 'Frequently Asked Questions',
              labels: { singular: 'Question', plural: 'Questions' },
              fields: [
                {
                  name: 'question',
                  type: 'text',
                  required: true,
                  label: 'Question',
                },
                {
                  name: 'answer',
                  type: 'textarea',
                  required: true,
                  label: 'Answer',
                },
              ],
            },
          ],
        },
        {
          label: 'Contact & SEO',
          fields: [
            {
              name: 'contactLabel',
              type: 'text',
              label: 'Contact Link Label',
              defaultValue: 'Contact the prayer team',
            },
            {
              name: 'contactHref',
              type: 'text',
              label: 'Contact Link',
              admin: {
                placeholder: 'mailto:prayer@spiritanssound.com',
                description: 'An https URL or mailto: address. Leave blank to use the contact page.',
              },
            },
            {
              name: 'metaTitle',
              type: 'text',
              label: 'Meta Title',
              admin: { description: 'Optional. Defaults to the hero heading.' },
            },
            {
              name: 'metaDescription',
              type: 'textarea',
              label: 'Meta Description',
              admin: { description: 'Optional. Defaults to the hero intro text.' },
            },
          ],
        },
      ],
    },
  ],
}
