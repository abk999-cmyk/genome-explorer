import { motion, useInView } from 'framer-motion'
import { useRef, type ReactNode } from 'react'
import { useSelection } from '../../store/selectionStore'

/**
 * Scroll-into-view fade+rise. One signature reveal used across sections; under
 * reduced motion it renders statically (no transform, no transition).
 */
export default function Reveal({
  children,
  delay = 0,
  y = 24,
  className,
  as = 'div',
}: {
  children: ReactNode
  delay?: number
  y?: number
  className?: string
  as?: 'div' | 'li' | 'section'
}) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-10%' })
  const reduce = useSelection((s) => s.reduceMotion)
  const MotionTag = motion[as]

  if (reduce) {
    const Tag = as
    return (
      <Tag ref={ref} className={className}>
        {children}
      </Tag>
    )
  }

  return (
    <MotionTag
      ref={ref}
      className={className}
      initial={{ opacity: 0, y }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay }}
    >
      {children}
    </MotionTag>
  )
}
