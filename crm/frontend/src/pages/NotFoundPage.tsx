import { Link } from 'react-router-dom'

/** Ruta no encontrada. */
export default function NotFoundPage() {
  return (
    <div className="card">
      <div className="card-body text-center py-5">
        <p className="display-5 fw-bold mb-1">404</p>
        <p className="text-secondary mb-4">La página solicitada no existe.</p>
        <Link to="/" className="btn btn-primary">
          Volver al inicio
        </Link>
      </div>
    </div>
  )
}
