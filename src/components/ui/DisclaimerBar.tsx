import { useState } from 'react'
import { Info, X } from 'lucide-react'

/**
 * Persistent, quiet educational disclaimer. Always reachable: it collapses to a
 * small pill rather than disappearing, so the "not medical advice" message is
 * never permanently dismissed.
 */
export default function DisclaimerBar() {
  const [open, setOpen] = useState(true)

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="glass text-text-low hover:text-text-hi fixed bottom-4 left-4 z-40 flex items-center gap-2 rounded-full px-3 py-2 text-xs"
        aria-label="Show disclaimer"
      >
        <Info size={14} /> Educational only
      </button>
    )
  }

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-[var(--color-glass-edge)] bg-[rgba(7,11,20,0.85)] backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-2.5">
        <Info size={15} className="text-signal-cyan shrink-0" />
        <p className="text-text-low text-xs leading-snug">
          Educational visualization of a synthetic demonstration report —{' '}
          <span className="text-text-mid">
            not medical advice, a diagnosis, or a clinical result.
          </span>{' '}
          Consult a qualified clinician or genetic counselor.
        </p>
        <button
          onClick={() => setOpen(false)}
          aria-label="Collapse disclaimer"
          className="text-text-low hover:text-text-hi ml-auto shrink-0 rounded p-1"
        >
          <X size={15} />
        </button>
      </div>
    </div>
  )
}
