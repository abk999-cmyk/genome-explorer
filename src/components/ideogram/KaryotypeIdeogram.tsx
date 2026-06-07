import { useEffect, useRef } from 'react'
import Ideogram from 'ideogram'
import { getFindings } from '../../lib/findings'
import { SEVERITY } from '../../lib/severity'
import { useSelection } from '../../store/selectionStore'

/**
 * The accuracy anchor: a real, coordinate-correct chromosome ideogram (GRCh38)
 * showing exactly WHERE each variant sits. Only findings with genomic loci are
 * plotted (the monogenic + carrier variants).
 *
 * Selection is wired both ways:
 *  - ideogram → store: event delegation on the container maps a clicked
 *    annotation's deterministic id (`_c{chrom}_a{annot}`) back to the finding.
 *  - store → ideogram: a `.annot-selected` class is toggled on the matching
 *    element so the helix / list / drawer and the ideogram stay in sync.
 */
const CONTAINER_ID = 'genome-ideogram'

const located = getFindings().filter((f) => f.locus)
const CHROMS = Array.from(new Set(located.map((f) => f.locus!.chromosome))).sort(
  (a, b) => Number(a) - Number(b),
)

// Map ideogram's deterministic element ids <-> our finding ids.
const elemIdToFinding: Record<string, string> = {}
const findingToElemId: Record<string, string> = {}
{
  const perChrom: Record<string, number> = {}
  located.forEach((f) => {
    const chrom = f.locus!.chromosome
    const ci = CHROMS.indexOf(chrom)
    const ai = perChrom[chrom] ?? 0
    perChrom[chrom] = ai + 1
    const eid = `_c${ci}_a${ai}`
    elemIdToFinding[eid] = f.id
    findingToElemId[f.id] = eid
  })
}

const annotations = located.map((f) => ({
  name: f.gene,
  chr: f.locus!.chromosome,
  start: f.locus!.start,
  stop: f.locus!.stop,
  color: SEVERITY[f.severityTier].color,
  shape: 'triangle',
}))

export default function KaryotypeIdeogram() {
  const containerRef = useRef<HTMLDivElement>(null)
  const select = useSelection((s) => s.select)
  const selectedId = useSelection((s) => s.selectedId)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    el.innerHTML = '' // guard StrictMode double-mount

    new Ideogram({
      organism: 'human',
      assembly: 'GRCh38',
      container: `#${CONTAINER_ID}`,
      chromosomes: CHROMS,
      orientation: 'vertical',
      chrHeight: 280,
      chrMargin: 8,
      chrWidth: 9,
      showBandLabels: false,
      showChromosomeLabels: true,
      rotatable: false,
      annotationHeight: 7,
      annotations,
    })

    // event delegation: reliable click→select regardless of draw timing
    const onClick = (e: MouseEvent) => {
      const g = (e.target as Element).closest('.annot') as Element | null
      if (g?.id && elemIdToFinding[g.id]) select(elemIdToFinding[g.id])
    }
    el.addEventListener('click', onClick)

    return () => {
      el.removeEventListener('click', onClick)
      el.innerHTML = ''
    }
  }, [select])

  // store → ideogram: highlight the selected variant's tick
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    el.querySelectorAll('.annot-selected').forEach((n) =>
      n.classList.remove('annot-selected'),
    )
    if (selectedId && findingToElemId[selectedId]) {
      el.querySelector(`#${findingToElemId[selectedId]}`)?.classList.add(
        'annot-selected',
      )
    }
  }, [selectedId])

  return (
    <div className="ideogram-dark">
      <div id={CONTAINER_ID} ref={containerRef} />
    </div>
  )
}
