'use client'

import { useState, type FormEvent } from 'react'
import { submitPartnerFormAction } from './actions'
import { PRAYER_CATEGORIES, partnerRequestSchema } from './schema'

const inputCls =
  'w-full rounded-lg border border-[#e6ddcb] bg-[#fffdf8] px-3.5 py-2.5 text-base text-[#2b211a] outline-none transition focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20'

export function PartnerRequestForm() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [category, setCategory] = useState('general-intention')
  const [message, setMessage] = useState('')
  const [supportType, setSupportType] = useState<'one-time' | 'ongoing'>('one-time')
  const [duration, setDuration] = useState<'1-week' | '2-weeks' | '1-month' | 'ongoing'>('1-month')
  const [privacy, setPrivacy] = useState<'first-name' | 'anonymous'>('first-name')
  const [receiveMessages, setReceiveMessages] = useState(true)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const [done, setDone] = useState(false)

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    const parsed = partnerRequestSchema.safeParse({
      kind: 'request',
      name,
      email,
      category,
      message,
      supportType,
      duration,
      privacy,
      receiveMessages,
      website: '',
    })
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? 'Please check the form.')
      return
    }

    setBusy(true)
    try {
      const result = await submitPartnerFormAction(parsed.data)
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
      <div className="rounded-2xl border border-[#e6ddcb] bg-[#fffdf8] p-8 text-center shadow-sm">
        <p className="text-3xl">🕊️</p>
        <h2 className="mt-2 text-3xl font-semibold">Your request has been received</h2>
        <p className="mt-3 text-[#6b5f52]">
          An administrator will prayerfully match you with an approved Prayer Partner. Your
          contact details are never shared with them.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={submit} className="grid gap-4 rounded-2xl border border-[#e6ddcb] bg-[#fffdf8] p-6 shadow-sm">
      <label className="grid gap-1.5 text-sm">
        <span className="font-medium">Name</span>
        <input className={inputCls} required maxLength={100} value={name} onChange={(event) => setName(event.target.value)} />
      </label>
      <label className="grid gap-1.5 text-sm">
        <span className="font-medium">Email</span>
        <span className="text-xs text-[#6b5f52]">Kept private — only administrators can see it.</span>
        <input type="email" className={inputCls} required maxLength={254} value={email} onChange={(event) => setEmail(event.target.value)} />
      </label>
      <label className="grid gap-1.5 text-sm">
        <span className="font-medium">Prayer category</span>
        <select className={inputCls} value={category} onChange={(event) => setCategory(event.target.value)}>
          {PRAYER_CATEGORIES.map((item) => (
            <option key={item.value} value={item.value}>{item.label}</option>
          ))}
        </select>
      </label>
      <label className="grid gap-1.5 text-sm">
        <span className="font-medium">Briefly, what would you like prayer for?</span>
        <textarea rows={4} className={inputCls} required maxLength={1200} value={message} onChange={(event) => setMessage(event.target.value)} />
      </label>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-1.5 text-sm">
          <span className="font-medium">Type of support</span>
          <select className={inputCls} value={supportType} onChange={(event) => setSupportType(event.target.value as typeof supportType)}>
            <option value="one-time">One-time prayer</option>
            <option value="ongoing">Ongoing prayer support</option>
          </select>
        </label>
        <label className="grid gap-1.5 text-sm">
          <span className="font-medium">Preferred duration</span>
          <select className={inputCls} value={duration} onChange={(event) => setDuration(event.target.value as typeof duration)}>
            <option value="1-week">1 week</option>
            <option value="2-weeks">2 weeks</option>
            <option value="1-month">1 month</option>
            <option value="ongoing">Ongoing</option>
          </select>
        </label>
      </div>
      <label className="grid gap-1.5 text-sm">
        <span className="font-medium">Privacy</span>
        <select className={inputCls} value={privacy} onChange={(event) => setPrivacy(event.target.value as typeof privacy)}>
          <option value="first-name">Show my first name to my Prayer Partner</option>
          <option value="anonymous">Remain anonymous to my Prayer Partner</option>
        </select>
      </label>
      <label className="flex gap-2 text-sm">
        <input type="checkbox" className="mt-0.5 accent-brand-primary" checked={receiveMessages} onChange={(event) => setReceiveMessages(event.target.checked)} />
        I am comfortable receiving prayer messages through the Prayer Room.
      </label>
      {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
      <button type="submit" disabled={busy} className="rounded-full bg-brand-primary px-6 py-3 text-sm font-medium text-brand-primary-foreground transition hover:bg-brand-primary/90 disabled:opacity-60">
        {busy ? 'Sending…' : 'Request a Prayer Partner'}
      </button>
    </form>
  )
}
