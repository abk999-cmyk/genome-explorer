import { genomeReportSchema, type GenomeReport } from '../types/report'

/**
 * Parse + validate raw report data against the schema. Throws a readable error
 * if a report is missing required fields — so dropping in a new report fails
 * loudly at startup instead of rendering half a page.
 */
export function validateReport(data: unknown): GenomeReport {
  const result = genomeReportSchema.safeParse(data)
  if (!result.success) {
    console.error('[report] validation failed:', result.error.issues)
    throw new Error(
      `Report failed schema validation: ${result.error.issues
        .map((i) => `${i.path.join('.')} — ${i.message}`)
        .join('; ')}`,
    )
  }
  return result.data
}
