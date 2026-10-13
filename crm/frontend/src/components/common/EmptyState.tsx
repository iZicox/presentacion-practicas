import type { ReactNode } from 'react'

interface EmptyStateProps {
  title: string
  description?: string
  /** Elemento opcional (por ejemplo, un botón de crear). */
  action?: ReactNode
}

/** Estado vacío compartido por tablas, listas y fichas sin registros. */
export default function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="text-center py-5 px-3">
      <p className="mb-1 fw-semibold">{title}</p>
      {description ? <p className="text-secondary small mb-0">{description}</p> : null}
      {action ? <div className="mt-3">{action}</div> : null}
    </div>
  )
}
