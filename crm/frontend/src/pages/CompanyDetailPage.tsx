import { useParams } from 'react-router-dom'
import EmptyState from '../components/common/EmptyState'
import PageHeader from '../components/common/PageHeader'

const SECTIONS = [
  {
    title: 'Contactos',
    stage: 'Etapa 5',
    description: 'Personas de contacto de la empresa.',
  },
  {
    title: 'Interacciones',
    stage: 'Etapa 6',
    description: 'Historial de seguimiento comercial.',
  },
  {
    title: 'Compras',
    stage: 'Etapa 7',
    description: 'Fechas e importes de cada compra.',
  },
]

/** Etapa 4: ficha de empresa con contactos, interacciones y compras. */
export default function CompanyDetailPage() {
  const { id } = useParams()

  return (
    <>
      <PageHeader
        title="Ficha de empresa"
        description={`Empresa con identificador ${id ?? '—'}.`}
      />

      <div className="alert alert-info small" role="alert">
        La carga y edición de datos se conectará con el backend en la Etapa 4.
      </div>

      <div className="row g-3">
        {SECTIONS.map((section) => (
          <div className="col-12 col-lg-4" key={section.title}>
            <div className="card h-100">
              <div className="card-header bg-white d-flex justify-content-between align-items-center">
                <span className="fw-semibold">{section.title}</span>
                <span className="badge text-bg-light">{section.stage}</span>
              </div>
              <div className="card-body">
                <p className="text-secondary small">{section.description}</p>
                <EmptyState title="Sin registros" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}
