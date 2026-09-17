import { GlobalConfig } from 'payload'
import { isAdmin, isAdminOrPublishingAdmin } from '@/access/roles'

export const BookLaunchSettings: GlobalConfig = {
  slug: 'book-launch-settings',
  label: 'Book Launch Settings',
  access: {
    read: () => true, // Publicly readable by API routes and pages
    update: isAdminOrPublishingAdmin,
  },
  admin: {
    group: 'Funnels & Marketing',
    description: 'Configure online launch event meeting links (Zoom/Google Meet), date, time, and attendee email settings.',
  },
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
      name: 'meetingLink',
      type: 'text',
      label: 'Online Meeting / Stream URL',
      admin: {
        placeholder: 'https://zoom.us/j/123456789 or https://meet.google.com/...',
        description: 'Direct meeting link provided to registered attendees. If left blank, emails will inform attendees that the link is being finalized.',
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
      name: 'meetingPasscode',
      type: 'text',
      label: 'Meeting Passcode / Access PIN (Optional)',
      admin: {
        description: 'Passcode or meeting ID required to join the stream.',
      },
    },
    {
      name: 'eventDate',
      type: 'text',
      label: 'Event Date & Time (Display String)',
      defaultValue: 'Saturday, 21 November 2026 at 5:00 PM (WAT) / 4:00 PM (GMT)',
      admin: {
        description: 'Human-friendly date and time included in confirmation emails.',
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
}
