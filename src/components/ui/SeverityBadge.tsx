import {
  AlertTriangle,
  CheckCircle2,
  FlaskConical,
  ShieldCheck,
  type LucideIcon,
} from 'lucide-react'
import type { SeverityTier } from '../../types/report'
import { SEVERITY, type SeverityIcon } from '../../lib/severity'

const ICONS: Record<SeverityIcon, LucideIcon> = {
  alert: AlertTriangle,
  shield: ShieldCheck,
  check: CheckCircle2,
  flask: FlaskConical,
}

/** The severity icon alone (color + glyph), for inline use. */
export function SeverityGlyph({
  tier,
  size = 16,
}: {
  tier: SeverityTier
  size?: number
}) {
  const Icon = ICONS[SEVERITY[tier].icon]
  return <Icon size={size} className="shrink-0" style={{ color: SEVERITY[tier].color }} />
}

/** Pill badge: color + icon + text label — severity is never color alone. */
export default function SeverityBadge({
  tier,
  label,
}: {
  tier: SeverityTier
  label?: string
}) {
  const meta = SEVERITY[tier]
  const Icon = ICONS[meta.icon]
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold"
      style={{
        borderColor: `${meta.color}66`,
        color: meta.color,
        background: `${meta.color}14`,
      }}
    >
      <Icon size={13} />
      {label ?? meta.label}
    </span>
  )
}
