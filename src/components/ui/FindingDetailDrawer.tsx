import { useEffect, useRef, type ReactNode } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ExternalLink, X } from 'lucide-react'
import { useSelection } from '../../store/selectionStore'
import { lookupDetail } from '../../lib/findings'
import { SEVERITY } from '../../lib/severity'
import SeverityBadge from './SeverityBadge'
import AcmgCriteria from './AcmgCriteria'
import type {
  CarrierVariant,
  PgxResult,
  ScreenedGene,
  Variant,
} from '../../types/report'

/* ---------------------------------------------------------------- helpers */
function Chip({ children }: { children: ReactNode }) {
  return (
    <span className="mono rounded-md border border-[var(--color-glass-edge)] bg-[var(--color-surface-2)] px-2 py-0.5 text-[11px] text-text-mid">
      {children}
    </span>
  )
}

function Block({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <p className="eyebrow mb-2">{label}</p>
      <div className="text-text-mid leading-relaxed">{children}</div>
    </div>
  )
}

function Callout({
  children,
  color = 'var(--color-signal-cyan)',
}: {
  children: ReactNode
  color?: string
}) {
  return (
    <div
      className="rounded-lg border-l-2 px-4 py-3 text-sm text-text-mid"
      style={{ borderColor: color, background: `${color}10` }}
    >
      {children}
    </div>
  )
}

function Science({ rows }: { rows: [string, string | undefined][] }) {
  return (
    <dl className="mono grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 rounded-lg border border-[var(--color-glass-edge)] bg-[var(--color-void)] p-4 text-xs">
      {rows
        .filter(([, v]) => v)
        .map(([k, v]) => (
          <div key={k} className="contents">
            <dt className="text-text-low">{k}</dt>
            <dd className="text-text-hi break-words">{v}</dd>
          </div>
        ))}
    </dl>
  )
}

