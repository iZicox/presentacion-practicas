import { Link } from 'react-router-dom'

/** Ruta no encontrada. */
export default function NotFoundPage() {
  return (
    <div className="text-center py-5">
      <h1 className="display-5 fw-bold">404</h1>
      <p className="text-secondary mb-4">La página solicitada no existe.</p>
      <Link to="/" className="btn btn-primary">
        Volver al inicio
      </Link>
    </div>
  )
}
