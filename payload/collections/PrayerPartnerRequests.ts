import { isAdmin, isAdminOrEditor } from '@/access/roles'
import { safeRevalidatePath } from '@/lib/revalidate'
import type { CollectionAfterChangeHook, CollectionConfig } from 'payload'

const PRAYER_AREAS = [
  { label: 'Family', value: 'family' },
  { label: 'Healing', value: 'healing' },
  { label: 'Marriage', value: 'marriage' },
  { label: 'Children', value: 'children' },
  { label: 'Work', value: 'work' },
  { label: 'Exams', value: 'exams' },
  { label: 'Discernment', value: 'discernment' },
  { label: 'Bereavement', value: 'bereavement' },
  { label: 'Peace', value: 'peace' },
  { label: 'Forgiveness', value: 'forgiveness' },
  { label: 'Protection', value: 'protection' },
  { label: 'Spiritual Growth', value: 'spiritual-growth' },
  { label: 'Difficult Situations', value: 'difficult-situations' },
  { label: 'Thanksgiving', value: 'thanksgiving' },
  { label: 'General Intention', value: 'general-intention' },
]

const revalidatePartners: CollectionAfterChangeHook = ({ doc }) => {
  safeRevalidatePath('/prayer-room/prayer-partners')
  return doc
}

export const PrayerPartnerRequests: CollectionConfig = {
  slug: 'prayer-partner-requests',
  labels: { singular: 'Prayer Partner Request', plural: 'Prayer Partner Requests' },
  admin: {
    group: 'Prayer Room',
    useAsTitle: 'name',
    defaultColumns: ['kind', 'name', 'email', 'category', 'status', 'createdAt'],
    description:
      'Requests for a Prayer Partner and applications to become one. Contact details are private.',
    hidden: ({ user }) => user?.role !== 'admin' && user?.role !== 'editor',
  },
  access: {
    read: isAdminOrEditor,
    // Public submissions go through validated server actions using the Local API.
    create: isAdminOrEditor,
    update: isAdminOrEditor,
    delete: isAdmin,
  },
  hooks: { afterChange: [revalidatePartners] },
  fields: [
    {
      name: 'kind',
      type: 'select',
      required: true,
      defaultValue: 'request',
      options: [
        { label: 'Request a Prayer Partner', value: 'request' },
        { label: 'Application to become a Prayer Partner', value: 'application' },
      ],
      admin: { position: 'sidebar' },
    },
    { name: 'name', type: 'text', required: true, maxLength: 100 },
    { name: 'email', type: 'email', required: true },
    { name: 'phone', type: 'text', maxLength: 40 },
    { name: 'location', type: 'text', label: 'Country / location', maxLength: 120 },
    { name: 'category', type: 'select', label: 'Prayer category', options: PRAYER_AREAS },
    { name: 'message', type: 'textarea', label: 'What would you like prayer for?', maxLength: 1200 },
    {
      name: 'areas',
      type: 'select',
      hasMany: true,
      label: 'Preferred prayer areas',
      options: PRAYER_AREAS,
    },
    {
      name: 'supportType',
      type: 'select',
      label: 'Type of support',
      options: [
        { label: 'One-time prayer', value: 'one-time' },
        { label: 'Ongoing prayer support', value: 'ongoing' },
      ],
    },
    {
      name: 'duration',
      type: 'select',
      options: [
        { label: '1 week', value: '1-week' },
        { label: '2 weeks', value: '2-weeks' },
        { label: '1 month', value: '1-month' },
        { label: 'Ongoing', value: 'ongoing' },
      ],
    },
    {
      name: 'availability',
      type: 'select',
      options: [
        { label: 'Mornings', value: 'mornings' },
        { label: 'Evenings', value: 'evenings' },
        { label: 'Weekends', value: 'weekends' },
        { label: 'Flexible', value: 'flexible' },
      ],
    },
    {
      name: 'frequency',
      type: 'select',
      label: 'How often can you take intentions?',
      options: [
        { label: 'Daily', value: 'daily' },
        { label: 'A few times a week', value: 'few-times-week' },
        { label: 'Weekly', value: 'weekly' },
      ],
    },
    {
      name: 'privacy',
      type: 'select',
      label: 'Privacy with the Prayer Partner',
      options: [
        { label: 'Show my first name', value: 'first-name' },
        { label: 'Remain anonymous', value: 'anonymous' },
      ],
    },
    {
      name: 'receiveMessages',
      type: 'checkbox',
      label: 'Happy to receive prayer messages through the Prayer Room',
      defaultValue: false,
    },
    {
      name: 'confidentialityAgreed',
      type: 'checkbox',
      label: 'Agrees to keep intentions confidential',
      defaultValue: false,
    },
    {
      name: 'safeguardingAgreed',
      type: 'checkbox',
      label: 'Agrees to Prayer Room guidelines and safeguarding requirements',
      defaultValue: false,
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'new',
      options: [
        { label: 'New', value: 'new' },
        { label: 'In review', value: 'review' },
        { label: 'Matched / active', value: 'active' },
        { label: 'Declined / paused', value: 'declined' },
      ],
      admin: { position: 'sidebar' },
    },
    { name: 'adminNotes', type: 'textarea', admin: { position: 'sidebar' } },
  ],
}
