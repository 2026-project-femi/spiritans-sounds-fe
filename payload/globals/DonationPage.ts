import { GlobalConfig } from 'payload'

export const DonationPage: GlobalConfig = {
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
