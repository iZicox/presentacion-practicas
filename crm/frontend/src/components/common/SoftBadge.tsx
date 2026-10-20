import type { ReactNode } from 'react'
import type { BadgeTone } from '../../utils/labels'

interface SoftBadgeProps {
  tone?: BadgeTone
  /** Muestra un punto de color antes del texto. */
  dot?: boolean
  children: ReactNode
}

/** Etiqueta compacta con fondo suave y texto coloreado. */
export default function SoftBadge({ tone = 'slate', dot = false, children }: SoftBadgeProps) {
  return (
    <span className={`b-soft b-${tone}`}>
      {dot ? <span className="dot" /> : null}
      {children}
    </span>
  )
}
