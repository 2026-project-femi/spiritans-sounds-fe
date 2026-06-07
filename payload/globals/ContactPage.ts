import { GlobalConfig } from 'payload'

export const ContactPage: GlobalConfig = {
  slug: 'contactPage',
  fields: [
    {
      name: 'address',
      type: 'textarea',
    },
    {
      name: 'email',
      type: 'email',
    },
    {
      name: 'phone',
      type: 'text',
    },
    {
      name: 'socialLinks',
      type: 'array',
      fields: [
        {
          name: 'platform',
          type: 'text',
        },
        {
          name: 'url',
          type: 'text',
        },
      ],
    },
  ],
}
