import { ArrowRight, Heart, Pill } from 'lucide-react'
import { report } from '../../data/report'
import { useSelection } from '../../store/selectionStore'
import SeverityBadge from '../ui/SeverityBadge'
import AcmgCriteria from '../ui/AcmgCriteria'
import EcgTrace from '../ui/EcgTrace'
import Reveal from '../ui/Reveal'

export default function HeadlineFinding() {
  const v = report.variants[0]
  const select = useSelection((s) => s.select)

  return (
    <section id="headline" className="mx-auto max-w-6xl px-6 py-24 md:py-32">
      <Reveal>
        <p className="eyebrow">// headline finding</p>
      </Reveal>

      <div className="mt-6 grid gap-10 lg:grid-cols-2 lg:items-center">
        {/* left: meaning */}
        <Reveal delay={0.1}>
          <SeverityBadge tier="critical" />
          <h2 className="mt-4 text-3xl font-semibold md:text-5xl">
            {v.condition}
          </h2>
          <div className="mono text-text-low mt-3 flex flex-wrap items-center gap-2 text-sm">
            <span
              className="rounded px-1.5 py-0.5"
              style={{ background: 'rgba(213,94,0,0.12)', color: 'var(--color-sev-pathogenic)' }}
            >
              {v.gene}
            </span>
            <span>{v.cdna}</span>
            <span>· {v.protein}</span>
            <span>· {v.inheritance}</span>
          </div>

          <p className="text-text-hi mt-6 text-xl leading-relaxed">
            {v.plain.headline}
          </p>
          <p className="text-text-mid mt-4 leading-relaxed">{v.plain.explainer}</p>

          {v.plain.whatToDo && (
            <div
              className="mt-6 rounded-lg border-l-2 px-4 py-3 text-sm text-text-mid"
              style={{ borderColor: 'var(--color-signal-cyan)', background: 'rgba(61,240,230,0.06)' }}
            >
              <strong className="text-text-hi">What this means for you: </strong>
              {v.plain.whatToDo}
            </div>
          )}

          <button
            onClick={() => select(v.id)}
            className="group text-signal-cyan mt-6 inline-flex items-center gap-2 text-sm font-semibold hover:gap-3"
            style={{ transition: 'gap 0.2s' }}
          >
            See the full detail
            <ArrowRight size={16} className="transition-transform" />
          </button>
        </Reveal>

        {/* right: the cardiac motif */}
        <Reveal delay={0.2}>
          <div className="glass relative p-6">
            <div className="mb-4 flex items-center gap-3">
              <span
                className="grid h-10 w-10 place-items-center rounded-full"
                style={{ background: 'rgba(213,94,0,0.12)' }}
              >
                <Heart
                  size={20}
                  className="animate-heart-pulse"
                  style={{ color: 'var(--color-sev-pathogenic)', fill: 'var(--color-sev-pathogenic)' }}
                />
              </span>
              <div>
                <p className="text-text-hi text-sm font-semibold">
                  Your heartbeat, slowed to reset
                </p>
                <p className="text-text-low mono text-xs">
                  the QT interval runs long
                </p>
              </div>
            </div>
            <div className="h-44">
              <EcgTrace />
            </div>
            <p className="text-text-mid mt-4 text-sm">
              Each beat needs to electrically “reset.” Your hERG channel lets that
              reset run slow — the stretched red segment is the prolonged QT.
            </p>
          </div>
        </Reveal>
      </div>

      {/* full width: evidence + safety seed */}
      <div className="mt-12 grid gap-6 md:grid-cols-2">
        <Reveal className="glass p-6">
          <p className="eyebrow mb-3">// why it's called pathogenic</p>
          <AcmgCriteria codes={v.acmgCodes} />
        </Reveal>

        <Reveal delay={0.1} className="glass p-6">
          <div className="flex items-start gap-3">
            <Pill size={20} className="text-sev-pathogenic mt-0.5 shrink-0" />
            <div>
              <p className="text-text-hi font-semibold">
                This affects which medications are safe
              </p>
              <p className="text-text-mid mt-2 text-sm">
                Because of this finding, certain QT-prolonging drugs should be
                avoided. We’ve flagged them in your pharmacogenomics.
              </p>
              <a
                href="#pharmaco"
                className="text-signal-blue mt-3 inline-flex items-center gap-1.5 text-sm hover:underline"
              >
                See your drug safety list <ArrowRight size={14} />
              </a>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
