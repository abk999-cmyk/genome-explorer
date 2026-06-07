import { useEffect } from 'react'
import { Zap, ZapOff } from 'lucide-react'
import { useSelection } from '../../store/selectionStore'

/**
 * Visible motion toggle. Keeps the global `.reduce-motion` class in sync with the
 * store so CSS animations are disabled too (belt-and-suspenders with the JS gates).
 */
export default function MotionToggle() {
  const reduce = useSelection((s) => s.reduceMotion)
  const toggle = useSelection((s) => s.toggleReduceMotion)

  useEffect(() => {
    document.documentElement.classList.toggle('reduce-motion', reduce)
  }, [reduce])

  return (
    <button
      onClick={toggle}
      aria-pressed={reduce}
      title={reduce ? 'Enable motion' : 'Reduce motion'}
      aria-label={reduce ? 'Enable motion' : 'Reduce motion'}
      className="glass text-text-mid hover:text-text-hi fixed right-4 top-4 z-40 flex items-center gap-2 rounded-full px-3 py-2 text-xs"
    >
      {reduce ? <ZapOff size={15} /> : <Zap size={15} />}
      <span className="mono hidden sm:inline">{reduce ? 'Motion off' : 'Motion on'}</span>
    </button>
  )
}
