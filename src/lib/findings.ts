import { report } from '../data/report'
import type { Finding, GenomeReport } from '../types/report'

/**
 * Flatten every finding type into one normalized `Finding[]` so a single mapper
 * can place them on the helix and the ideogram, and the detail drawer can look
 * any of them up by id. Order matters: it drives the helix slot order
 * (pathogenic first → carriers → pharmacogenomics → reassuring negatives).
 */
export function getFindings(r: GenomeReport = report): Finding[] {
  const monogenic: Finding[] = r.variants.map((v) => ({
    id: v.id,
    kind: 'monogenic',
    gene: v.gene,
    label: v.gene,
    detail: v.condition,
    severityTier: v.severityTier,
    locus: v.locus,
  }))

  const carriers: Finding[] = r.carrierVariants.map((c) => ({
    id: c.id,
    kind: 'carrier',
    gene: c.gene,
    label: c.gene,
    detail: `Carrier · ${c.conditionCarried}`,
    severityTier: c.severityTier,
    locus: c.locus,
  }))

  const pgx: Finding[] = r.pharmacogenomics.map((p) => ({
    id: p.id,
    kind: 'pgx',
    gene: p.gene,
    label: p.gene,
    detail: p.phenotype,
    severityTier: 'info',
    locus: p.locus,
  }))

  const negatives: Finding[] = r.screenedNegative.genesScreened.map((g) => ({
    id: `neg-${g.gene}`,
    kind: 'negative',
    gene: g.gene,
    label: g.gene,
    detail: `Screened · ${g.condition}`,
    severityTier: 'reassuring',
    locus: g.locus,
  }))

  return [...monogenic, ...carriers, ...pgx, ...negatives]
}

/** Look up the full record (with all plain-language fields) behind a finding id. */
export function lookupDetail(id: string, r: GenomeReport = report) {
  const v = r.variants.find((x) => x.id === id)
  if (v) return { kind: 'monogenic' as const, data: v }
  const c = r.carrierVariants.find((x) => x.id === id)
  if (c) return { kind: 'carrier' as const, data: c }
  const p = r.pharmacogenomics.find((x) => x.id === id)
  if (p) return { kind: 'pgx' as const, data: p }
  const neg = r.screenedNegative.genesScreened.find((x) => `neg-${x.gene}` === id)
  if (neg) return { kind: 'negative' as const, data: neg }
  return null
}
