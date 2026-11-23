'use client'

import { useState, type FormEvent } from 'react'
import { submitTestimonyAction } from './actions'
import { testimonySchema } from './schema'

const inputCls =
  'w-full rounded-lg border border-[#e6ddcb] bg-[#fffdf8] px-3.5 py-2.5 text-base text-[#2b211a] outline-none transition focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20'

export function TestimonyForm() {
  const [name, setName] = useState('')
  const [text, setText] = useState('')
  const [related, setRelated] = useState('')
  const [consent, setConsent] = useState(false)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const [done, setDone] = useState(false)

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    const parsed = testimonySchema.safeParse({
      name,
      text,
      relatedIntention: related,
      consentToPublish: consent,
      website: '',
    })
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? 'Please check the form.')
      return
    }

    setBusy(true)
    try {
      const result = await submitTestimonyAction(parsed.data)
      if (result.ok) {
        setDone(true)
      } else {
        setError(result.error)
      }
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setBusy(false)
    }
  }

  if (done) {
    return (
      <div className="rounded-2xl border border-[#e6ddcb] bg-[#fffdf8] p-8 text-center shadow-sm">
        <p className="text-3xl">🕊️</p>
        <h2 className="mt-2 text-3xl font-semibold">Thank you for sharing</h2>
        <p className="mt-3 text-[#6b5f52]">Your thanksgiving will be reviewed before it is shared.</p>
      </div>
    )
  }

  return (
    <form onSubmit={submit} className="grid h-fit gap-4 rounded-2xl border border-[#e6ddcb] bg-[#fffdf8] p-6 shadow-sm">
      <label className="grid gap-1.5 text-sm">
        <span className="font-medium">Name (leave blank to remain anonymous)</span>
        <input className={inputCls} value={name} maxLength={80} onChange={(event) => setName(event.target.value)} />
      </label>
      <label className="grid gap-1.5 text-sm">
        <span className="font-medium">Your thanksgiving or testimony</span>
        <textarea rows={6} className={inputCls} value={text} maxLength={1500} onChange={(event) => setText(event.target.value)} />
      </label>
      <label className="grid gap-1.5 text-sm">
        <span className="font-medium">Related prayer intention (optional)</span>
        <input className={inputCls} maxLength={200} value={related} onChange={(event) => setRelated(event.target.value)} />
      </label>
      <label className="flex gap-2 text-sm">
        <input type="checkbox" className="mt-0.5 accent-brand-primary" checked={consent} onChange={(event) => setConsent(event.target.checked)} />
        I give permission for this to be published after review.
      </label>
      {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
      <button
        type="submit"
        disabled={busy || !consent || text.trim().length < 5}
        className="rounded-full bg-brand-primary px-6 py-3 text-sm font-medium text-brand-primary-foreground transition hover:bg-brand-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {busy ? 'Sharing…' : 'Share thanksgiving'}
      </button>
    </form>
  )
}
