import { ArrowRight } from 'lucide-react'
import { SEVERITY } from '../../lib/severity'
import type { SeverityTier } from '../../types/report'
import Reveal from '../ui/Reveal'

interface ActionItem {
  tier: SeverityTier
  title: string
  body: string
  link?: { label: string; href: string }
}

const ACTIONS: ActionItem[] = [
  {
    tier: 'critical',
    title: 'See a cardiology / inherited-arrhythmia clinic',
    body: 'Get a baseline 12-lead ECG and a personalized risk assessment for your LQT2 finding.',
    link: { label: 'About LQT2', href: '#headline' },
  },
  {
    tier: 'critical',
    title: 'Carry your QT-drug avoid-list',
    body: 'Tell every prescriber and pharmacist about your LQT2 status before starting any new medication.',
    link: { label: 'Drug safety list', href: '#pharmaco' },
  },
  {
    tier: 'carrier',
    title: 'Consider partner carrier screening',
    body: 'Relevant before family planning — and only if a partner carries a variant in the same gene.',
    link: { label: 'Carrier status', href: '#carrier' },
  },
  {
    tier: 'info',
    title: 'Share your pharmacogenomics with your pharmacist',
    body: 'Genotype-guided dosing (e.g. for warfarin) can be both safer and more effective.',
    link: { label: 'Medications', href: '#pharmaco' },
  },
  {
    tier: 'info',
    title: 'Offer your relatives cascade testing',
    body: 'First-degree relatives have a 50% chance of carrying the LQT2 variant — worth knowing.',
  },
]

export default function Action() {
  return (
    <section id="action" className="mx-auto max-w-4xl px-6 py-24">
      <Reveal>
        <p className="eyebrow">// what this means / next steps</p>
        <h2 className="mt-3 text-3xl font-semibold md:text-4xl">
          This is manageable — here’s where to start
        </h2>
        <p className="text-text-mid mt-3 max-w-2xl">
          None of this is an emergency. Knowing it is the advantage. A short,
          prioritized plan:
        </p>
      </Reveal>

      <ol className="mt-8 space-y-3">
        {ACTIONS.map((a, i) => (
          <Reveal as="li" key={a.title} delay={i * 0.06}>
            <div className="glass flex items-start gap-4 p-5">
              <span
                className="mt-1 grid h-7 w-7 shrink-0 place-items-center rounded-full text-xs font-bold"
                style={{ background: `${SEVERITY[a.tier].color}22`, color: SEVERITY[a.tier].color }}
              >
                {i + 1}
              </span>
              <div className="flex-1">
                <p className="text-text-hi font-semibold">{a.title}</p>
                <p className="text-text-mid mt-1 text-sm">{a.body}</p>
                {a.link && (
                  <a
                    href={a.link.href}
                    className="text-signal-cyan mt-2 inline-flex items-center gap-1 text-xs font-semibold hover:underline"
                  >
                    {a.link.label} <ArrowRight size={12} />
                  </a>
                )}
              </div>
            </div>
          </Reveal>
        ))}
      </ol>

      <Reveal delay={0.1}>
        <p className="text-text-mid mt-10 text-center text-lg">
          You can’t change your genome — but now you can{' '}
          <span className="text-signal-cyan">work with it</span>.
        </p>
      </Reveal>
    </section>
  )
}
