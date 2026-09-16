import { anyone } from '@/access/anyone'
import { isAdmin, isAdminOrPublishingAdmin } from '@/access/roles'
import { CollectionConfig } from 'payload'

export const BookLaunchRegistrations: CollectionConfig = {
  slug: 'book-launch-registrations',
  labels: {
    singular: 'Book Launch Registration',
    plural: 'Book Launch Registrations',
  },
  admin: {
    useAsTitle: 'fullName',
    defaultColumns: ['fullName', 'email', 'whatsapp', 'country', 'book', 'createdAt'],
    group: 'Funnels & Marketing',
  },
  access: {
    read: isAdminOrPublishingAdmin,
    update: isAdminOrPublishingAdmin,
    delete: isAdmin,
    create: anyone,
  },
  fields: [
    {
      name: 'fullName',
      type: 'text',
      label: 'Full Name',
      required: true,
      index: true,
    },
    {
      name: 'email',
      type: 'email',
      label: 'Email Address',
      required: true,
      index: true,
    },
    {
      name: 'whatsapp',
      type: 'text',
      label: 'WhatsApp Number',
    },
    {
      name: 'country',
      type: 'text',
      label: 'Country / Location',
    },
    {
      name: 'book',
      type: 'text',
      label: 'Book Title',
      required: true,
      defaultValue: 'Behind the Veil',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'bookSlug',
      type: 'text',
      label: 'Book Slug',
      required: true,
      defaultValue: 'behind-the-veil',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'source',
      type: 'text',
      label: 'Registration Source',
      defaultValue: 'landing-page',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'reminderSent',
      type: 'checkbox',
      label: 'Reminder Email Sent',
      defaultValue: false,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'attended',
      type: 'checkbox',
      label: 'Attended Launch Event',
      defaultValue: false,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'notes',
      type: 'textarea',
      label: 'Admin Notes',
      admin: {
        position: 'sidebar',
      },
    },
  ],
  timestamps: true,
}
