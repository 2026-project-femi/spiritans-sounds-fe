'use client'

import { useState, type FormEvent } from 'react'
import { submitPartnerFormAction } from './actions'
import { PRAYER_CATEGORIES, partnerApplicationSchema } from './schema'

const inputCls =
  'w-full rounded-lg border border-[#e6ddcb] bg-[#fffdf8] px-3.5 py-2.5 text-base text-[#2b211a] outline-none transition focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20'

export function PartnerApplicationForm() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [location, setLocation] = useState('')
  const [areas, setAreas] = useState<string[]>([])
  const [availability, setAvailability] = useState<'mornings' | 'evenings' | 'weekends' | 'flexible'>('flexible')
  const [frequency, setFrequency] = useState<'daily' | 'few-times-week' | 'weekly'>('weekly')
  const [message, setMessage] = useState('')
  const [confidentiality, setConfidentiality] = useState(false)
  const [safeguarding, setSafeguarding] = useState(false)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const [done, setDone] = useState(false)

  const toggleArea = (value: string) =>
    setAreas((current) =>
      current.includes(value) ? current.filter((area) => area !== value) : [...current, value],
    )

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    const parsed = partnerApplicationSchema.safeParse({
      kind: 'application',
      name,
      email,
      location,
      areas,
      availability,
      frequency,
      message,
      confidentialityAgreed: confidentiality,
      safeguardingAgreed: safeguarding,
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
        <h2 className="mt-2 text-3xl font-semibold">Application received</h2>
        <p className="mt-3 text-[#6b5f52]">
          Thank you for your generosity. The Prayer Room team will review your application and be
          in touch.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={submit} className="grid gap-4 rounded-2xl border border-[#e6ddcb] bg-[#fffdf8] p-6 shadow-sm">
      <label className="grid gap-1.5 text-sm">
        <span className="font-medium">Full name</span>
        <input className={inputCls} required maxLength={100} value={name} onChange={(event) => setName(event.target.value)} />
      </label>
      <label className="grid gap-1.5 text-sm">
        <span className="font-medium">Email</span>
        <input type="email" className={inputCls} required maxLength={254} value={email} onChange={(event) => setEmail(event.target.value)} />
      </label>
      <label className="grid gap-1.5 text-sm">
        <span className="font-medium">Country / location</span>
        <input className={inputCls} required maxLength={120} value={location} onChange={(event) => setLocation(event.target.value)} />
      </label>

      <div className="grid gap-2 text-sm">
        <span className="font-medium">Preferred prayer areas</span>
        <div className="flex flex-wrap gap-2">
          {PRAYER_CATEGORIES.map((category) => (
            <button
              key={category.value}
              type="button"
              onClick={() => toggleArea(category.value)}
              className={`rounded-full border px-3 py-1 text-sm transition ${
                areas.includes(category.value)
                  ? 'border-brand-primary bg-brand-primary text-brand-primary-foreground'
                  : 'border-[#e6ddcb] bg-[#fffdf8] text-[#6b5f52]'
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-1.5 text-sm">
          <span className="font-medium">Prayer availability</span>
          <select className={inputCls} value={availability} onChange={(event) => setAvailability(event.target.value as typeof availability)}>
            <option value="mornings">Mornings</option>
            <option value="evenings">Evenings</option>
            <option value="weekends">Weekends</option>
            <option value="flexible">Flexible</option>
          </select>
        </label>
        <label className="grid gap-1.5 text-sm">
          <span className="font-medium">How often can you take intentions?</span>
          <select className={inputCls} value={frequency} onChange={(event) => setFrequency(event.target.value as typeof frequency)}>
            <option value="daily">Daily</option>
            <option value="few-times-week">A few times a week</option>
            <option value="weekly">Weekly</option>
          </select>
        </label>
      </div>

      <label className="grid gap-1.5 text-sm">
        <span className="font-medium">Why would you like to become a Prayer Partner?</span>
        <textarea rows={3} className={inputCls} required maxLength={600} value={message} onChange={(event) => setMessage(event.target.value)} />
      </label>

      <label className="flex gap-2 text-sm">
        <input type="checkbox" className="mt-0.5 accent-brand-primary" checked={confidentiality} onChange={(event) => setConfidentiality(event.target.checked)} />
        I will keep all intentions confidential.
      </label>
      <label className="flex gap-2 text-sm">
        <input type="checkbox" className="mt-0.5 accent-brand-primary" checked={safeguarding} onChange={(event) => setSafeguarding(event.target.checked)} />
        I agree to the Prayer Room guidelines and safeguarding requirements.
      </label>

      {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
      <button type="submit" disabled={busy} className="rounded-full bg-brand-primary px-6 py-3 text-sm font-medium text-brand-primary-foreground transition hover:bg-brand-primary/90 disabled:opacity-60">
        {busy ? 'Submitting…' : 'Submit application'}
      </button>
    </form>
  )
}
