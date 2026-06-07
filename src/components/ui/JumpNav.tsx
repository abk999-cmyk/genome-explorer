import { useEffect, useState } from 'react'

/**
 * A slim right-rail of severity-colored dots — a glance tells you where the
 * red / amber / blue / green findings live, and click jumps there.
 */
const SECTIONS = [
  { id: 'hero', label: 'Top', color: 'var(--color-signal-cyan)' },
  { id: 'headline', label: 'Headline finding', color: 'var(--color-sev-pathogenic)' },
  { id: 'explorer', label: 'DNA explorer', color: 'var(--color-signal-cyan)' },
  { id: 'carrier', label: 'Carrier status', color: 'var(--color-sev-carrier)' },
  { id: 'pharmaco', label: 'Medications', color: 'var(--color-sev-info)' },
  { id: 'negatives', label: 'Reassuring', color: 'var(--color-sev-clear)' },
  { id: 'action', label: 'Next steps', color: 'var(--color-signal-cyan)' },
]

export default function JumpNav() {
  const [active, setActive] = useState('hero')

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id)
        })
      },
      { rootMargin: '-45% 0px -45% 0px' },
    )
    SECTIONS.forEach((s) => {
      const el = document.getElementById(s.id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [])

  return (
    <nav
      aria-label="Section navigation"
      className="fixed right-5 top-1/2 z-30 hidden -translate-y-1/2 flex-col gap-3 lg:flex"
    >
      {SECTIONS.map((s) => {
        const isActive = active === s.id
        return (
          <a
            key={s.id}
            href={`#${s.id}`}
            aria-label={s.label}
            aria-current={isActive ? 'true' : undefined}
            className="group relative flex items-center justify-end"
          >
            <span className="text-text-mid mono pointer-events-none absolute right-6 whitespace-nowrap rounded-md bg-[rgba(7,11,20,0.85)] px-2 py-1 text-[11px] opacity-0 transition-opacity group-hover:opacity-100">
              {s.label}
            </span>
            <span
              className="block rounded-full transition-all duration-300"
              style={{
                width: isActive ? 12 : 8,
                height: isActive ? 12 : 8,
                background: isActive ? s.color : 'var(--color-surface-2)',
                boxShadow: isActive ? `0 0 10px ${s.color}` : 'none',
                border: `1px solid ${isActive ? s.color : 'var(--color-glass-edge)'}`,
              }}
            />
          </a>
        )
      })}
    </nav>
  )
}
