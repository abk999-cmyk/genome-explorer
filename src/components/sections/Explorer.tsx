import { Suspense, lazy, useEffect, useRef, useState } from 'react'
import { getFindings } from '../../lib/findings'
import { hasWebGL } from '../../lib/webgl'
import { useSelection } from '../../store/selectionStore'
import { SEVERITY } from '../../lib/severity'
import type { SeverityTier } from '../../types/report'
import HelixFallback from '../helix/HelixFallback'

// Code-split the heavy 3D scene (three.js) and the ideogram (d3 + band data)
// so neither weighs down the initial load.
const HelixScene = lazy(() => import('../helix/HelixScene'))
const KaryotypeIdeogram = lazy(() => import('../ideogram/KaryotypeIdeogram'))

const findings = getFindings()
const LEGEND: SeverityTier[] = ['critical', 'carrier', 'info', 'reassuring']

function Loading() {
  return (
    <div className="text-text-low mono absolute inset-0 flex items-center justify-center text-sm">
      Initializing helix…
    </div>
  )
}

export default function Explorer() {
  const reduceMotion = useSelection((s) => s.reduceMotion)
  const [webgl, setWebgl] = useState(true)
  useEffect(() => setWebgl(hasWebGL()), [])
  const use3D = webgl && !reduceMotion

  // Pause the 3D render loop when the explorer scrolls out of view.
  const stageRef = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(true)
  useEffect(() => {
    const el = stageRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { rootMargin: '120px' },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <section id="explorer" className="relative mx-auto max-w-5xl px-6 py-24">
      <p className="eyebrow">// dna explorer</p>
      <h2 className="text-text-hi mt-3 text-3xl font-semibold md:text-4xl">
        Your strand, up close
      </h2>
      <p className="text-text-mid mt-3 max-w-2xl">
        Every finding from your report, placed on an interactive strand. Hover or
        click a node to see what it means for you — the pathogenic one glows red.
        Drag to rotate; scroll to zoom.
      </p>

      <div
        ref={stageRef}
        className="relative mt-10 h-[72vh] min-h-[480px] overflow-hidden rounded-2xl border border-[var(--color-glass-edge)] bg-[radial-gradient(circle_at_50%_40%,rgba(61,240,230,0.06),transparent_70%)]"
      >
        {use3D ? (
          <Suspense fallback={<Loading />}>
            <HelixScene findings={findings} active={inView} />
          </Suspense>
        ) : (
          <div className="flex h-full items-center justify-center py-6">
            <HelixFallback findings={findings} />
          </div>
        )}
      </div>

      {/* legend */}
      <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2">
        {LEGEND.map((tier) => (
          <span key={tier} className="flex items-center gap-2 text-sm">
            <span
              className="inline-block h-3 w-3 rounded-full"
              style={{ background: SEVERITY[tier].color }}
            />
            <span className="text-text-mid">{SEVERITY[tier].label}</span>
          </span>
        ))}
      </div>

      {/* accuracy anchor: real chromosome positions */}
      <div className="mt-16">
        <p className="eyebrow">// where on your chromosomes</p>
        <h3 className="text-text-hi mt-3 text-xl font-semibold md:text-2xl">
          The exact spots
        </h3>
        <p className="text-text-mid mt-2 max-w-2xl text-sm">
          The helix above is illustrative — here’s where each variant actually
          sits on your chromosomes (GRCh38). Click a marker to open its detail.
        </p>
        <div className="glass mt-6 overflow-x-auto p-6">
          <Suspense
            fallback={
              <div className="text-text-low mono py-12 text-center text-sm">
                Loading chromosomes…
              </div>
            }
          >
            <KaryotypeIdeogram />
          </Suspense>
        </div>
      </div>
    </section>
  )
}
