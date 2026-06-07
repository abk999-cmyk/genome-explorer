import { SEVERITY } from '../../lib/severity'
import { useSelection } from '../../store/selectionStore'
import type { Finding } from '../../types/report'

/**
 * Static, dependency-free double-helix for reduced-motion / no-WebGL. Its
 * markers are real focusable buttons that drive the same selection store as the
 * 3D scene, so keyboard + screen-reader users get the full interaction.
 */
const W = 360
const H = 640
const CX = W / 2
const AMP = 110
const TURNS = 3

function strandPath(phase: number): string {
  const pts: string[] = []
  for (let i = 0; i <= 80; i++) {
    const u = i / 80
    const x = CX + AMP * Math.sin(u * TURNS * 2 * Math.PI + phase)
    const y = u * H
    pts.push(`${x.toFixed(1)},${y.toFixed(1)}`)
  }
  return 'M' + pts.join(' L')
}

export default function HelixFallback({ findings }: { findings: Finding[] }) {
  const select = useSelection((s) => s.select)
  const hover = useSelection((s) => s.hover)
  const selectedId = useSelection((s) => s.selectedId)

  const rungs = Array.from({ length: 31 }, (_, i) => {
    const u = i / 30
    const y = u * H
    const x1 = CX + AMP * Math.sin(u * TURNS * 2 * Math.PI)
    const x2 = CX + AMP * Math.sin(u * TURNS * 2 * Math.PI + Math.PI)
    return { x1, x2, y }
  })

  const markers = findings.map((f, i) => {
    const u = findings.length === 1 ? 0.5 : 0.06 + 0.88 * (i / (findings.length - 1))
    const phase = i % 2 ? Math.PI : 0
    const y = u * H
    const x = CX + AMP * Math.sin(u * TURNS * 2 * Math.PI + phase)
    return { f, x, y }
  })

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="h-full w-full"
      role="group"
      aria-label="DNA strand — your findings"
    >
      <defs>
        <filter id="softglow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {rungs.map((r, i) => (
        <line
          key={i}
          x1={r.x1}
          y1={r.y}
          x2={r.x2}
          y2={r.y}
          stroke="#4D8DFF"
          strokeWidth={1.5}
          strokeOpacity={0.4}
        />
      ))}

      <path d={strandPath(0)} fill="none" stroke="#3DF0E6" strokeWidth={3} strokeOpacity={0.85} filter="url(#softglow)" />
      <path d={strandPath(Math.PI)} fill="none" stroke="#4D8DFF" strokeWidth={3} strokeOpacity={0.85} filter="url(#softglow)" />

      {markers.map(({ f, x, y }) => {
        const meta = SEVERITY[f.severityTier]
        const isSelected = selectedId === f.id
        return (
          <g
            key={f.id}
            role="button"
            tabIndex={0}
            aria-label={`${f.label}: ${f.detail}`}
            className="cursor-pointer outline-none"
            onClick={() => select(f.id)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                select(f.id)
              }
            }}
            onMouseEnter={() => hover(f.id)}
            onMouseLeave={() => hover(null)}
          >
            <circle
              cx={x}
              cy={y}
              r={isSelected ? 11 : 8}
              fill={meta.color}
              filter="url(#softglow)"
              stroke={isSelected ? '#EAF2FF' : 'transparent'}
              strokeWidth={1.5}
            />
            <text
              x={x + 16}
              y={y + 4}
              fill="#A9B6CE"
              className="mono"
              fontSize={12}
            >
              {f.label}
            </text>
          </g>
        )
      })}
    </svg>
  )
}