/* --------------------------------------------------------- per-kind bodies */
function MonogenicBody({ v }: { v: Variant }) {
  return (
    <>
      <div className="flex flex-wrap gap-2">
        <Chip>{v.condition}</Chip>
        <Chip>{v.inheritance}</Chip>
        <Chip>{v.zygosity}</Chip>
      </div>
      <p className="text-text-hi text-lg leading-relaxed">{v.plain.headline}</p>
      <Block label="// what this means">{v.plain.explainer}</Block>
      <Block label="// a way to picture it">{v.plain.analogy}</Block>
      {v.plain.whatToDo && (
        <Block label="// what to do next">{v.plain.whatToDo}</Block>
      )}
      {v.plain.caveat && (
        <Callout color={SEVERITY[v.severityTier].color}>
          <strong className="text-text-hi">Keep in mind: </strong>
          {v.plain.caveat}
        </Callout>
      )}
      {v.triggers && (
        <Block label="// common triggers (lqt2)">
          <ul className="list-disc space-y-1 pl-5">
            {v.triggers.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        </Block>
      )}
      {v.management && (
        <Block label="// how it's managed">
          <ul className="list-disc space-y-1 pl-5">
            {v.management.map((m) => (
              <li key={m}>{m}</li>
            ))}
          </ul>
        </Block>
      )}
      <Block label="// why it's called pathogenic">
        <AcmgCriteria codes={v.acmgCodes} />
      </Block>
      <Block label="// the science">
        <Science
          rows={[
            ['gene', v.gene],
            ['transcript', v.transcript],
            ['cDNA', v.cdna],
            ['protein', v.protein],
            ['genomic', v.genomicHGVS],
            [
              'locus',
              `chr${v.locus.chromosome}:${v.locus.start.toLocaleString()} · ${v.locus.cytoband ?? ''}`,
            ],
            ['exon', v.locus.exon],
            ['penetrance', v.penetrance ? v.penetrance.level : undefined],
            ['gnomAD', v.external?.gnomad],
            ['ClinVar', v.external?.clinVarId ? `Variation ${v.external.clinVarId}` : undefined],
          ]}
        />
      </Block>
      {v.familialRisk && (
        <Callout>
          <strong className="text-text-hi">Family: </strong>
          {v.familialRisk.note}
        </Callout>
      )}
      {v.external?.clinVarUrl && (
        <a
          href={v.external.clinVarUrl}
          target="_blank"
          rel="noreferrer"
          className="text-signal-blue inline-flex items-center gap-1.5 text-sm hover:underline"
        >
          View on ClinVar <ExternalLink size={13} />
        </a>
      )}
    </>
  )
}

function CarrierBody({ c }: { c: CarrierVariant }) {
  return (
    <>
      <div className="flex flex-wrap gap-2">
        <Chip>{c.conditionCarried}</Chip>
        <Chip>{c.inheritance}</Chip>
        <Chip>{c.mutationType}</Chip>
      </div>
      <p className="text-text-hi text-lg leading-relaxed">{c.plain.headline}</p>
      <Callout color={SEVERITY.carrier.color}>
        <strong className="text-text-hi">Carrier ≠ affected. </strong>
        You’re healthy — this matters only for family planning.
      </Callout>
      <Block label="// what this means">{c.plain.explainer}</Block>
      <Block label="// what the gene does">{c.geneFunction}</Block>
      <Block label="// a way to picture it">{c.plain.analogy}</Block>
      {c.plain.whatToDo && (
        <Block label="// what to do next">{c.plain.whatToDo}</Block>
      )}
      <div className="grid grid-cols-2 gap-3">
        {c.carrierFrequency && (
          <div className="glass p-3">
            <p className="text-text-low mono text-[10px] uppercase tracking-widest">
              Carrier frequency
            </p>
            <p className="text-text-hi mt-1 text-sm">{c.carrierFrequency}</p>
          </div>
        )}
        {c.reproductiveRisk && (
          <div className="glass p-3">
            <p className="text-text-low mono text-[10px] uppercase tracking-widest">
              Reproductive risk
            </p>
            <p className="text-text-hi mt-1 text-sm">{c.reproductiveRisk}</p>
          </div>
        )}
      </div>
      <Block label="// why it's called pathogenic">
        <AcmgCriteria codes={c.acmgCodes} />
      </Block>
      <Block label="// the science">
        <Science
          rows={[
            ['gene', c.gene],
            ['transcript', c.transcript],
            ['cDNA', c.cdna],
            ['protein', c.protein],
            [
              'locus',
              `chr${c.locus.chromosome} · ${c.locus.cytoband ?? ''}`,
            ],
            ['region', c.locus.exon],
          ]}
        />
      </Block>
      {c.plain.caveat && <Callout>{c.plain.caveat}</Callout>}
    </>
  )
}

function PgxBody({ p }: { p: PgxResult }) {
  return (
    <>
      <div className="flex flex-wrap gap-2">
        <Chip>{p.diplotype}</Chip>
        <Chip>{p.phenotype}</Chip>
      </div>
      <p className="text-text-hi text-lg leading-relaxed">{p.plain}</p>
      <Block label="// what this enzyme does">{p.enzymeFunction}</Block>
      {p.highlight && (
        <Callout color={SEVERITY.info.color}>
          <strong className="text-text-hi">Good to know: </strong>
          {p.highlight}
        </Callout>
      )}
      <Block label="// affected medications">
        <ul className="space-y-2">
          {p.affectedDrugs.map((d) => (
            <li
              key={d.name}
              className="rounded-lg border border-[var(--color-glass-edge)] bg-[var(--color-surface-1)] p-3"
            >
              <div className="flex items-center gap-2">
                <span className="mono text-text-hi text-sm">{d.name}</span>
                {d.qtRisk && (
                  <span
                    className="mono rounded px-1.5 py-0.5 text-[10px]"
                    style={{
                      background: 'rgba(213,94,0,0.15)',
                      color: 'var(--color-sev-pathogenic)',
                    }}
                  >
                    ⚠ QT-prolonging
                  </span>
                )}
              </div>
              <p className="text-text-mid mt-1 text-sm">{d.recommendation}</p>
            </li>
          ))}
        </ul>
      </Block>
    </>
  )
}

function NegativeBody({ n }: { n: ScreenedGene }) {
  return (
    <>
      <Chip>{n.condition}</Chip>
      <p className="text-text-hi text-lg leading-relaxed">{n.meaning}</p>
      <Callout color={SEVERITY.reassuring.color}>
        We screened the known risk variant(s) in <strong>{n.gene}</strong> and
        did not find them. Remember: this checks specific variants, not every
        possible cause.
      </Callout>
    </>
  )
}

/* ------------------------------------------------------------- the drawer */
export default function FindingDetailDrawer() {
  const selectedId = useSelection((s) => s.selectedId)
  const select = useSelection((s) => s.select)
  const reduce = useSelection((s) => s.reduceMotion)
  const panelRef = useRef<HTMLDivElement>(null)
  const detail = selectedId ? lookupDetail(selectedId) : null

  // Esc to close + basic focus trap + restore focus on close
  useEffect(() => {
    if (!detail) return
    const prevActive = document.activeElement as HTMLElement | null
    const panel = panelRef.current
    panel?.focus()

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        select(null)
        return
      }
      if (e.key === 'Tab' && panel) {
        const focusable = panel.querySelectorAll<HTMLElement>(
          'a[href], button, [tabindex]:not([tabindex="-1"])',
        )
        if (focusable.length === 0) return
        const first = focusable[0]
        const last = focusable[focusable.length - 1]
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('keydown', onKey)
      prevActive?.focus?.()
    }
  }, [detail, select])

  const dur = reduce ? 0 : 0.4

  let title = ''
  let body: ReactNode = null
  let tier: Parameters<typeof SeverityBadge>[0]['tier'] = 'info'
  if (detail) {
    if (detail.kind === 'monogenic') {
      title = `${detail.data.gene} · ${detail.data.protein ?? detail.data.cdna}`
      tier = detail.data.severityTier
      body = <MonogenicBody v={detail.data} />
    } else if (detail.kind === 'carrier') {
      title = `${detail.data.gene} · carrier`
      tier = detail.data.severityTier
      body = <CarrierBody c={detail.data} />
    } else if (detail.kind === 'pgx') {
      title = detail.data.gene
      tier = 'info'
      body = <PgxBody p={detail.data} />
    } else {
      title = `${detail.data.gene} · screened`
      tier = 'reassuring'
      body = <NegativeBody n={detail.data} />
    }
  }

  return (
    <AnimatePresence>
      {detail && (
        <motion.div
          className="fixed inset-0 z-50 flex justify-end"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: dur }}
        >
          {/* backdrop */}
          <button
            aria-label="Close details"
            className="absolute inset-0 bg-[rgba(7,11,20,0.6)] backdrop-blur-sm"
            onClick={() => select(null)}
          />
          {/* panel */}
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label={title}
            tabIndex={-1}
            data-lenis-prevent
            className="glass relative h-full w-full max-w-md overflow-y-auto rounded-none border-l p-6 outline-none sm:p-8"
            initial={{ x: reduce ? 0 : '100%' }}
            animate={{ x: 0 }}
            exit={{ x: reduce ? 0 : '100%' }}
            transition={{ duration: dur, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <SeverityBadge tier={tier} />
                <h3 className="mono text-text-hi mt-3 text-xl">{title}</h3>
              </div>
              <button
                onClick={() => select(null)}
                aria-label="Close"
                className="text-text-low hover:text-text-hi hover:bg-surface-2 rounded-lg p-2 transition-colors"
              >
                <X size={18} />
              </button>
            </div>
            <div className="mt-6 space-y-6">{body}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
