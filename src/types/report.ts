/**
 * The data contract for a genome report.
 *
 * Defined with Zod so we get (a) author-time TypeScript types via z.infer and
 * (b) a runtime guard (`validateReport`) — meaning any future report can drop in
 * as data and be checked against this same schema. The whole UI consumes these
 * shapes; nothing reads the PDF directly.
 */
import { z } from 'zod'

/* ------------------------------------------------------------------ enums --- */

export const severityTierSchema = z.enum([
  'critical', // pathogenic, actionable — red
  'carrier', // recessive carrier — amber
  'reassuring', // screened & not found — green
  'info', // pharmacogenomic / informational — blue
])
export type SeverityTier = z.infer<typeof severityTierSchema>

export const zygositySchema = z.enum(['Heterozygous', 'Homozygous', 'Hemizygous'])
export const inheritanceSchema = z.enum([
  'Autosomal Dominant',
  'Autosomal Recessive',
  'X-linked',
  'Mitochondrial',
])
export const classificationSchema = z.enum([
  'Pathogenic',
  'Likely Pathogenic',
  'Uncertain Significance',
  'Likely Benign',
  'Benign',
])
export const actionabilitySchema = z.enum(['high', 'moderate', 'informational'])
export const acmgStrengthSchema = z.enum([
  'Very Strong',
  'Strong',
  'Moderate',
  'Supporting',
])

/* --------------------------------------------------------------- building --- */

export const genomicLocusSchema = z.object({
  chromosome: z.string(), // '7', '17', '10', 'X' …
  start: z.number(), // 1-based genomic position (GRCh38)
  stop: z.number(),
  cytoband: z.string().optional(), // e.g. '7q36.1'
  exon: z.string().optional(), // e.g. 'exon 9 (coding exon 7)'
  strand: z.enum(['+', '-']).optional(),
})
export type GenomicLocus = z.infer<typeof genomicLocusSchema>

export const plainLanguageSchema = z.object({
  headline: z.string(), // one-line "what this means for you"
  explainer: z.string(), // 2–4 accurate sentences
  analogy: z.string(), // vivid layperson analogy
  whatToDo: z.string().optional(),
  caveat: z.string().optional(),
})
export type PlainLanguage = z.infer<typeof plainLanguageSchema>

export const acmgCodeSchema = z.object({
  code: z.string(), // 'PS3', 'PM1', 'PVS1' …
  strength: acmgStrengthSchema,
  meaning: z.string(), // plain-English meaning
})
export type AcmgCode = z.infer<typeof acmgCodeSchema>

export const externalRefsSchema = z.object({
  clinVarId: z.string().optional(),
  clinVarUrl: z.string().optional(),
  gnomad: z.string().optional(),
  geneCardUrl: z.string().optional(),
  pmids: z.array(z.string()).optional(),
})
export type ExternalRefs = z.infer<typeof externalRefsSchema>

/* ---------------------------------------------------------------- records --- */

/** Monogenic disease finding (the headline). */
export const variantSchema = z.object({
  id: z.string(),
  gene: z.string(),
  transcript: z.string(),
  cdna: z.string(), // c.1841C>T
  protein: z.string().optional(), // p.Ala614Val
  genomicHGVS: z.string().optional(), // g.150951552G>A
  locus: genomicLocusSchema,
  zygosity: zygositySchema,
  classification: classificationSchema,
  condition: z.string(),
  inheritance: inheritanceSchema,
  penetrance: z
    .object({ level: z.string(), note: z.string().optional() })
    .optional(),
  mechanism: z.string(), // accurate molecular mechanism, plain
  acmgCodes: z.array(acmgCodeSchema),
  severityTier: severityTierSchema,
  plain: plainLanguageSchema,
  external: externalRefsSchema.optional(),
  triggers: z.array(z.string()).optional(),
  management: z.array(z.string()).optional(),
  familialRisk: z
    .object({ relativeRisk: z.string(), note: z.string().optional() })
    .optional(),
  prevalence: z.string().optional(),
})
export type Variant = z.infer<typeof variantSchema>

