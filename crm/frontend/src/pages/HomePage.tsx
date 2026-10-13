import { Link } from 'react-router-dom'
import PageHeader from '../components/common/PageHeader'

const SECTIONS = [
  {
    to: '/companies',
    title: 'Empresas',
    description:
      'Consulta y crea empresas, y revisa sus contactos, interacciones y compras desde su ficha.',
  },
]

/** Panel de inicio con accesos a las principales secciones. */
export default function HomePage() {
  return (
    <>
      <PageHeader title="Inicio" description="Bienvenido al CRM interno." />

      <div className="row g-3">
        {SECTIONS.map((section) => (
          <div className="col-12 col-md-6 col-xl-4" key={section.title}>
            <div className="card h-100">
              <div className="card-body d-flex flex-column">
                <h2 className="h5 card-title">{section.title}</h2>
                <p className="card-text text-secondary">{section.description}</p>
                <Link
                  to={section.to}
                  className="btn btn-primary mt-auto align-self-start"
                >
                  Ir a empresas
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}
