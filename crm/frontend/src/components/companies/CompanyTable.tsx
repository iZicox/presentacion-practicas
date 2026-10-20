import { Link } from 'react-router-dom'
import type { Company, Contact, Segment, Status } from '../../types'
import { formatDate } from '../../utils/format'
import { statusTone } from '../../utils/labels'
import Avatar from '../common/Avatar'
import SoftBadge from '../common/SoftBadge'
import { IconEdit } from '../common/icons'

interface CompanyTableProps {
  companies: Company[]
  contactsByCompany: Record<number, Contact[]>
  statusesById: Record<number, Status>
  segmentsById: Record<number, Segment>
  onEdit: (company: Company) => void
}

/** Tabla presentacional del listado de empresas. Solo pinta: no pide datos. */
export default function CompanyTable({
  companies,
  contactsByCompany,
  statusesById,
  segmentsById,
  onEdit,
}: CompanyTableProps) {
  return (
    <div className="table-responsive">
      <table className="table table-hover align-middle">
        <thead>
          <tr>
            <th scope="col">Empresa</th>
            <th scope="col">Estado</th>
            <th scope="col">Segmento</th>
            <th scope="col">Contacto</th>
            <th scope="col">Teléfono</th>
            <th scope="col">Alta</th>
            <th scope="col" className="text-end">
              <span className="visually-hidden">Acciones</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {companies.map((company) => {
            const status = company.STATUS_ID !== null ? statusesById[company.STATUS_ID] : undefined
            const segment = company.SEGMENT_ID !== null ? segmentsById[company.SEGMENT_ID] : undefined
            const primaryContact = contactsByCompany[company.ID]?.[0]

            return (
              <tr key={company.ID}>
                <td>
                  <div className="d-flex align-items-center gap-3">
                    <Avatar name={company.NAME} />
                    <div className="min-w-0">
                      <Link
                        to={`/companies/${company.ID}`}
                        className="row-title text-decoration-none"
                      >
                        {company.NAME}
                      </Link>
                      {company.EMAIL ? <div className="row-sub">{company.EMAIL}</div> : null}
                    </div>
                  </div>
                </td>
                <td>
                  {status ? (
                    <SoftBadge tone={statusTone(status.NAME)} dot>
                      {status.NAME}
                    </SoftBadge>
                  ) : (
                    <SoftBadge tone="slate">Sin estado</SoftBadge>
                  )}
                </td>
                <td className="text-secondary">{segment ? segment.NAME : '—'}</td>
                <td>
                  {primaryContact ? (
                    `${primaryContact.FIRST_NAME} ${primaryContact.LAST_NAME}`
                  ) : (
                    <span className="text-secondary">—</span>
                  )}
                </td>
                <td className="text-secondary">{company.PHONE_NUMBER ?? '—'}</td>
                <td className="text-secondary">{formatDate(company.CREATED_AT)}</td>
                <td className="text-end">
                  <button
                    type="button"
                    className="btn-icon"
                    aria-label={`Editar ${company.NAME}`}
                    onClick={() => onEdit(company)}
                  >
                    <IconEdit size={16} />
                  </button>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
