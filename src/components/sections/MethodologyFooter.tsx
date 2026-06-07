import { report } from '../../data/report'
import Reveal from '../ui/Reveal'

export default function MethodologyFooter() {
  return (
    <footer
      id="methodology"
      className="mt-12 border-t border-[var(--color-hairline)]"
    >
      <div className="mx-auto max-w-6xl px-6 py-20">
        <Reveal>
          <p className="eyebrow">// methodology &amp; fine print</p>
          <h2 className="mt-3 text-2xl font-semibold md:text-3xl">
            How this was made
          </h2>
        </Reveal>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <div className="glass p-5">
            <p className="text-text-low mono text-[11px] uppercase tracking-widest">
              Method
            </p>
            <p className="text-text-mid mt-2 text-sm leading-relaxed">
              {report.meta.methodology}
            </p>
          </div>
          <div className="glass p-5">
            <p className="text-text-low mono text-[11px] uppercase tracking-widest">
              Coverage / quality
            </p>
            <p className="text-text-mid mt-2 text-sm leading-relaxed">
              {report.meta.coverageSummary}
            </p>
          </div>
        </div>

        {/* glossary */}
        <h3 className="text-text-hi mt-14 text-xl font-semibold">
          Genomics, in plain words
        </h3>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {report.glossary.map((g) => (
            <div key={g.term} className="glass p-4">
              <p className="mono text-signal-cyan text-sm">{g.term}</p>
              <p className="text-text-mid mt-1.5 text-sm leading-snug">
                {g.definition}
              </p>
              {g.analogy && (
                <p className="text-text-low mt-2 text-xs italic">{g.analogy}</p>
              )}
            </div>
          ))}
        </div>

        {/* disclaimers */}
        <h3 className="text-text-hi mt-14 text-xl font-semibold">
          Important to read
        </h3>
        <ul className="mt-4 space-y-2">
          {report.disclaimers.map((d, i) => (
            <li key={i} className="text-text-low flex gap-2 text-sm leading-relaxed">
              <span className="text-signal-cyan mt-1 shrink-0">·</span>
              {d}
            </li>
          ))}
        </ul>

        <p className="text-text-low mt-12 text-xs">
          Built as an educational visualization · {report.meta.reportType} ·{' '}
          {report.meta.genomeBuild} · all data static &amp; processed in your
          browser.
        </p>
      </div>
    </footer>
  )
}
