import { create } from 'zustand'

/**
 * The tiny shared brain that keeps the 3D helix, the chromosome ideogram, the
 * finding list, and the detail drawer in sync. Selecting a finding anywhere
 * lights it up everywhere. Also holds the motion preference.
 */
function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined' || !window.matchMedia) return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

interface SelectionState {
  /** finding id opened in the detail drawer (null = closed) */
  selectedId: string | null
  /** finding id under the cursor / keyboard focus (helix + list) */
  hoveredId: string | null
  select: (id: string | null) => void
  hover: (id: string | null) => void

  /** user/OS motion preference; gates 3D effects + scroll animation */
  reduceMotion: boolean
  setReduceMotion: (v: boolean) => void
  toggleReduceMotion: () => void
}

export const useSelection = create<SelectionState>((set) => ({
  selectedId: null,
  hoveredId: null,
  select: (id) => set({ selectedId: id }),
  hover: (id) => set({ hoveredId: id }),

  reduceMotion: prefersReducedMotion(),
  setReduceMotion: (v) => set({ reduceMotion: v }),
  toggleReduceMotion: () => set((s) => ({ reduceMotion: !s.reduceMotion })),
}))
