import { ChevronDown } from 'lucide-react'
import type { ReactNode } from 'react'
import { report } from '../../data/report'
import CountUp from '../ui/CountUp'
import Reveal from '../ui/Reveal'

function Stat({ value, label }: { value: ReactNode; label: string }) {
  return (
    <div className="glass px-4 py-6">
      <div className="text-signal-cyan font-display text-3xl font-semibold md:text-4xl">
        {value}
      </div>
      <div className="text-text-low mono mt-2 text-[10px] uppercase tracking-widest md:text-xs">
        {label}
      </div>
    </div>
  )
}

export default function Hero() {
  const { stats } = report.meta
  return (
    <section
      id="hero"
      className="relative flex min-h-screen flex-col items-center justify-center px-6 py-24 text-center"
    >
      <Reveal>
        <p className="eyebrow">// your genome, decoded</p>
      </Reveal>
      <Reveal delay={0.1}>
        <h1 className="mt-4 text-5xl font-semibold tracking-tight md:text-7xl">
          Your Genome,
          <br />
          <span className="text-signal-cyan" style={{ textShadow: 'var(--glow-cyan)' }}>
            Decoded
          </span>
        </h1>
      </Reveal>
      <Reveal delay={0.2}>
        <p className="text-text-mid mx-auto mt-6 max-w-xl text-lg">
          {report.meta.summaryStatement}
        </p>
      </Reveal>

      <Reveal delay={0.35} className="mt-12 w-full max-w-2xl">
        <div className="grid grid-cols-3 gap-3 md:gap-4">
          <Stat value={<CountUp value={stats.genesAnalyzed} />} label="Genes analyzed" />
          <Stat
            value={
              <CountUp
                value={stats.variantsReviewed}
                format={(n) => `${(n / 1_000_000).toFixed(1)}M`}
              />
            }
            label="Variants reviewed"
          />
          <Stat value={<CountUp value={stats.findings} />} label="Personal findings" />
        </div>
      </Reveal>

      <a
        href="#headline"
        className="text-text-low hover:text-signal-cyan absolute bottom-10 flex flex-col items-center gap-1 text-xs transition-colors"
        aria-label="Scroll to findings"
      >
        <span className="mono uppercase tracking-widest">Begin</span>
        <ChevronDown size={18} className="animate-bounce" />
      </a>
    </section>
  )
}
