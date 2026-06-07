import { ArrowRight, Users } from 'lucide-react'
import { report } from '../../data/report'
import { useSelection } from '../../store/selectionStore'
import SeverityBadge from '../ui/SeverityBadge'
import Reveal from '../ui/Reveal'

function Punnett() {
  // 2×2: one affected (aa) cell of four = 25%
  const cells = ['Aa', 'aa', 'AA', 'Aa']
  return (
    <div className="shrink-0">
      <div className="grid grid-cols-2 gap-1">
        {cells.map((c, i) => (
          <div
            key={i}
            className="mono grid h-10 w-10 place-items-center rounded text-xs"
            style={
              c === 'aa'
                ? { background: 'rgba(230,159,0,0.22)', color: 'var(--color-sev-carrier)', border: '1px solid var(--color-sev-carrier)' }
                : { background: 'var(--color-surface-2)', color: 'var(--color-text-low)' }
            }
          >
            {c}
          </div>
        ))}
      </div>
      <p className="text-text-low mono mt-2 text-center text-[10px]">25% if both carry</p>
    </div>
  )
}

export default function Carrier() {
  const select = useSelection((s) => s.select)
  const carriers = report.carrierVariants

  return (
    <section id="carrier" className="mx-auto max-w-6xl px-6 py-24">
      <Reveal>
        <p className="eyebrow">// carrier status</p>
        <h2 className="mt-3 text-3xl font-semibold md:text-4xl">What you carry</h2>
      </Reveal>

      <Reveal delay={0.1} className="mt-6">
        <div
          className="glass flex flex-col items-start gap-5 p-6 sm:flex-row sm:items-center"
          style={{ borderColor: 'rgba(230,159,0,0.3)' }}
        >
          <Users size={24} className="text-sev-carrier shrink-0" />
          <div className="flex-1">
            <p className="text-text-hi font-semibold">Carrier ≠ affected</p>
            <p className="text-text-mid mt-1 text-sm">
              These are recessive — you’d need two altered copies to be affected,
              and you have one. You’re healthy. It only matters for family
              planning: if a partner carries a variant in the <em>same</em> gene,
              each pregnancy has a 1-in-4 chance.
            </p>
          </div>
          <Punnett />
        </div>
      </Reveal>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        {carriers.map((c, i) => (
          <Reveal key={c.id} delay={i * 0.08}>
            <button
              onClick={() => select(c.id)}
              className="glass hover:border-signal-cyan/40 group h-full w-full p-5 text-left transition-all hover:-translate-y-1"
            >
              <div className="flex items-center justify-between">
                <span className="mono text-text-hi text-lg">{c.gene}</span>
                <SeverityBadge tier="carrier" />
              </div>
              <p className="text-text-low mono mt-1 text-xs">{c.conditionCarried}</p>
              <p className="text-text-mid mt-3 text-sm leading-relaxed">
                {c.plain.headline}
              </p>
              <div className="text-text-low mono mt-4 flex items-center gap-1 text-xs">
                Carrier freq {c.carrierFrequency}
              </div>
              <span className="text-signal-cyan mt-4 inline-flex items-center gap-1 text-xs font-semibold">
                Details <ArrowRight size={13} />
              </span>
            </button>
          </Reveal>
        ))}
      </div>

      <Reveal delay={0.1} className="mt-6">
        <div
          className="rounded-lg border-l-2 px-4 py-3 text-sm text-text-mid"
          style={{ borderColor: 'var(--color-signal-cyan)', background: 'rgba(61,240,230,0.06)' }}
        >
          <strong className="text-text-hi">No, this doesn’t mean you have PCD. </strong>
          You carry variants in two <em>different</em> ciliary genes (CCDC40 and
          DNAH11). Because PCD is recessive, it takes two hits in the{' '}
          <em>same</em> gene to be affected — so two single carriers in different
          genes is still just carrier status.
        </div>
      </Reveal>
    </section>
  )
}
