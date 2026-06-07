import { useEffect } from 'react'
import Lenis from 'lenis'
import { useSelection } from '../store/selectionStore'

/**
 * Lenis smooth scroll + smooth anchor navigation (jump-nav, scroll cues).
 * Disabled entirely under reduced motion.
 */
export default function SmoothScroll() {
  const reduce = useSelection((s) => s.reduceMotion)

  useEffect(() => {
    if (reduce) return
    const lenis = new Lenis({ duration: 1.1, smoothWheel: true })
    let raf = 0
    const loop = (t: number) => {
      lenis.raf(t)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)

    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element).closest('a[href^="#"]') as
        | HTMLAnchorElement
        | null
      if (!a) return
      const id = a.getAttribute('href')!.slice(1)
      const el = document.getElementById(id)
      if (el) {
        e.preventDefault()
        lenis.scrollTo(el)
      }
    }
    document.addEventListener('click', onClick)

    return () => {
      document.removeEventListener('click', onClick)
      lenis.destroy()
      cancelAnimationFrame(raf)
    }
  }, [reduce])

  return null
}
