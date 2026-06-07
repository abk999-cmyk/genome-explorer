import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { useSelection } from '../../store/selectionStore'

/**
 * A self-drawing ECG trace. The third beat has a visibly stretched QT interval,
 * highlighted in red with a "QT ↑" bracket — the literal picture of what the
 * KCNH2 / LQT2 finding means: the heart's electrical reset runs slow.
 */
const BEAT_W = 95
const STRETCH = 34 // extra ST length on the prolonged beat

type Pt = [number, number]

function beat(offset: number, stretch: number): { pts: Pt[]; qt: Pt[] } {
  const local: Pt[] = [
    [0, 0],
    [10, 0],
    [16, -8], // P
    [22, 0],
    [30, 0], // (Q baseline)
    [33, 6], // Q
    [37, -40], // R
    [41, 14], // S
    [45, 0],
    [54 + stretch, 0], // ST end
    [60 + stretch, -4],
    [69 + stretch, -18], // T peak
    [78 + stretch, -4],
    [85 + stretch, 0], // T end
    [BEAT_W + stretch, 0],
  ]
  const pts = local.map(([x, y]) => [x + offset, y] as Pt)
  // QT = from Q (index 5) through T end (index 13)
  const qt = pts.slice(5, 14)
  return { pts, qt }
}

const SEQ = [0, 0, STRETCH, 0] // which beat is prolonged
function build() {
  let x = 0
  let all: Pt[] = []
  let qt: Pt[] = []
  SEQ.forEach((stretch) => {
    const b = beat(x, stretch)
    all = all.concat(b.pts)
    if (stretch > 0) qt = b.qt
    x += BEAT_W + stretch
  })
  return { all, qt, width: x }
}

function toPath(pts: Pt[]): string {
  return pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p[0]},${p[1]}`).join(' ')
}

export default function EcgTrace() {
  const ref = useRef<SVGSVGElement>(null)
  const inView = useInView(ref, { once: true, margin: '-15%' })
  const reduce = useSelection((s) => s.reduceMotion)
  const { all, qt, width } = build()
  const qtMidX = (qt[0][0] + qt[qt.length - 1][0]) / 2

  const draw = (delay: number, duration: number) =>
    reduce
      ? { initial: { pathLength: 1 }, animate: { pathLength: 1 } }
      : {
          initial: { pathLength: 0 },
          animate: inView ? { pathLength: 1 } : { pathLength: 0 },
          transition: { duration, delay, ease: 'easeInOut' as const },
        }

  return (
    <svg
      ref={ref}
      viewBox={`-5 -48 ${width + 10} 78`}
      className="h-full w-full"
      role="img"
      aria-label="ECG trace with a prolonged QT interval highlighted"
    >
      {/* faint grid */}
      <defs>
        <pattern id="ecg-grid" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M20 0 H0 V20" fill="none" stroke="rgba(61,240,230,0.08)" strokeWidth="0.5" />
        </pattern>
      </defs>
      <rect x={-5} y={-48} width={width + 10} height={78} fill="url(#ecg-grid)" />

      <motion.path
        d={toPath(all)}
        fill="none"
        stroke="var(--color-signal-cyan)"
        strokeWidth={2}
        strokeLinejoin="round"
        strokeLinecap="round"
        {...draw(0, 2.4)}
      />
      {/* prolonged QT, drawn on top in red after the trace reaches it */}
      <motion.path
        d={toPath(qt)}
        fill="none"
        stroke="var(--color-sev-pathogenic)"
        strokeWidth={3}
        strokeLinejoin="round"
        strokeLinecap="round"
        style={{ filter: 'drop-shadow(0 0 4px rgba(213,94,0,0.6))' }}
        {...draw(1.6, 0.9)}
      />
      {/* QT bracket label */}
      <g style={{ opacity: reduce || inView ? 1 : 0, transition: 'opacity 0.4s 2.2s' }}>
        <line
          x1={qt[0][0]}
          y1={22}
          x2={qt[qt.length - 1][0]}
          y2={22}
          stroke="var(--color-sev-pathogenic)"
          strokeWidth={1}
        />
        <text
          x={qtMidX}
          y={34}
          textAnchor="middle"
          className="mono"
          fontSize={11}
          fill="var(--color-sev-pathogenic)"
        >
          QT ↑
        </text>
      </g>
    </svg>
  )
}