/** Autosomal-recessive carrier finding (carrier ≠ affected). */
export const carrierVariantSchema = z.object({
  id: z.string(),
  gene: z.string(),
  transcript: z.string(),
  cdna: z.string(),
  protein: z.string().optional(),
  locus: genomicLocusSchema,
  zygosity: zygositySchema,
  classification: classificationSchema,
  conditionCarried: z.string(),
  inheritance: inheritanceSchema,
  mutationType: z.string(), // 'frameshift' | 'nonsense' | 'canonical splice donor'
  geneFunction: z.string(), // what the gene normally does
  acmgCodes: z.array(acmgCodeSchema),
  severityTier: severityTierSchema, // 'carrier'
  plain: plainLanguageSchema,
  carrierFrequency: z.string().optional(),
  reproductiveRisk: z.string().optional(),
  external: externalRefsSchema.optional(),
})
export type CarrierVariant = z.infer<typeof carrierVariantSchema>

/** Pharmacogenomic result. */
export const affectedDrugSchema = z.object({
  name: z.string(),
  recommendation: z.string(),
  qtRisk: z.boolean().optional(), // also a QT-prolonging drug → cross-flag
})
export const pgxResultSchema = z.object({
  id: z.string(),
  gene: z.string(),
  diplotype: z.string(),
  phenotype: z.string(),
  enzymeFunction: z.string(),
  plain: z.string(),
  affectedDrugs: z.array(affectedDrugSchema),
  actionability: actionabilitySchema,
  highlight: z.string().optional(), // counterintuitive note (e.g. CYP3A5/tacrolimus)
  locus: genomicLocusSchema.optional(),
})
export type PgxResult = z.infer<typeof pgxResultSchema>

/** A gene that was screened but in which nothing reportable was found. */
export const screenedGeneSchema = z.object({
  gene: z.string(),
  condition: z.string(),
  meaning: z.string(),
  locus: genomicLocusSchema.optional(),
})
export type ScreenedGene = z.infer<typeof screenedGeneSchema>

export const negativePanelSchema = z.object({
  genesScreened: z.array(screenedGeneSchema),
  limitations: z.string(),
})
export type NegativePanel = z.infer<typeof negativePanelSchema>

/** QT-drug safety cross-link, driven by the LQT2 finding. */
export const qtSafetySchema = z.object({
  intro: z.string(),
  categories: z.array(
    z.object({ category: z.string(), examples: z.array(z.string()) }),
  ),
  doubleFlagged: z.array(z.string()),
  resourceLabel: z.string(),
  resourceUrl: z.string(),
})
export type QtSafety = z.infer<typeof qtSafetySchema>

export const glossaryTermSchema = z.object({
  term: z.string(),
  definition: z.string(),
  analogy: z.string().optional(),
})
export type GlossaryTerm = z.infer<typeof glossaryTermSchema>

export const reportMetaSchema = z.object({
  reportType: z.string(),
  genomeBuild: z.enum(['GRCh38', 'GRCh37', 'hg38', 'hg19']),
  specimen: z.string().optional(),
  summaryStatement: z.string(),
  coverageSummary: z.string(),
  methodology: z.string(),
  stats: z.object({
    genesAnalyzed: z.number(),
    variantsReviewed: z.number(),
    findings: z.number(),
  }),
})
export type ReportMeta = z.infer<typeof reportMetaSchema>

export const genomeReportSchema = z.object({
  schemaVersion: z.string(),
  meta: reportMetaSchema,
  variants: z.array(variantSchema),
  carrierVariants: z.array(carrierVariantSchema),
  pharmacogenomics: z.array(pgxResultSchema),
  screenedNegative: negativePanelSchema,
  qtSafety: qtSafetySchema,
  glossary: z.array(glossaryTermSchema),
  disclaimers: z.array(z.string()),
})
export type GenomeReport = z.infer<typeof genomeReportSchema>

/* ------------------------------------------------- unified finding (helix) --- */

/** A normalized marker any finding type can produce, for the helix + ideogram. */
export interface Finding {
  id: string
  kind: 'monogenic' | 'carrier' | 'pgx' | 'negative'
  gene: string
  label: string // short label for the marker (gene)
  detail: string // one-liner
  severityTier: SeverityTier
  locus?: GenomicLocus
}
