import { CollectionConfig } from 'payload'

export const EmailCampaigns: CollectionConfig = {
  slug: 'emailCampaigns',
  admin: {
    useAsTitle: 'subject',
  },
  fields: [
    {
      name: 'subject',
      type: 'text',
      required: true,
    },
    {
      name: 'body',
      type: 'richText',
      required: true,
    },
    {
      name: 'status',
      type: 'select',
      options: [
        { label: 'Draft', value: 'draft' },
        { label: 'Sent', value: 'sent' },
      ],
      defaultValue: 'draft',
    },
    {
      name: 'sentAt',
      type: 'date',
      admin: {
        readOnly: true,
      },
    },
  ],
}
