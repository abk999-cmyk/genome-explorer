import { ArrowRight, ExternalLink, HeartPulse } from 'lucide-react'
import { report } from '../../data/report'
import { useSelection } from '../../store/selectionStore'
import SeverityBadge from '../ui/SeverityBadge'
import Reveal from '../ui/Reveal'
import type { PgxResult } from '../../types/report'

const ACTION_LABEL: Record<PgxResult['actionability'], string> = {
  high: 'Actionable',
  moderate: 'Worth noting',
  informational: 'Reassuring',
}

function PgxCard({ p }: { p: PgxResult }) {
  const select = useSelection((s) => s.select)
  const hasQt = p.affectedDrugs.some((d) => d.qtRisk)
  return (
    <button
      onClick={() => select(p.id)}
      className="glass hover:border-signal-blue/40 h-full w-full p-5 text-left transition-all hover:-translate-y-1"
    >
      <div className="flex items-center justify-between gap-2">
        <span className="mono text-text-hi text-base">{p.gene}</span>
        <span className="mono text-text-low text-[10px] uppercase tracking-widest">
          {ACTION_LABEL[p.actionability]}
        </span>
      </div>
      <p className="mono text-signal-blue mt-1 text-xs">{p.diplotype}</p>
      <p className="text-text-hi mt-2 text-sm font-medium">{p.phenotype}</p>
      <p className="text-text-mid mt-2 line-clamp-3 text-sm">{p.plain}</p>
      <div className="mt-4 flex items-center gap-2">
        <SeverityBadge tier="info" label={`${p.affectedDrugs.length} drugs`} />
        {hasQt && (
          <span
            className="mono rounded-full px-2 py-0.5 text-[10px]"
            style={{ background: 'rgba(213,94,0,0.15)', color: 'var(--color-sev-pathogenic)' }}
          >
            ⚠ QT
          </span>
        )}
      </div>
    </button>
  )
}

function QtAvoidList() {
  const qt = report.qtSafety
  const dbl = new Set(qt.doubleFlagged)
  return (
    <div className="glass p-6" style={{ borderColor: 'rgba(213,94,0,0.3)' }}>
      <div className="flex items-center gap-3">
        <HeartPulse size={22} className="text-sev-pathogenic" />
        <h3 className="text-text-hi text-lg font-semibold">
          QT-prolonging drugs — avoid or use with cardiology oversight
        </h3>
      </div>
      <p className="text-text-mid mt-3 text-sm">{qt.intro}</p>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        {qt.categories.map((cat) => (
          <div key={cat.category}>
            <p className="text-text-low mono text-[11px] uppercase tracking-widest">
              {cat.category}
            </p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {cat.examples.map((drug) => {
                const isDbl = dbl.has(drug)
                return (
                  <span
                    key={drug}
                    title={isDbl ? 'Also a CYP2C19 substrate' : undefined}
                    className="mono rounded-md border px-2 py-0.5 text-[11px]"
                    style={{
                      borderColor: isDbl ? 'var(--color-sev-pathogenic)' : 'var(--color-glass-edge)',
                      color: isDbl ? 'var(--color-sev-pathogenic)' : 'var(--color-text-mid)',
                      background: isDbl ? 'rgba(213,94,0,0.08)' : 'transparent',
                    }}
                  >
                    {drug}
                    {isDbl && <span className="ml-1 opacity-70">2×</span>}
                  </span>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      <p className="text-text-low mt-5 text-xs">
        <span className="text-sev-pathogenic">2×</span> = double-flagged (also a
        gene you metabolize unusually). This list isn’t exhaustive.
      </p>
      <a
        href={qt.resourceUrl}
        target="_blank"
        rel="noreferrer"
        className="text-signal-blue mt-3 inline-flex items-center gap-1.5 text-sm hover:underline"
      >
        {qt.resourceLabel} <ExternalLink size={13} />
      </a>
    </div>
  )
}

export default function Pharmaco() {
  return (
    <section id="pharmaco" className="mx-auto max-w-6xl px-6 py-24">
      <Reveal>
        <p className="eyebrow">// pharmacogenomics</p>
        <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
          How you respond to medications
        </h2>
        <p className="text-text-mid mt-3 max-w-2xl">
          Your DNA influences how you process certain drugs. This guides dose and
          choice — it never means “can’t take.” Always decide with a clinician.
        </p>
      </Reveal>

      <Reveal delay={0.1} className="mt-8">
        <QtAvoidList />
      </Reveal>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {report.pharmacogenomics.map((p, i) => (
          <Reveal key={p.id} delay={(i % 3) * 0.06}>
            <PgxCard p={p} />
          </Reveal>
        ))}
      </div>

      <p className="text-text-low mt-4 inline-flex items-center gap-1 text-xs">
        Tap any gene for what it means <ArrowRight size={12} />
      </p>
    </section>
  )
}
