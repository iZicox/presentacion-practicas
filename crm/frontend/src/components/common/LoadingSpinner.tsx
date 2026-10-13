interface LoadingSpinnerProps {
  label?: string
}

/** Estado de carga compartido por listados y fichas. */
export default function LoadingSpinner({ label = 'Cargando…' }: LoadingSpinnerProps) {
  return (
    <div className="d-flex align-items-center gap-2 py-4" role="status">
      <span className="spinner-border spinner-border-sm" aria-hidden="true"></span>
      <span className="text-secondary">{label}</span>
    </div>
  )
}
