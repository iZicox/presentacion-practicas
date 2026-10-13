import { useEffect, useState } from 'react'
import CompanyTable from '../components/companies/CompanyTable'
import ErrorState from '../components/common/ErrorState'
import LoadingSpinner from '../components/common/LoadingSpinner'
import PageHeader from '../components/common/PageHeader'
import { ApiError, api } from '../services/api'
import type { Company } from '../types'

type LoadStatus = 'loading' | 'error' | 'ready'

/** Listado de empresas: GET /api/companies. */
export default function CompaniesPage() {
  const [companies, setCompanies] = useState<Company[]>([])
  const [status, setStatus] = useState<LoadStatus>('loading')
  const [errorMessage, setErrorMessage] = useState('')
  // Cambiar este valor vuelve a lanzar la carga (botón "Reintentar").
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    let active = true

    api
      .listCompanies()
      .then((data) => {
        if (active) {
          setCompanies(data)
          setStatus('ready')
        }
      })
      .catch((error: unknown) => {
        if (active) {
          setErrorMessage(
            error instanceof ApiError ? error.message : 'No se pudo cargar el listado de empresas.',
          )
          setStatus('error')
        }
      })

    return () => {
      active = false
    }
  }, [reloadKey])

  const handleRetry = () => {
    setStatus('loading')
    setReloadKey((key) => key + 1)
  }

  return (
    <>
      <PageHeader
        title="Empresas"
        description="Listado de empresas y leads del CRM."
        actions={
          <button type="button" className="btn btn-primary" disabled>
            Nueva empresa
          </button>
        }
      />

      <div className="card">
        <div className="card-body">
          {status === 'loading' ? <LoadingSpinner label="Cargando empresas…" /> : null}
          {status === 'error' ? (
            <ErrorState message={errorMessage} onRetry={handleRetry} />
          ) : null}
          {status === 'ready' ? <CompanyTable companies={companies} /> : null}
        </div>
      </div>
    </>
  )
}
