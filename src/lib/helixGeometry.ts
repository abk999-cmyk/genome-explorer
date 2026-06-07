import * as THREE from 'three'

/**
 * Pure geometry math for the double helix. Kept framework-free so it can be
 * unit-reasoned about and so any three.js version churn stays isolated here.
 *
 * The helix runs along the Y axis. Two phase-shifted parametric strands form the
 * sugar-phosphate backbones (rendered as TubeGeometry); evenly sampled points
 * become the base-pair "rungs" (one instanced mesh). Findings get marker slots
 * spread along the strand and pushed slightly outward for legibility.
 */
export interface HelixConfig {
  radius: number
  turns: number
  height: number
  pointsPerTurn: number
  rungEvery: number
}

export const defaultHelix: HelixConfig = {
  radius: 2.2,
  turns: 3,
  height: 10.5,
  pointsPerTurn: 28,
  rungEvery: 2,
}

export interface HelixData {
  curveA: THREE.CatmullRomCurve3
  curveB: THREE.CatmullRomCurve3
  rungs: { a: THREE.Vector3; b: THREE.Vector3 }[]
}

function strandPoint(u: number, cfg: HelixConfig, phase: number): THREE.Vector3 {
  const angle = u * cfg.turns * Math.PI * 2 + phase
  const y = (u - 0.5) * cfg.height
  return new THREE.Vector3(
    Math.cos(angle) * cfg.radius,
    y,
    Math.sin(angle) * cfg.radius,
  )
}

export function buildHelix(cfg: HelixConfig = defaultHelix): HelixData {
  const total = cfg.turns * cfg.pointsPerTurn
  const aPts: THREE.Vector3[] = []
  const bPts: THREE.Vector3[] = []
  for (let i = 0; i <= total; i++) {
    const u = i / total
    aPts.push(strandPoint(u, cfg, 0))
    bPts.push(strandPoint(u, cfg, Math.PI))
  }
  const curveA = new THREE.CatmullRomCurve3(aPts)
  const curveB = new THREE.CatmullRomCurve3(bPts)

  const rungs: { a: THREE.Vector3; b: THREE.Vector3 }[] = []
  for (let i = 0; i <= total; i += cfg.rungEvery) {
    const u = i / total
    rungs.push({ a: strandPoint(u, cfg, 0), b: strandPoint(u, cfg, Math.PI) })
  }
  return { curveA, curveB, rungs }
}

export interface MarkerSlot {
  position: THREE.Vector3
  u: number
}

/** Evenly distribute `count` finding markers along the helix, alternating strands. */
export function markerSlots(
  count: number,
  cfg: HelixConfig = defaultHelix,
): MarkerSlot[] {
  const slots: MarkerSlot[] = []
  for (let i = 0; i < count; i++) {
    // i=0 (the headline / pathogenic finding) sits near the top, most prominent.
    const u = count === 1 ? 0.5 : 0.92 - 0.84 * (i / (count - 1))
    const phase = i % 2 === 0 ? 0 : Math.PI
    const p = strandPoint(u, cfg, phase)
    const outward = new THREE.Vector3(p.x, 0, p.z).normalize().multiplyScalar(0.55)
    slots.push({ position: p.clone().add(outward), u })
  }
  return slots
}
