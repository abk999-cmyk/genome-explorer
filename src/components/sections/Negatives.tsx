import { CheckCircle2, ShieldCheck } from 'lucide-react'
import { report } from '../../data/report'
import { useSelection } from '../../store/selectionStore'
import Reveal from '../ui/Reveal'

export default function Negatives() {
  const select = useSelection((s) => s.select)
  const genes = report.screenedNegative.genesScreened

  return (
    <section id="negatives" className="mx-auto max-w-6xl px-6 py-24">
      <Reveal>
        <p className="eyebrow">// reassuring negatives</p>
        <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
          Screened &amp; not found
        </h2>
        <p className="text-text-mid mt-3 max-w-2xl">
          We checked these well-known risk genes and found none of the variants
          we screen for — {genes.length} clear results.
        </p>
      </Reveal>

      <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {genes.map((g, i) => (
          <Reveal key={g.gene} delay={(i % 5) * 0.05}>
            <button
              onClick={() => select(`neg-${g.gene}`)}
              className="glass group h-full w-full p-4 text-left transition-all hover:-translate-y-1"
              style={{ borderColor: 'rgba(0,158,115,0.2)' }}
            >
              <CheckCircle2 size={20} className="text-sev-clear" />
              <p className="mono text-text-hi mt-3 text-sm">{g.gene}</p>
              <p className="text-text-low mt-1 text-xs leading-snug">{g.condition}</p>
            </button>
          </Reveal>
        ))}
      </div>

      <Reveal delay={0.1} className="mt-6">
        <div className="glass flex items-start gap-3 p-5">
          <ShieldCheck size={20} className="text-sev-clear mt-0.5 shrink-0" />
          <p className="text-text-mid text-sm">
            <strong className="text-text-hi">One important caveat: </strong>
            {report.screenedNegative.limitations}
          </p>
        </div>
      </Reveal>
    </section>
  )
}
