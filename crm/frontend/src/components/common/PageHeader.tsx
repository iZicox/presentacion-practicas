import type { ReactNode } from 'react'

interface PageHeaderProps {
  title: string
  description?: string
  /** Botones o acciones de la página (a la derecha). */
  actions?: ReactNode
}

/** Cabecera estándar de todas las páginas: título, descripción y acciones. */
export default function PageHeader({ title, description, actions }: PageHeaderProps) {
  return (
    <div className="d-flex flex-wrap justify-content-between align-items-start gap-2 mb-4">
      <div>
        <h1 className="h3 mb-1">{title}</h1>
        {description ? <p className="text-secondary mb-0">{description}</p> : null}
      </div>
      {actions ? <div className="d-flex gap-2">{actions}</div> : null}
    </div>
  )
}
