import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import CompanyFormModal from '../components/companies/CompanyFormModal'
import ContactFormModal from '../components/contacts/ContactFormModal'
import ContactList from '../components/contacts/ContactList'
import EmptyState from '../components/common/EmptyState'
import ErrorState from '../components/common/ErrorState'
import LoadingSpinner from '../components/common/LoadingSpinner'
import SoftBadge from '../components/common/SoftBadge'
import StatCard from '../components/common/StatCard'
import Tabs from '../components/common/Tabs'
import Avatar from '../components/common/Avatar'
import { IconArrowLeft, IconCalendar, IconCart, IconChart, IconEdit, IconEuro, IconGlobe, IconMail, IconPhone } from '../components/common/icons'
import InteractionFormModal from '../components/interactions/InteractionFormModal'
import InteractionTimeline from '../components/interactions/InteractionTimeline'
import PurchaseFormModal from '../components/purchases/PurchaseFormModal'
import PurchaseTable from '../components/purchases/PurchaseTable'
import { ApiError, api } from '../services/api'
import type {
  ClientType,
  Company,
  Contact,
  Interaction,
  Purchase,
  PurchaseSummary,
  Segment,
  Status,
} from '../types'
import { formatCents, formatDate, formatDateTime, formatRelativeDate } from '../utils/format'
import { statusTone } from '../utils/labels'

type LoadStatus = 'loading' | 'error' | 'ready'

interface DetailData {
  company: Company
  contacts: Contact[]
  interactions: Interaction[]
  purchases: Purchase[]
  summary: PurchaseSummary
  segments: Segment[]
  statuses: Status[]
  clientTypes: ClientType[]
}

type ModalState =
  | { kind: 'none' }
  | { kind: 'company' }
  | { kind: 'contact'; contact?: Contact }
  | { kind: 'interaction'; interaction?: Interaction }
  | { kind: 'purchase'; purchase?: Purchase }

