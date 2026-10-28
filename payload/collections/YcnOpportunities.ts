import { adminOrPublishingAdminField, authenticatedField } from '@/access/fieldAccess'
import { isAdmin, isAdminOrPublishingAdmin } from '@/access/roles'
import { sendYcnAdminNotification } from '@/lib/emails/ycn'
import type { CollectionAfterChangeHook, CollectionConfig } from 'payload'

const TALENT_CATEGORIES = [
  { label: 'Writer', value: 'writing' },
  { label: 'Musician', value: 'music' },
  { label: 'Visual Artist', value: 'visual-art' },
  { label: 'Photographer', value: 'photography' },
  { label: 'Dancer', value: 'dance' },
  { label: 'Digital Creator', value: 'digital' },
  { label: 'Technology & Innovation', value: 'technology' },
]

const OPPORTUNITY_TYPES = [
  { label: 'Internship', value: 'internship' },
  { label: 'Commission', value: 'commission' },
  { label: 'Performance', value: 'performance' },
  { label: 'Exhibition', value: 'exhibition' },
  { label: 'Scholarship', value: 'scholarship' },
  { label: 'Workshop', value: 'workshop' },
  { label: 'Other', value: 'other' },
]

const notifyAdmin: CollectionAfterChangeHook = async ({ doc, operation, req }) => {
  if (operation !== 'create') return doc

  await sendYcnAdminNotification({
    kind: 'opportunity',
    name: String(doc.contactName || 'Unknown contact'),
    email: String(doc.email || ''),
    reference: String(doc.id),
    summary: [
      `Organisation: ${doc.organisation || '—'}`,
      `Phone: ${doc.phone || '—'}`,
      `Type: ${doc.type || '—'}`,
      `Talents: ${Array.isArray(doc.categories) ? doc.categories.join(', ') : '—'}`,
      `Title: ${doc.title || '—'}`,
      `Location: ${doc.location || '—'}`,
      `Deadline: ${doc.deadline || '—'}`,
      '',
      String(doc.description || ''),
    ].join('\n'),
  }).catch((error) => req.payload.logger.error({ err: error, msg: 'YCN opportunity notification failed' }))

  return doc
}

export const YcnOpportunities: CollectionConfig = {
  slug: 'ycn-opportunities',
  labels: {
    singular: 'Opportunity Offer',
    plural: 'Opportunity Offers',
  },
  admin: {
    group: 'Young Creators',
    useAsTitle: 'title',
    defaultColumns: ['title', 'organisation', 'type', 'location', 'status', 'createdAt'],
    description: 'Offers are submitted through the public Offer an Opportunity form.',
    hidden: ({ user }) => user?.role !== 'admin' && user?.role !== 'publishing_admin',
  },
  access: {
    // Public submissions go through a validated server action using the Local API.
    // The REST endpoint stays private so bots cannot post directly to it.
    create: isAdminOrPublishingAdmin,
    read: isAdminOrPublishingAdmin,
    update: isAdminOrPublishingAdmin,
    delete: isAdmin,
  },
  hooks: {
    afterChange: [notifyAdmin],
  },
  fields: [
    {
      type: 'row',
      fields: [
        {
          name: 'contactName',
          type: 'text',
          required: true,
          maxLength: 100,
        },
        {
          name: 'organisation',
          type: 'text',
          required: true,
          maxLength: 120,
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'email',
          type: 'email',
          required: true,
        },
        {
          name: 'phone',
          type: 'text',
          maxLength: 30,
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'type',
          type: 'select',
          required: true,
          options: OPPORTUNITY_TYPES,
        },
        {
          name: 'title',
          type: 'text',
          required: true,
          maxLength: 120,
        },
      ],
    },
    {
      name: 'categories',
      type: 'select',
      hasMany: true,
      required: true,
      options: TALENT_CATEGORIES,
      label: 'Relevant Talents',
    },
    {
      name: 'description',
      type: 'textarea',
      required: true,
      minLength: 40,
      maxLength: 2000,
    },
    {
      type: 'row',
      fields: [
        {
          name: 'location',
          type: 'text',
          required: true,
          maxLength: 120,
        },
        {
          name: 'deadline',
          type: 'date',
          admin: {
            date: { pickerAppearance: 'dayOnly' },
          },
        },
      ],
    },
    {
      name: 'safeguardingConsent',
      type: 'checkbox',
      required: true,
      label: 'Safeguarding consent given',
      validate: (value: unknown) =>
        value === true ? true : 'Contact must confirm TUYDEF handles all creator contact.',
      access: {
        read: authenticatedField,
        create: adminOrPublishingAdminField,
        update: adminOrPublishingAdminField,
      },
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'pending-review',
      required: true,
      admin: {
        position: 'sidebar',
      },
      options: [
        { label: 'Pending review', value: 'pending-review' },
        { label: 'Reviewing', value: 'reviewing' },
        { label: 'Approved', value: 'approved' },
        { label: 'Declined', value: 'declined' },
        { label: 'Archived', value: 'archived' },
      ],
      access: {
        create: adminOrPublishingAdminField,
        update: adminOrPublishingAdminField,
      },
    },
    {
      name: 'internalNotes',
      type: 'textarea',
      label: 'Internal Notes',
      admin: {
        position: 'sidebar',
      },
      access: {
        read: adminOrPublishingAdminField,
        create: adminOrPublishingAdminField,
        update: adminOrPublishingAdminField,
      },
    },
  ],
}
