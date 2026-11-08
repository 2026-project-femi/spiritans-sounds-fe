import type { Block } from 'payload'
import { imageLinkFields } from '@/payload/fields/imageLinkFields'

export const MediaBlock: Block = {
  slug: 'mediaBlock',
  interfaceName: 'MediaBlock',
  fields: [
    {
      name: 'media',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    ...imageLinkFields(),
  ],
}
