import { authenticated } from '@/access/authenticated'
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

const notifyAdmin: CollectionAfterChangeHook = async ({ doc, operation, req }) => {
  if (operation !== 'create') return doc

  await sendYcnAdminNotification({
    kind: 'mentor',
    name: String(doc.fullName || 'Unknown applicant'),
    email: String(doc.email || ''),
    reference: String(doc.id),
    summary: [
      `Organisation: ${doc.organisation || '—'}`,
      `Phone: ${doc.phone || '—'}`,
      `Expertise: ${Array.isArray(doc.expertise) ? doc.expertise.join(', ') : '—'}`,
      `Availability: ${doc.availability || '—'} (${doc.format || '—'})`,
      '',
      String(doc.experience || ''),
    ].join('\n'),
  }).catch((error) => req.payload.logger.error({ err: error, msg: 'YCN mentor notification failed' }))

  return doc
}

export const YcnMentorApplications: CollectionConfig = {
  slug: 'ycn-mentor-applications',
  labels: {
    singular: 'Mentor Application',
    plural: 'Mentor Applications',
  },
  admin: {
    group: 'Young Creators',
    useAsTitle: 'fullName',
    defaultColumns: ['fullName', 'email', 'availability', 'status', 'createdAt'],
    description: 'Applications are submitted through the public Become a Mentor form.',
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
      name: 'fullName',
      type: 'text',
      required: true,
      maxLength: 100,
    },
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
    {
      name: 'organisation',
      type: 'text',
      maxLength: 120,
    },
    {
      name: 'expertise',
      type: 'select',
      hasMany: true,
      required: true,
      options: TALENT_CATEGORIES,
      label: 'Areas you can mentor in',
    },
    {
      name: 'experience',
      type: 'textarea',
      required: true,
      minLength: 30,
      maxLength: 1500,
    },
    {
      type: 'row',
      fields: [
        {
          name: 'availability',
          type: 'select',
          required: true,
          defaultValue: 'monthly',
          options: [
            { label: 'Weekly', value: 'weekly' },
            { label: 'Fortnightly', value: 'fortnightly' },
            { label: 'Monthly', value: 'monthly' },
            { label: 'Per project', value: 'project' },
          ],
        },
        {
          name: 'format',
          type: 'select',
          required: true,
          defaultValue: 'either',
          options: [
            { label: 'In person', value: 'in-person' },
            { label: 'Online', value: 'online' },
            { label: 'Either', value: 'either' },
          ],
        },
      ],
    },
    {
      name: 'safeguardingConsent',
      type: 'checkbox',
      required: true,
      label: 'Safeguarding consent given',
      validate: (value: unknown) =>
        value === true ? true : 'Applicant must agree to safeguarding checks.',
      access: {
        read: authenticated,
        create: isAdminOrPublishingAdmin,
        update: isAdminOrPublishingAdmin,
      },
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'new',
      required: true,
      admin: {
        position: 'sidebar',
      },
      options: [
        { label: 'New', value: 'new' },
        { label: 'Reviewing', value: 'reviewing' },
        { label: 'Approved', value: 'approved' },
        { label: 'Declined', value: 'declined' },
      ],
      access: {
        create: isAdminOrPublishingAdmin,
        update: isAdminOrPublishingAdmin,
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
        read: isAdminOrPublishingAdmin,
        create: isAdminOrPublishingAdmin,
        update: isAdminOrPublishingAdmin,
      },
    },
  ],
}
