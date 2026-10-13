interface ErrorStateProps {
  message: string
  /** Si se proporciona, muestra un botón para reintentar la carga. */
  onRetry?: () => void
}

/** Estado de error compartido por listados y fichas. */
export default function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div className="alert alert-danger d-flex flex-wrap justify-content-between align-items-center gap-2 mb-0" role="alert">
      <span>{message}</span>
      {onRetry ? (
        <button type="button" className="btn btn-outline-danger btn-sm" onClick={onRetry}>
          Reintentar
        </button>
      ) : null}
    </div>
  )
}
