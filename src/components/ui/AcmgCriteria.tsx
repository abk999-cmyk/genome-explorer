import type { AcmgCode } from '../../types/report'

/**
 * "Why is this called pathogenic?" — a weight-of-evidence bar. Each ACMG code is
 * a segment sized by its strength; the list below explains each in plain English.
 * The point: no single line is the whole story — it's a cumulative verdict.
 */
const WEIGHT: Record<AcmgCode['strength'], number> = {
  'Very Strong': 8,
  Strong: 4,
  Moderate: 2,
  Supporting: 1,
}
const OPACITY: Record<AcmgCode['strength'], number> = {
  'Very Strong': 1,
  Strong: 0.82,
  Moderate: 0.62,
  Supporting: 0.42,
}

export default function AcmgCriteria({ codes }: { codes: AcmgCode[] }) {
  const total = codes.reduce((s, c) => s + WEIGHT[c.strength], 0)
  return (
    <div>
      <div className="flex h-2.5 w-full overflow-hidden rounded-full border border-[var(--color-glass-edge)]">
        {codes.map((c) => (
          <div
            key={c.code}
            title={`${c.code} · ${c.strength}: ${c.meaning}`}
            style={{
              width: `${(WEIGHT[c.strength] / total) * 100}%`,
              background: 'var(--color-sev-pathogenic)',
              opacity: OPACITY[c.strength],
            }}
          />
        ))}
      </div>
      <ul className="mt-4 space-y-2">
        {codes.map((c) => (
          <li key={c.code} className="flex gap-3 text-sm">
            <code
              className="mono h-fit shrink-0 rounded px-1.5 py-0.5 text-xs"
              style={{
                background: 'rgba(213,94,0,0.12)',
                color: 'var(--color-sev-pathogenic)',
              }}
            >
              {c.code}
            </code>
            <span className="text-text-mid">{c.meaning}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
