import { isAdminOrEditor } from '@/access/roles';
import { revalidatePath } from 'next/cache';
import { CollectionConfig } from 'payload'

export const Radio: CollectionConfig = {
  slug: 'radio',
  admin: {
    hidden: ({user})=>user.role === 'contributor' 

  },
  access: {
    read: isAdminOrEditor,
    update: isAdminOrEditor,
    delete: isAdminOrEditor,
    create: isAdminOrEditor,
    
  },
  hooks: {
    afterChange: [({doc})=>{
      revalidatePath('/unveiler/radio');
      return doc;
    }]
  },
  fields: [
    {
      name: 'tagline',
      type: 'text',
      label: 'Radio Tagline',
      defaultValue: 'Voices of Faith, Hope, and Mission.',
    },
    {
      name: 'streamUrl',
      type: 'text',
      label: 'Stream URL',
    },
    {
      name: 'currentProgram',
      type: 'text',
      label: 'Current Program',
    },
    {
      name: 'schedule',
      type: 'array',
      label: 'Program Schedule',
      fields: [
        {
          name: 'program',
          type: 'text',
          label: 'Program Title',
          required: true,
        },
        {
          name: 'host',
          type: 'text',
          label: 'Host / Presenter / Team',
        },
        {
          name: 'time',
          type: 'text',
          label: 'Start Time (e.g. 6:00 AM)',
        },
        {
          name: 'endTime',
          type: 'text',
          label: 'End Time (e.g. 6:30 AM)',
        },
        {
          name: 'day',
          type: 'text',
          label: 'Day of the Week',
          admin: {
            description: 'Leave blank if this is a daily program. E.g., Monday, Tuesday.',
          },
        },
        {
          name: 'type',
          type: 'select',
          label: 'Program Type',
          options: [
            { label: 'Prayer', value: 'prayer' },
            { label: 'Music', value: 'music' },
            { label: 'Talk', value: 'talk' },
            { label: 'Youth', value: 'youth' },
            { label: 'Reflection', value: 'reflection' },
            { label: 'Homily', value: 'homily' },
          ],
        },
        {
          name: 'audio',
          type: 'upload',
          label: 'Pre-recorded Audio File',
          relationTo: 'media',
        },
      ],
    },
  ],
}