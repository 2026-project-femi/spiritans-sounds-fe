import { GlobalConfig } from 'payload'
import { isAdmin, isAdminOrPublishingAdmin } from '@/access/roles'

export const CommissionSettings: GlobalConfig = {
  slug: 'commission-settings',
  access: {
    read: isAdminOrPublishingAdmin,
    update: isAdmin,
  },
  fields: [
    {
      name: 'standardCommissionRate',
      type: 'number',
      required: true,
      defaultValue: 15,
      admin: {
        description: 'The standard commission rate percentage (e.g., 15 for 15%).',
      },
    },
    {
      name: 'minimumPayoutThreshold',
      type: 'number',
      required: true,
      defaultValue: 10000,
      admin: {
        description: 'The minimum amount an author must earn before a payout can be processed.',
      },
    },
  ],
}
