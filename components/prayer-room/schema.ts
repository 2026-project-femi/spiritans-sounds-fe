import { z } from 'zod'

export const PRAYER_CATEGORIES = [
  { value: 'family', label: 'Family' },
  { value: 'healing', label: 'Healing' },
  { value: 'marriage', label: 'Marriage' },
  { value: 'children', label: 'Children' },
  { value: 'work', label: 'Work' },
  { value: 'exams', label: 'Exams' },
  { value: 'discernment', label: 'Discernment' },
  { value: 'bereavement', label: 'Bereavement' },
  { value: 'peace', label: 'Peace' },
  { value: 'forgiveness', label: 'Forgiveness' },
  { value: 'protection', label: 'Protection' },
  { value: 'spiritual-growth', label: 'Spiritual Growth' },
  { value: 'difficult-situations', label: 'Difficult Situations' },
  { value: 'thanksgiving', label: 'Thanksgiving' },
  { value: 'general-intention', label: 'General Intention' },
] as const

export const PRAYER_PRIVACY = [
  {
    value: 'public',
    title: 'Public Prayer Board',
    description: 'Once approved, your intention can appear in the Prayer Room.',
  },
  {
    value: 'partners',
    title: 'Prayer Partners Only',
    description: 'Only approved Prayer Partners and administrators can see it.',
  },
  {
    value: 'private',
    title: 'Private',
    description: 'Only administrators and your assigned Prayer Partner can see it.',
  },
] as const

export const BOARD_FILTERS: { label: string; match: string[] }[] = [
  { label: 'All', match: [] },
  { label: 'Family', match: ['family', 'children'] },
  { label: 'Healing', match: ['healing'] },
  { label: 'Relationships', match: ['marriage', 'forgiveness', 'peace'] },
  { label: 'Work', match: ['work', 'exams'] },
  { label: 'Bereavement', match: ['bereavement', 'grief'] },
  { label: 'Spiritual Growth', match: ['spiritual-growth', 'discernment'] },
  { label: 'Thanksgiving', match: ['thanksgiving'] },
]

export const prayerCategoryLabel = (value: string): string =>
  PRAYER_CATEGORIES.find((category) => category.value === value)?.label ?? 'Prayer'

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const optionalEmail = z
  .string()
  .trim()
  .max(254)
  .refine((value) => !value || emailPattern.test(value), 'Enter a valid email address')
  .optional()
  .default('')

export const prayerRequestSchema = z.object({
  intention: z
    .string()
    .trim()
    .min(5, 'Please share a little more with us.')
    .max(1000, 'Please keep your intention under 1,000 characters.'),
  category: z.string().trim().min(1),
  privacy: z.enum(['public', 'partners', 'private']),
  isAnonymous: z.boolean().optional().default(true),
  name: z.string().trim().max(60).optional().default(''),
  email: optionalEmail,
  // Honeypot: real users never see or fill this field.
  website: z.string().max(0).optional().default(''),
})

export type PrayerRequestInput = z.infer<typeof prayerRequestSchema>

export type PrayerRequestResult =
  | { ok: true; message: string }
  | { ok: false; error: string }

export const testimonySchema = z.object({
  name: z.string().trim().max(80).optional().default(''),
  text: z.string().trim().min(5, 'Please share a little more.').max(1500),
  relatedIntention: z.string().trim().max(200).optional().default(''),
  consentToPublish: z.literal(true, {
    message: 'Please give permission for this to be published after review.',
  }),
  website: z.string().max(0).optional().default(''),
})

export type TestimonyInput = z.infer<typeof testimonySchema>

export type TestimonyResult = { ok: true } | { ok: false; error: string }

export const partnerRequestSchema = z.object({
  kind: z.literal('request'),
  name: z.string().trim().min(1, 'Please enter your name.').max(100),
  email: z.string().trim().max(254).refine((value) => emailPattern.test(value), 'Enter a valid email address'),
  category: z.string().trim().min(1),
  message: z.string().trim().min(5, 'Please share a little more.').max(1200),
  supportType: z.enum(['one-time', 'ongoing']),
  duration: z.enum(['1-week', '2-weeks', '1-month', 'ongoing']),
  privacy: z.enum(['first-name', 'anonymous']),
  receiveMessages: z.boolean().optional().default(false),
  website: z.string().max(0).optional().default(''),
})

export const partnerApplicationSchema = z.object({
  kind: z.literal('application'),
  name: z.string().trim().min(1, 'Please enter your full name.').max(100),
  email: z.string().trim().max(254).refine((value) => emailPattern.test(value), 'Enter a valid email address'),
  location: z.string().trim().min(1, 'Please enter your country or location.').max(120),
  areas: z.array(z.string()).min(1, 'Choose at least one prayer area.'),
  availability: z.enum(['mornings', 'evenings', 'weekends', 'flexible']),
  frequency: z.enum(['daily', 'few-times-week', 'weekly']),
  message: z.string().trim().min(5, 'Please share a little more.').max(600),
  confidentialityAgreed: z.literal(true, { message: 'Please confirm confidentiality.' }),
  safeguardingAgreed: z.literal(true, {
    message: 'Please agree to the guidelines and safeguarding requirements.',
  }),
  website: z.string().max(0).optional().default(''),
})

export type PartnerRequestInput = z.infer<typeof partnerRequestSchema>
export type PartnerApplicationInput = z.infer<typeof partnerApplicationSchema>
export type PartnerFormInput = PartnerRequestInput | PartnerApplicationInput

export type PartnerResult = { ok: true } | { ok: false; error: string }
