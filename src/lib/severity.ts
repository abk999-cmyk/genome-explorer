import type { SeverityTier } from '../types/report'

/**
 * Single source of truth for severity → color/label/icon. Every surface (helix
 * material, ideogram annotation, badges, legend, jump-nav dots) reads from here
 * so they can never visually drift apart. Color is NEVER the only signal — each
 * tier always pairs with an icon + text label (CVD-safe, Okabe-Ito hues).
 */
export type SeverityIcon = 'alert' | 'shield' | 'check' | 'flask'

export interface SeverityMeta {
  color: string // hex, usable by three.js / ideogram / CSS alike
  label: string
  icon: SeverityIcon
  short: string
}

export const SEVERITY: Record<SeverityTier, SeverityMeta> = {
  critical: {
    color: '#d55e00',
    label: 'Action recommended',
    short: 'Action',
    icon: 'alert',
  },
  carrier: {
    color: '#e69f00',
    label: 'Carrier',
    short: 'Carrier',
    icon: 'shield',
  },
  reassuring: {
    color: '#009e73',
    label: 'Not detected',
    short: 'Clear',
    icon: 'check',
  },
  info: {
    color: '#56b4e9',
    label: 'For your info',
    short: 'Info',
    icon: 'flask',
  },
}

export const SIGNAL_CYAN = '#3df0e6'

export function severityColor(tier: SeverityTier): string {
  return SEVERITY[tier].color
}
