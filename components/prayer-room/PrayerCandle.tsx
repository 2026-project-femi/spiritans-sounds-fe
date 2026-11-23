interface Props {
  lit?: boolean
  large?: boolean
}

export function PrayerCandle({ lit = true, large = false }: Props) {
  return (
    <span
      aria-hidden="true"
      className={`prayer-candle ${large ? 'prayer-candle-large' : ''} ${lit ? 'is-lit' : ''}`}
    >
      <span className="candle-wax" />
      <span className="candle-wick" />
      <span className="candle-flame" />
      <span className="candle-base" />
    </span>
  )
}
