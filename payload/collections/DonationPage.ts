import { CollectionConfig } from 'payload'

export const DonationPage: CollectionConfig = {
  slug: 'donationPage',
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
