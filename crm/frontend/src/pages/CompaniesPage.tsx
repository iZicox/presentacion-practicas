import { useEffect, useState } from 'react'
import CompanyFormModal from '../components/companies/CompanyFormModal'
import CompanyTable from '../components/companies/CompanyTable'
import EmptyState from '../components/common/EmptyState'
import ErrorState from '../components/common/ErrorState'
import LoadingSpinner from '../components/common/LoadingSpinner'
import PageHeader from '../components/common/PageHeader'
import { IconPlus, IconSearch } from '../components/common/icons'
import { ApiError, api } from '../services/api'
import type { ClientType, Company, Contact, Segment, Status } from '../types'
import { fold } from '../utils/format'

type LoadStatus = 'loading' | 'error' | 'ready'

const PAGE_SIZE = 8

interface CompaniesData {
  companies: Company[]
  segments: Segment[]
  statuses: Status[]
  clientTypes: ClientType[]
  contactsByCompany: Record<number, Contact[]>
}

async function loadCompaniesData(): Promise<CompaniesData> {
  const [companies, segments, statuses, clientTypes] = await Promise.all([
    api.listCompanies(),
    api.listSegments(),
    api.listStatuses(),
    api.listClientTypes(),
  ])
  const contactLists = await Promise.all(
    companies.map((company) => api.listContacts(company.ID)),
  )
  const contactsByCompany: Record<number, Contact[]> = {}
  companies.forEach((company, index) => {
    contactsByCompany[company.ID] = contactLists[index]
  })
  return { companies, segments, statuses, clientTypes, contactsByCompany }
}

