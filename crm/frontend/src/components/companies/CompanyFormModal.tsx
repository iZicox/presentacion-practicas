import { useState } from 'react'
import type { FormEvent } from 'react'
import { ApiError, api } from '../../services/api'
import type { ClientType, Company, CompanyInput, Segment, Status } from '../../types'
import Modal from '../common/Modal'

interface CompanyFormModalProps {
  /** Si se proporciona, el formulario edita en lugar de crear. */
  company?: Company
  segments: Segment[]
  statuses: Status[]
  clientTypes: ClientType[]
  onClose: () => void
  onSaved: (company: Company) => void
}

interface FormValues {
  NAME: string
  SEGMENT_ID: string
  STATUS_ID: string
  CLIENT_TYPE_ID: string
  EMAIL: string
  PHONE_NUMBER: string
  WEB: string
  NOTES: string
}

function emptyToNull(value: string): string | null {
  const trimmed = value.trim()
  return trimmed ? trimmed : null
}

function valueToId(value: string): number | null {
  return value ? Number(value) : null
}

/** Formulario de creación y edición de empresas. */
export default function CompanyFormModal({
  company,
  segments,
  statuses,
  clientTypes,
  onClose,
  onSaved,
}: CompanyFormModalProps) {
  const [values, setValues] = useState<FormValues>({
    NAME: company?.NAME ?? '',
    SEGMENT_ID: company?.SEGMENT_ID?.toString() ?? '',
    STATUS_ID: company?.STATUS_ID?.toString() ?? '',
    CLIENT_TYPE_ID: company?.CLIENT_TYPE_ID?.toString() ?? '',
    EMAIL: company?.EMAIL ?? '',
    PHONE_NUMBER: company?.PHONE_NUMBER ?? '',
    WEB: company?.WEB ?? '',
    NOTES: company?.NOTES ?? '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [generalError, setGeneralError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const setField = (field: keyof FormValues, value: string) => {
    setValues((current) => ({ ...current, [field]: value }))
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setGeneralError('')

    if (!values.NAME.trim()) {
      setErrors({ NAME: 'El nombre es obligatorio.' })
      return
    }

    const input: CompanyInput = {
      NAME: values.NAME.trim(),
      SEGMENT_ID: valueToId(values.SEGMENT_ID),
      STATUS_ID: valueToId(values.STATUS_ID),
      CLIENT_TYPE_ID: valueToId(values.CLIENT_TYPE_ID),
      EMAIL: emptyToNull(values.EMAIL),
      PHONE_NUMBER: emptyToNull(values.PHONE_NUMBER),
      WEB: emptyToNull(values.WEB),
      NOTES: emptyToNull(values.NOTES),
    }

    setSubmitting(true)
    setErrors({})
    try {
      const saved = company
        ? await api.updateCompany(company.ID, input)
        : await api.createCompany(input)
      onSaved(saved)
    } catch (error) {
      if (error instanceof ApiError) {
        if (error.fields) {
          setErrors(error.fields)
        } else {
          setGeneralError(error.message)
        }
      } else {
        setGeneralError('No se pudo guardar la empresa. Inténtalo de nuevo.')
      }
      setSubmitting(false)
    }
  }

  return (
    <Modal title={company ? 'Editar empresa' : 'Nueva empresa'} onClose={onClose} size="lg">
      <form onSubmit={handleSubmit} noValidate>
        {generalError ? (
          <div className="alert alert-danger py-2 small" role="alert">
            {generalError}
          </div>
        ) : null}

        <div className="mb-3">
          <label className="form-label" htmlFor="company-name">
            Nombre <span className="text-danger">*</span>
          </label>
          <input
            id="company-name"
            type="text"
            className={`form-control ${errors.NAME ? 'is-invalid' : ''}`}
            value={values.NAME}
            onChange={(event) => setField('NAME', event.target.value)}
            placeholder="Nombre de la empresa o lead"
            autoFocus
          />
          {errors.NAME ? <div className="invalid-feedback d-block">{errors.NAME}</div> : null}
        </div>

        <div className="row g-3 mb-3">
          <div className="col-md-4">
            <label className="form-label" htmlFor="company-segment">
              Segmento
            </label>
            <select
              id="company-segment"
              className={`form-select ${errors.SEGMENT_ID ? 'is-invalid' : ''}`}
              value={values.SEGMENT_ID}
              onChange={(event) => setField('SEGMENT_ID', event.target.value)}
            >
              <option value="">Sin segmento</option>
              {segments.map((segment) => (
                <option key={segment.ID} value={segment.ID}>
                  {segment.NAME}
                </option>
              ))}
            </select>
            {errors.SEGMENT_ID ? (
              <div className="invalid-feedback d-block">{errors.SEGMENT_ID}</div>
            ) : null}
          </div>
          <div className="col-md-4">
            <label className="form-label" htmlFor="company-status">
              Estado comercial
            </label>
            <select
              id="company-status"
              className={`form-select ${errors.STATUS_ID ? 'is-invalid' : ''}`}
              value={values.STATUS_ID}
              onChange={(event) => setField('STATUS_ID', event.target.value)}
            >
              <option value="">Sin estado</option>
              {statuses.map((status) => (
                <option key={status.ID} value={status.ID}>
                  {status.NAME}
                </option>
              ))}
            </select>
            {errors.STATUS_ID ? (
              <div className="invalid-feedback d-block">{errors.STATUS_ID}</div>
            ) : null}
          </div>
          <div className="col-md-4">
            <label className="form-label" htmlFor="company-client-type">
              Tipo de cliente
            </label>
            <select
              id="company-client-type"
              className={`form-select ${errors.CLIENT_TYPE_ID ? 'is-invalid' : ''}`}
              value={values.CLIENT_TYPE_ID}
              onChange={(event) => setField('CLIENT_TYPE_ID', event.target.value)}
            >
              <option value="">Sin tipo</option>
              {clientTypes.map((clientType) => (
                <option key={clientType.ID} value={clientType.ID}>
                  {clientType.NAME}
                </option>
              ))}
            </select>
            {errors.CLIENT_TYPE_ID ? (
              <div className="invalid-feedback d-block">{errors.CLIENT_TYPE_ID}</div>
            ) : null}
          </div>
        </div>

        <div className="row g-3 mb-3">
          <div className="col-md-6">
            <label className="form-label" htmlFor="company-email">
              Correo electrónico
            </label>
            <input
              id="company-email"
              type="email"
              className={`form-control ${errors.EMAIL ? 'is-invalid' : ''}`}
              value={values.EMAIL}
              onChange={(event) => setField('EMAIL', event.target.value)}
              placeholder="contacto@empresa.example"
            />
            {errors.EMAIL ? <div className="invalid-feedback d-block">{errors.EMAIL}</div> : null}
          </div>
          <div className="col-md-6">
            <label className="form-label" htmlFor="company-phone">
              Teléfono
            </label>
            <input
              id="company-phone"
              type="tel"
              className={`form-control ${errors.PHONE_NUMBER ? 'is-invalid' : ''}`}
              value={values.PHONE_NUMBER}
              onChange={(event) => setField('PHONE_NUMBER', event.target.value)}
              placeholder="+34 600 000 000"
            />
            {errors.PHONE_NUMBER ? (
              <div className="invalid-feedback d-block">{errors.PHONE_NUMBER}</div>
            ) : null}
          </div>
        </div>

        <div className="mb-3">
          <label className="form-label" htmlFor="company-web">
            Sitio web
          </label>
          <input
            id="company-web"
            type="text"
            className={`form-control ${errors.WEB ? 'is-invalid' : ''}`}
            value={values.WEB}
            onChange={(event) => setField('WEB', event.target.value)}
            placeholder="miempresa.example"
          />
          {errors.WEB ? <div className="invalid-feedback d-block">{errors.WEB}</div> : null}
        </div>

        <div className="mb-4">
          <label className="form-label" htmlFor="company-notes">
            Notas
          </label>
          <textarea
            id="company-notes"
            className="form-control"
            rows={3}
            value={values.NOTES}
            onChange={(event) => setField('NOTES', event.target.value)}
            placeholder="Contexto útil sobre la empresa…"
          />
        </div>

        <div className="d-flex justify-content-end gap-2">
          <button type="button" className="btn btn-outline-secondary" onClick={onClose}>
            Cancelar
          </button>
          <button type="submit" className="btn btn-primary" disabled={submitting}>
            {submitting ? (
              <span className="spinner-border spinner-border-sm" aria-hidden="true" />
            ) : null}
            {company ? 'Guardar cambios' : 'Crear empresa'}
          </button>
        </div>
      </form>
    </Modal>
  )
}
