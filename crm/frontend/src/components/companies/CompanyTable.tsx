import { Link } from 'react-router-dom'
import EmptyState from '../common/EmptyState'
import type { Company } from '../../types'

interface CompanyTableProps {
  companies: Company[]
}

/** Tabla presentacional del listado de empresas. Solo pinta: no pide datos. */
export default function CompanyTable({ companies }: CompanyTableProps) {
  if (companies.length === 0) {
    return (
      <EmptyState
        title="No hay empresas"
        description="Cuando el listado se conecte con D1, aquí aparecerán las empresas registradas."
      />
    )
  }

  return (
    <div className="table-responsive">
      <table className="table table-hover align-middle mb-0">
        <thead className="table-light">
          <tr>
            <th scope="col">Nombre</th>
            <th scope="col">Correo</th>
            <th scope="col">Teléfono</th>
            <th scope="col">Web</th>
            <th scope="col">Creada</th>
          </tr>
        </thead>
        <tbody>
          {companies.map((company) => (
            <tr key={company.ID}>
              <td>
                <Link to={`/companies/${company.ID}`} className="fw-semibold text-decoration-none">
                  {company.NAME}
                </Link>
              </td>
              <td>{company.EMAIL ?? '—'}</td>
              <td>{company.PHONE_NUMBER ?? '—'}</td>
              <td>{company.WEB ?? '—'}</td>
              <td>{company.CREATED_AT}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
