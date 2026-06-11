import { CollectionConfig } from 'payload'

export const DonationPage: CollectionConfig = {
  slug: 'donationPage',
  admin: {hidden: true},
  fields: [
    {
      name: 'message',
      type: 'textarea',
    },
    {
      name: 'bankDetails',
      type: 'textarea',
    },
    {
      name: 'paymentLink',
      type: 'text',
    },
  ],
}