/** Listado de empresas con búsqueda, filtros y paginación (en memoria). */
export default function CompaniesPage() {
  const [data, setData] = useState<CompaniesData | null>(null)
  const [status, setStatus] = useState<LoadStatus>('loading')
  const [errorMessage, setErrorMessage] = useState('')
  const [reloadKey, setReloadKey] = useState(0)
  const [feedback, setFeedback] = useState('')

  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [segmentFilter, setSegmentFilter] = useState('')
  const [page, setPage] = useState(1)

  const [modalCompany, setModalCompany] = useState<Company | null | undefined>(undefined)

  useEffect(() => {
    let active = true

    loadCompaniesData()
      .then((loaded) => {
        if (active) {
          setData(loaded)
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

  useEffect(() => {
    if (!feedback) {
      return
    }
    const timer = setTimeout(() => setFeedback(''), 5000)
    return () => clearTimeout(timer)
  }, [feedback])

  const handleRetry = () => {
    setStatus('loading')
    setReloadKey((key) => key + 1)
  }

  const refresh = () => setReloadKey((key) => key + 1)

  const companies = data?.companies ?? []
  const segments = data?.segments ?? []
  const statuses = data?.statuses ?? []
  const clientTypes = data?.clientTypes ?? []
  const contactsByCompany = data?.contactsByCompany ?? {}

  const segmentsById: Record<number, Segment> = {}
  segments.forEach((segment) => {
    segmentsById[segment.ID] = segment
  })
  const statusesById: Record<number, Status> = {}
  statuses.forEach((item) => {
    statusesById[item.ID] = item
  })

  const hasFilters = search.trim() !== '' || statusFilter !== '' || segmentFilter !== ''

  const filtered = companies.filter((company) => {
    if (statusFilter !== '' && String(company.STATUS_ID ?? '') !== statusFilter) {
      return false
    }
    if (segmentFilter !== '' && String(company.SEGMENT_ID ?? '') !== segmentFilter) {
      return false
    }
    const term = fold(search.trim())
    if (!term) {
      return true
    }
    const haystack = fold(
      [company.NAME, company.EMAIL ?? '', company.WEB ?? '', company.PHONE_NUMBER ?? ''].join(' '),
    )
    return haystack.includes(term)
  })

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const visible = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)
  const rangeStart = filtered.length === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1
  const rangeEnd = Math.min(currentPage * PAGE_SIZE, filtered.length)

  const handleSaved = (company: Company) => {
    const wasEditing = modalCompany !== null && modalCompany !== undefined
    setModalCompany(undefined)
    setFeedback(
      `Empresa «${company.NAME}» ${wasEditing ? 'actualizada' : 'creada'} correctamente.`,
    )
    refresh()
  }

  const clearFilters = () => {
    setSearch('')
    setStatusFilter('')
    setSegmentFilter('')
    setPage(1)
  }

  return (
    <>
      <PageHeader
        title="Empresas"
        description="Empresas y leads del CRM, con su clasificación y contacto principal."
        actions={
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => setModalCompany(null)}
          >
            <IconPlus size={16} />
            Nueva empresa
          </button>
        }
      />

      {feedback ? (
        <div className="alert alert-success alert-dismissible d-flex align-items-center" role="alert">
          <span>{feedback}</span>
          <button
            type="button"
            className="btn-close ms-auto"
            aria-label="Cerrar"
            onClick={() => setFeedback('')}
          />
        </div>
      ) : null}

      <div className="card">
        <div className="card-header bg-white py-3">
          <div className="crm-toolbar">
            <div className="input-icon flex-grow-1 toolbar-search">
              <IconSearch size={16} />
              <label className="visually-hidden" htmlFor="companies-search">
                Buscar empresas
              </label>
              <input
                id="companies-search"
                type="search"
                className="form-control"
                placeholder="Buscar por nombre, correo, web o teléfono…"
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value)
                  setPage(1)
                }}
              />
            </div>

            <div>
              <label className="visually-hidden" htmlFor="companies-status-filter">
                Filtrar por estado
              </label>
              <select
                id="companies-status-filter"
                className="form-select"
                value={statusFilter}
                onChange={(event) => {
                  setStatusFilter(event.target.value)
                  setPage(1)
                }}
              >
                <option value="">Todos los estados</option>
                {statuses.map((item) => (
                  <option key={item.ID} value={item.ID}>
                    {item.NAME}
                  </option>
                ))}
                <option value="null">Sin estado</option>
              </select>
            </div>

            <div>
              <label className="visually-hidden" htmlFor="companies-segment-filter">
                Filtrar por segmento
              </label>
              <select
                id="companies-segment-filter"
                className="form-select"
                value={segmentFilter}
                onChange={(event) => {
                  setSegmentFilter(event.target.value)
                  setPage(1)
                }}
              >
                <option value="">Todos los segmentos</option>
                {segments.map((segment) => (
                  <option key={segment.ID} value={segment.ID}>
                    {segment.NAME}
                  </option>
                ))}
                <option value="null">Sin segmento</option>
              </select>
            </div>

            {hasFilters ? (
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={clearFilters}
              >
                Limpiar filtros
              </button>
            ) : null}
          </div>
        </div>

        <div className="card-body p-0">
          {status === 'loading' ? (
            <div className="px-4">
              <LoadingSpinner label="Cargando empresas…" />
            </div>
          ) : null}
          {status === 'error' ? (
            <div className="p-4">
              <ErrorState message={errorMessage} onRetry={handleRetry} />
            </div>
          ) : null}
          {status === 'ready' ? (
            companies.length === 0 ? (
              <EmptyState
                title="Todavía no hay empresas"
                description="Crea la primera empresa para empezar a registrar contactos, interacciones y compras."
                action={
                  <button
                    type="button"
                    className="btn btn-primary btn-sm"
                    onClick={() => setModalCompany(null)}
                  >
                    Crear la primera empresa
                  </button>
                }
              />
            ) : filtered.length === 0 ? (
              <EmptyState
                title="Sin resultados"
                description="No hay empresas que coincidan con la búsqueda o los filtros."
                action={
                  <button type="button" className="btn btn-outline-secondary btn-sm" onClick={clearFilters}>
                    Limpiar filtros
                  </button>
                }
              />
            ) : (
              <CompanyTable
                companies={visible}
                contactsByCompany={contactsByCompany}
                statusesById={statusesById}
                segmentsById={segmentsById}
                onEdit={(company) => setModalCompany(company)}
              />
            )
          ) : null}
        </div>

        {status === 'ready' && filtered.length > 0 ? (
          <div className="card-footer bg-white d-flex flex-wrap justify-content-between align-items-center gap-2">
            <span className="text-secondary small">
              Mostrando {rangeStart}–{rangeEnd} de {filtered.length}{' '}
              {filtered.length === 1 ? 'empresa' : 'empresas'}
            </span>
            {totalPages > 1 ? (
              <div className="btn-group btn-group-sm" role="group" aria-label="Paginación">
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  disabled={currentPage === 1}
                  onClick={() => setPage(currentPage - 1)}
                >
                  Anterior
                </button>
                <span className="btn btn-outline-secondary disabled">
                  Página {currentPage} de {totalPages}
                </span>
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  disabled={currentPage === totalPages}
                  onClick={() => setPage(currentPage + 1)}
                >
                  Siguiente
                </button>
              </div>
            ) : null}
          </div>
        ) : null}
      </div>

      {modalCompany !== undefined ? (
        <CompanyFormModal
          company={modalCompany ?? undefined}
          segments={segments}
          statuses={statuses}
          clientTypes={clientTypes}
          onClose={() => setModalCompany(undefined)}
          onSaved={handleSaved}
        />
      ) : null}
    </>
  )
}
