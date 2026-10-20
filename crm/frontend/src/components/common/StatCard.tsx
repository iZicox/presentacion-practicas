import type { ReactNode } from 'react'

interface StatCardProps {
  label: string
  value: string
  /** Texto secundario bajo el valor. */
  hint?: string
  icon?: ReactNode
  tone?: 'indigo' | 'green' | 'amber' | 'violet'
}

/** Tarjeta de indicador: etiqueta, valor grande, pista y icono. */
export default function StatCard({ label, value, hint, icon, tone = 'indigo' }: StatCardProps) {
  return (
    <div className="card stat-card h-100">
      <div className="card-body d-flex align-items-start gap-3">
        <div className="flex-grow-1 min-w-0">
          <div className="stat-label">{label}</div>
          <div className="stat-value">{value}</div>
          {hint ? <div className="stat-hint">{hint}</div> : null}
        </div>
        {icon ? <span className={`stat-icon tone-${tone}`}>{icon}</span> : null}
      </div>
    </div>
  )
}