/** Ficha de empresa: datos, contactos, interacciones y compras. */
export default function CompanyDetailPage() {
  const { id } = useParams()
  const companyId = Number(id)

  const [detail, setDetail] = useState<DetailData | null>(null)
  const [status, setStatus] = useState<LoadStatus>('loading')
  const [notFound, setNotFound] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [reloadKey, setReloadKey] = useState(0)
  const [tab, setTab] = useState('interactions')
  const [modal, setModal] = useState<ModalState>({ kind: 'none' })
  const [feedback, setFeedback] = useState('')

  useEffect(() => {
    if (!Number.isFinite(companyId)) {
      return
    }

    let active = true

    Promise.all([
      api.getCompany(companyId),
      api.listContacts(companyId),
      api.listInteractions(companyId),
      api.listPurchases(companyId),
      api.getPurchaseSummary(companyId),
      api.listSegments(),
      api.listStatuses(),
      api.listClientTypes(),
    ])
      .then(([company, contacts, interactions, purchases, summary, segments, statuses, clientTypes]) => {
        if (active) {
          setDetail({ company, contacts, interactions, purchases, summary, segments, statuses, clientTypes })
          setNotFound(false)
          setStatus('ready')
        }
      })
      .catch((error: unknown) => {
        if (!active) {
          return
        }
        if (error instanceof ApiError && error.status === 404) {
          setNotFound(true)
        } else {
          setErrorMessage(
            error instanceof ApiError ? error.message : 'No se pudo cargar la ficha de la empresa.',
          )
        }
        setStatus('error')
      })

    return () => {
      active = false
    }
  }, [companyId, reloadKey])

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

  const closeModal = () => setModal({ kind: 'none' })
  const refresh = () => setReloadKey((key) => key + 1)

  const handleCompanySaved = () => {
    closeModal()
    setFeedback('Cambios guardados en la empresa.')
    refresh()
  }

  const handleContactSaved = () => {
    const editing = modal.kind === 'contact' && modal.contact !== undefined
    closeModal()
    setFeedback(editing ? 'Contacto actualizado correctamente.' : 'Contacto añadido correctamente.')
    refresh()
  }

  const handleInteractionSaved = () => {
    const editing = modal.kind === 'interaction' && modal.interaction !== undefined
    closeModal()
    setFeedback(
      editing ? 'Interacción actualizada correctamente.' : 'Interacción registrada correctamente.',
    )
    refresh()
  }

  const handlePurchaseSaved = () => {
    const editing = modal.kind === 'purchase' && modal.purchase !== undefined
    closeModal()
    setFeedback(editing ? 'Compra actualizada correctamente.' : 'Compra registrada correctamente.')
    refresh()
  }

  const backLink = (
    <Link to="/companies" className="back-link">
      <IconArrowLeft size={16} />
      Volver a empresas
    </Link>
  )

  const invalidId = !Number.isFinite(companyId)

  if (invalidId || (status === 'error' && notFound)) {
    return (
      <>
        {backLink}
        <div className="card">
          <div className="card-body">
            <EmptyState
              title="Empresa no encontrada"
              description={`No existe ninguna empresa con el identificador «${id}».`}
              action={
                <Link to="/companies" className="btn btn-outline-primary btn-sm">
                  Ir al listado de empresas
                </Link>
              }
            />
          </div>
        </div>
      </>
    )
  }

  if (status === 'loading') {
    return (
      <>
        {backLink}
        <div className="card">
          <div className="card-body px-4">
            <LoadingSpinner label="Cargando la ficha de la empresa…" />
          </div>
        </div>
      </>
    )
  }

  if (status === 'error') {
    return (
      <>
        {backLink}
        <ErrorState message={errorMessage} onRetry={handleRetry} />
      </>
    )
  }

  if (!detail) {
    return null
  }

  const { company, contacts, interactions, purchases, summary } = detail

  const segmentsById: Record<number, Segment> = {}
  detail.segments.forEach((segment) => {
    segmentsById[segment.ID] = segment
  })
  const statusesById: Record<number, Status> = {}
  detail.statuses.forEach((item) => {
    statusesById[item.ID] = item
  })
  const clientTypesById: Record<number, ClientType> = {}
  detail.clientTypes.forEach((item) => {
    clientTypesById[item.ID] = item
  })
  const contactsById: Record<number, Contact> = {}
  contacts.forEach((contact) => {
    contactsById[contact.ID] = contact
  })

  const companyStatus = company.STATUS_ID !== null ? statusesById[company.STATUS_ID] : undefined
  const companySegment = company.SEGMENT_ID !== null ? segmentsById[company.SEGMENT_ID] : undefined
  const companyClientType =
    company.CLIENT_TYPE_ID !== null ? clientTypesById[company.CLIENT_TYPE_ID] : undefined

  const lastPurchaseRelative = formatRelativeDate(summary.LAST_PURCHASE_DATE)

  return (
    <>
      {backLink}

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

      <div className="card mb-4">
        <div className="card-body">
          <div className="d-flex flex-wrap align-items-start gap-3 gap-md-4">
            <Avatar name={company.NAME} size="lg" />
            <div className="flex-grow-1 min-w-0">
              <div className="d-flex flex-wrap align-items-center gap-2 mb-2">
                <h1 className="h3 mb-0 me-1">{company.NAME}</h1>
                {companyStatus ? (
                  <SoftBadge tone={statusTone(companyStatus.NAME)} dot>
                    {companyStatus.NAME}
                  </SoftBadge>
                ) : (
                  <SoftBadge tone="slate">Sin estado</SoftBadge>
                )}
                {companySegment ? (
                  <SoftBadge tone="slate">{companySegment.NAME}</SoftBadge>
                ) : null}
                {companyClientType ? (
                  <SoftBadge tone="slate">{companyClientType.NAME}</SoftBadge>
                ) : null}
              </div>

              <div className="contact-lines mt-0">
                {company.EMAIL ? (
                  <a href={`mailto:${company.EMAIL}`} className="contact-line">
                    <IconMail size={15} />
                    {company.EMAIL}
                  </a>
                ) : null}
                {company.PHONE_NUMBER ? (
                  <a href={`tel:${company.PHONE_NUMBER}`} className="contact-line">
                    <IconPhone size={15} />
                    {company.PHONE_NUMBER}
                  </a>
                ) : null}
                {company.WEB ? (
                  <a
                    href={`https://${company.WEB}`}
                    target="_blank"
                    rel="noreferrer"
                    className="contact-line"
                  >
                    <IconGlobe size={15} />
                    {company.WEB}
                  </a>
                ) : null}
                {!company.EMAIL && !company.PHONE_NUMBER && !company.WEB ? (
                  <span className="text-secondary small">Sin datos de contacto directos.</span>
                ) : null}
              </div>
            </div>

            <button
              type="button"
              className="btn btn-outline-primary"
              onClick={() => setModal({ kind: 'company' })}
            >
              <IconEdit size={16} />
              Editar empresa
            </button>
          </div>
        </div>
      </div>

      <div className="row g-3 mb-4">
        <div className="col-12 col-sm-6 col-xl-3">
          <StatCard
            label="Total comprado"
            value={formatCents(summary.TOTAL_CENTS)}
            hint="Todo el historial"
            icon={<IconEuro size={19} />}
            tone="green"
          />
        </div>
        <div className="col-12 col-sm-6 col-xl-3">
          <StatCard
            label="Nº de compras"
            value={String(summary.PURCHASE_COUNT)}
            hint="Todo el historial"
            icon={<IconCart size={19} />}
            tone="indigo"
          />
        </div>
        <div className="col-12 col-sm-6 col-xl-3">
          <StatCard
            label="Ticket medio"
            value={summary.AVERAGE_CENTS !== null ? formatCents(summary.AVERAGE_CENTS) : '—'}
            hint="Importe medio por compra"
            icon={<IconChart size={19} />}
            tone="amber"
          />
        </div>
        <div className="col-12 col-sm-6 col-xl-3">
          <StatCard
            label="Última compra"
            value={formatDate(summary.LAST_PURCHASE_DATE)}
            hint={lastPurchaseRelative ?? 'Sin compras registradas'}
            icon={<IconCalendar size={19} />}
            tone="violet"
          />
        </div>
      </div>

      <div className="card">
        <div className="card-header bg-white pt-3 px-4">
          <Tabs
            active={tab}
            onChange={setTab}
            items={[
              { id: 'interactions', label: 'Interacciones', count: interactions.length },
              { id: 'purchases', label: 'Compras', count: purchases.length },
              { id: 'contacts', label: 'Contactos', count: contacts.length },
              { id: 'data', label: 'Datos' },
            ]}
          />
        </div>
        <div className="card-body p-4">
          {tab === 'interactions' ? (
            <InteractionTimeline
              interactions={interactions}
              contactsById={contactsById}
              onAdd={() => setModal({ kind: 'interaction' })}
              onEdit={(interaction) => setModal({ kind: 'interaction', interaction })}
            />
          ) : null}

          {tab === 'purchases' ? (
            <PurchaseTable
              purchases={purchases}
              onAdd={() => setModal({ kind: 'purchase' })}
              onEdit={(purchase) => setModal({ kind: 'purchase', purchase })}
            />
          ) : null}

          {tab === 'contacts' ? (
            <ContactList
              contacts={contacts}
              onAdd={() => setModal({ kind: 'contact' })}
              onEdit={(contact) => setModal({ kind: 'contact', contact })}
            />
          ) : null}

          {tab === 'data' ? (
            <div className="row g-4">
              <div className="col-12 col-lg-7">
                <h2 className="section-title mb-3">Datos generales</h2>
                <dl className="detail-list mb-0">
                  <div className="detail-row">
                    <dt>Nombre</dt>
                    <dd>{company.NAME}</dd>
                  </div>
                  <div className="detail-row">
                    <dt>Segmento</dt>
                    <dd>{companySegment ? companySegment.NAME : '—'}</dd>
                  </div>
                  <div className="detail-row">
                    <dt>Estado comercial</dt>
                    <dd>
                      {companyStatus ? (
                        <SoftBadge tone={statusTone(companyStatus.NAME)} dot>
                          {companyStatus.NAME}
                        </SoftBadge>
                      ) : (
                        'Sin estado'
                      )}
                    </dd>
                  </div>
                  <div className="detail-row">
                    <dt>Tipo de cliente</dt>
                    <dd>{companyClientType ? companyClientType.NAME : '—'}</dd>
                  </div>
                  <div className="detail-row">
                    <dt>Correo electrónico</dt>
                    <dd>{company.EMAIL ? <a href={`mailto:${company.EMAIL}`}>{company.EMAIL}</a> : '—'}</dd>
                  </div>
                  <div className="detail-row">
                    <dt>Teléfono</dt>
                    <dd>{company.PHONE_NUMBER ? <a href={`tel:${company.PHONE_NUMBER}`}>{company.PHONE_NUMBER}</a> : '—'}</dd>
                  </div>
                  <div className="detail-row">
                    <dt>Sitio web</dt>
                    <dd>{company.WEB ?? '—'}</dd>
                  </div>
                  <div className="detail-row">
                    <dt>Notas</dt>
                    <dd className="text-secondary">{company.NOTES ?? '—'}</dd>
                  </div>
                </dl>
              </div>

              <div className="col-12 col-lg-5">
                <h2 className="section-title mb-3">Metadatos</h2>
                <div className="meta-panel">
                  <div className="meta-item">
                    <span className="meta-label">Registrada</span>
                    <span>{formatDateTime(company.CREATED_AT)}</span>
                  </div>
                  <div className="meta-item">
                    <span className="meta-label">Última actualización</span>
                    <span>{formatDateTime(company.UPDATED_AT)}</span>
                  </div>
                </div>
                <button
                  type="button"
                  className="btn btn-outline-primary btn-sm mt-3"
                  onClick={() => setModal({ kind: 'company' })}
                >
                  <IconEdit size={16} />
                  Editar empresa
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </div>

      {modal.kind === 'company' ? (
        <CompanyFormModal
          company={company}
          segments={detail.segments}
          statuses={detail.statuses}
          clientTypes={detail.clientTypes}
          onClose={closeModal}
          onSaved={handleCompanySaved}
        />
      ) : null}

      {modal.kind === 'contact' ? (
        <ContactFormModal
          companyId={company.ID}
          contact={modal.contact}
          onClose={closeModal}
          onSaved={handleContactSaved}
        />
      ) : null}

      {modal.kind === 'interaction' ? (
        <InteractionFormModal
          companyId={company.ID}
          contacts={contacts}
          interaction={modal.interaction}
          onClose={closeModal}
          onSaved={handleInteractionSaved}
        />
      ) : null}

      {modal.kind === 'purchase' ? (
        <PurchaseFormModal
          companyId={company.ID}
          purchase={modal.purchase}
          onClose={closeModal}
          onSaved={handlePurchaseSaved}
        />
      ) : null}
    </>
  )
}
