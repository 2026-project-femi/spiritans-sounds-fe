'use client'

import { useState } from 'react'

const OPTIONS = [
  'Someone has offered to pray for your intention.',
  'A Prayer Partner has prayed for your intention.',
  'You have been assigned a new prayer intention.',
  'Your Prayer Partner has sent you a prayer message.',
  'A Moment with the Holy Spirit begins soon.',
]

export function NotificationToggles() {
  const [enabled, setEnabled] = useState<Record<number, boolean>>({})

  return (
    <div className="mx-auto grid max-w-xl gap-3 px-5">
      {OPTIONS.map((option, index) => (
        <div
          key={option}
          className="flex items-center justify-between gap-4 rounded-xl border border-[#e6ddcb] bg-[#fffdf8] p-4"
        >
          <p className="font-serif text-lg">🕊️ {option}</p>
          <label className="flex shrink-0 items-center gap-1.5 text-xs text-[#6b5f52]">
            <input
              type="checkbox"
              className="accent-brand-primary"
              checked={enabled[index] ?? true}
              onChange={(event) =>
                setEnabled((current) => ({ ...current, [index]: event.target.checked }))
              }
            />
            Receive
          </label>
        </div>
      ))}
    </div>
  )
}
