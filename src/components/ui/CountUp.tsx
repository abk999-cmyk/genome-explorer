import { useEffect, useRef, useState } from 'react'
import { useInView } from 'framer-motion'
import { useSelection } from '../../store/selectionStore'

/**
 * Counts up to `value` when scrolled into view. Jumps straight to the final
 * value under reduced motion. (Uses performance.now, not Date.now.)
 */
export default function CountUp({
  value,
  format,
}: {
  value: number
  format?: (n: number) => string
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-15%' })
  const reduce = useSelection((s) => s.reduceMotion)
  const [n, setN] = useState(0)

  useEffect(() => {
    if (!inView) return
    if (reduce) {
      setN(value)
      return
    }
    let raf = 0
    const start = performance.now()
    const dur = 1400
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / dur)
      const eased = 1 - Math.pow(1 - p, 3)
      setN(value * eased)
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [inView, value, reduce])

  const display = format
    ? format(Math.round(n))
    : Math.round(n).toLocaleString()
  return <span ref={ref}>{display}</span>
}
