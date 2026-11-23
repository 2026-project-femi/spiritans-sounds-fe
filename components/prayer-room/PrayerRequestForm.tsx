'use client'

import { useState, type FormEvent } from 'react'
import Link from 'next/link'
import { CheckCircle2, Loader2 } from 'lucide-react'
import { submitPrayerRequestAction } from './actions'
import {
  PRAYER_CATEGORIES,
  PRAYER_PRIVACY,
  prayerRequestSchema,
  type PrayerRequestInput,
  type PrayerRequestResult,
} from './schema'

interface Props {
  successMessage: string
  onSubmit?: (input: PrayerRequestInput) => Promise<PrayerRequestResult>
}

type Draft = {
  intention: string
  category: string
  privacy: 'public' | 'partners' | 'private'
  isAnonymous: boolean
  name: string
  email: string
  website: string
}

const EMPTY: Draft = {
  intention: '',
  category: 'general-intention',
  privacy: 'public',
  isAnonymous: true,
  name: '',
  email: '',
  website: '',
}

const inputCls =
  'w-full rounded-lg border border-[#e6ddcb] bg-[#fffdf8] px-3.5 py-2.5 text-base text-[#2b211a] outline-none transition focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20'

export function PrayerRequestForm({ successMessage, onSubmit = submitPrayerRequestAction }: Props) {
  const [draft, setDraft] = useState<Draft>(EMPTY)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const [done, setDone] = useState(false)

  const set = <K extends keyof Draft>(key: K, value: Draft[K]) =>
    setDraft((previous) => ({ ...previous, [key]: value }))

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')

    const parsed = prayerRequestSchema.safeParse(draft)
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? 'Please check the form.')
      return
    }

    setBusy(true)
    try {
      const result = await onSubmit(parsed.data)
      if (result.ok) setDone(true)
      else setError(result.error)
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setBusy(false)
    }
  }

  if (done) {
    return (
      <div className="rounded-2xl border border-[#e6ddcb] bg-[#fffdf8] p-8 text-center shadow-[0_10px_40px_-18px_rgba(43,33,26,0.25)]">
        <CheckCircle2 className="mx-auto size-10 text-brand-primary" />
        <h2 className="mt-3 text-3xl font-semibold">Your intention has been received</h2>
        <p className="mt-3 text-[#6b5f52]">
          {successMessage || 'It will be reviewed with care. The community is with you in prayer.'}
        </p>
        <div className="mt-6 flex justify-center gap-4 text-sm">
          <Link href="/prayer-room/pray" className="text-brand-primary">
            Pray for someone →
          </Link>
          <Link href="/prayer-room/chapel" className="text-[#6b5f52]">
            Visit the chapel
          </Link>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={submit} className="grid gap-5 rounded-2xl border border-[#e6ddcb] bg-[#fffdf8] p-6 shadow-[0_10px_40px_-18px_rgba(43,33,26,0.25)]">
      <label className="grid gap-1.5 text-sm">
        <span className="font-medium">Your prayer intention</span>
        <textarea
          rows={5}
          required
          maxLength={1000}
          className={inputCls}
          value={draft.intention}
          placeholder="Lord, I bring before you…"
          onChange={(event) => set('intention', event.target.value)}
        />
        <span className="text-right text-xs text-[#8a7b68]">{draft.intention.length}/1000</span>
      </label>

      <label className="grid gap-1.5 text-sm">
        <span className="font-medium">Category</span>
        <select
          className={inputCls}
          value={draft.category}
          onChange={(event) => set('category', event.target.value)}
        >
          {PRAYER_CATEGORIES.map((category) => (
            <option key={category.value} value={category.value}>
              {category.label}
            </option>
          ))}
        </select>
      </label>

      <fieldset className="grid gap-2">
        <legend className="mb-1.5 text-sm font-medium">Who can see this?</legend>
        {PRAYER_PRIVACY.map((privacy) => (
          <label
            key={privacy.value}
            className={`flex cursor-pointer gap-3 rounded-xl border p-3.5 text-sm transition ${
              draft.privacy === privacy.value
                ? 'border-brand-primary bg-[#f7e6e0]'
                : 'border-[#e6ddcb]'
            }`}
          >
            <input
              type="radio"
              name="privacy"
              className="mt-1 accent-brand-primary"
              checked={draft.privacy === privacy.value}
              onChange={() => set('privacy', privacy.value)}
            />
            <span>
              <span className="block font-medium">{privacy.title}</span>
              <span className="text-[#6b5f52]">{privacy.description}</span>
            </span>
          </label>
        ))}
      </fieldset>

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          className="accent-brand-primary"
          checked={draft.isAnonymous}
          onChange={(event) => set('isAnonymous', event.target.checked)}
        />
        Remain anonymous
      </label>

      {!draft.isAnonymous && (
        <label className="grid gap-1.5 text-sm">
          <span className="font-medium">Name to display</span>
          <input
            className={inputCls}
            maxLength={60}
            value={draft.name}
            onChange={(event) => set('name', event.target.value)}
          />
        </label>
      )}

      <label className="grid gap-1.5 text-sm">
        <span className="font-medium">Email for updates (optional)</span>
        <span className="text-xs text-[#6b5f52]">
          Never shown publicly. Prayer updates appear in Notifications.
        </span>
        <input
          type="email"
          className={inputCls}
          value={draft.email}
          onChange={(event) => set('email', event.target.value)}
        />
      </label>

      <div className="hidden" aria-hidden="true">
        <label htmlFor="prayer-website">Website</label>
        <input
          id="prayer-website"
          tabIndex={-1}
          autoComplete="off"
          value={draft.website}
          onChange={(event) => set('website', event.target.value)}
        />
      </div>

      {error && (
        <p role="alert" className="rounded-lg border border-red-200 bg-red-50 px-3.5 py-2.5 text-sm text-red-700">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={busy}
        className="inline-flex items-center justify-center gap-2 rounded-full bg-brand-primary px-6 py-3 text-sm font-medium text-brand-primary-foreground transition hover:bg-brand-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {busy && <Loader2 className="size-4 animate-spin" />}
        {busy ? 'Receiving your intention…' : 'Offer this intention'}
      </button>
    </form>
  )
}
