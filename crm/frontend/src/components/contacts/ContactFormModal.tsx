import { useState } from 'react'
import type { FormEvent } from 'react'
import { ApiError, api } from '../../services/api'
import type { Contact, ContactInput } from '../../types'
import Modal from '../common/Modal'

interface ContactFormModalProps {
  companyId: number
  /** Si se proporciona, el formulario edita en lugar de crear. */
  contact?: Contact
  onClose: () => void
  onSaved: (contact: Contact) => void
}

interface FormValues {
  FIRST_NAME: string
  LAST_NAME: string
  JOB_TITLE: string
  EMAIL: string
  PHONE_NUMBER: string
  NOTES: string
}

function emptyToNull(value: string): string | null {
  const trimmed = value.trim()
  return trimmed ? trimmed : null
}

/** Formulario de creación y edición de contactos de una empresa. */
export default function ContactFormModal({
  companyId,
  contact,
  onClose,
  onSaved,
}: ContactFormModalProps) {
  const [values, setValues] = useState<FormValues>({
    FIRST_NAME: contact?.FIRST_NAME ?? '',
    LAST_NAME: contact?.LAST_NAME ?? '',
    JOB_TITLE: contact?.JOB_TITLE ?? '',
    EMAIL: contact?.EMAIL ?? '',
    PHONE_NUMBER: contact?.PHONE_NUMBER ?? '',
    NOTES: contact?.NOTES ?? '',
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

    const clientErrors: Record<string, string> = {}
    if (!values.FIRST_NAME.trim()) {
      clientErrors.FIRST_NAME = 'El nombre es obligatorio.'
    }
    if (!values.LAST_NAME.trim()) {
      clientErrors.LAST_NAME = 'Los apellidos son obligatorios.'
    }
    if (Object.keys(clientErrors).length > 0) {
      setErrors(clientErrors)
      return
    }

    const input: ContactInput = {
      FIRST_NAME: values.FIRST_NAME.trim(),
      LAST_NAME: values.LAST_NAME.trim(),
      JOB_TITLE: emptyToNull(values.JOB_TITLE),
      EMAIL: emptyToNull(values.EMAIL),
      PHONE_NUMBER: emptyToNull(values.PHONE_NUMBER),
      NOTES: emptyToNull(values.NOTES),
    }

    setSubmitting(true)
    setErrors({})
    try {
      const saved = contact
        ? await api.updateContact(contact.ID, input)
        : await api.createContact(companyId, input)
      onSaved(saved)
    } catch (error) {
      if (error instanceof ApiError) {
        if (error.fields) {
          setErrors(error.fields)
        } else {
          setGeneralError(error.message)
        }
      } else {
        setGeneralError('No se pudo guardar el contacto. Inténtalo de nuevo.')
      }
      setSubmitting(false)
    }
  }

  return (
    <Modal title={contact ? 'Editar contacto' : 'Nuevo contacto'} onClose={onClose}>
      <form onSubmit={handleSubmit} noValidate>
        {generalError ? (
          <div className="alert alert-danger py-2 small" role="alert">
            {generalError}
          </div>
        ) : null}

        <div className="row g-3 mb-3">
          <div className="col-md-6">
            <label className="form-label" htmlFor="contact-first-name">
              Nombre <span className="text-danger">*</span>
            </label>
            <input
              id="contact-first-name"
              type="text"
              className={`form-control ${errors.FIRST_NAME ? 'is-invalid' : ''}`}
              value={values.FIRST_NAME}
              onChange={(event) => setField('FIRST_NAME', event.target.value)}
              autoFocus
            />
            {errors.FIRST_NAME ? (
              <div className="invalid-feedback d-block">{errors.FIRST_NAME}</div>
            ) : null}
          </div>
          <div className="col-md-6">
            <label className="form-label" htmlFor="contact-last-name">
              Apellidos <span className="text-danger">*</span>
            </label>
            <input
              id="contact-last-name"
              type="text"
              className={`form-control ${errors.LAST_NAME ? 'is-invalid' : ''}`}
              value={values.LAST_NAME}
              onChange={(event) => setField('LAST_NAME', event.target.value)}
            />
            {errors.LAST_NAME ? (
              <div className="invalid-feedback d-block">{errors.LAST_NAME}</div>
            ) : null}
          </div>
        </div>

        <div className="mb-3">
          <label className="form-label" htmlFor="contact-job-title">
            Puesto
          </label>
          <input
            id="contact-job-title"
            type="text"
            className={`form-control ${errors.JOB_TITLE ? 'is-invalid' : ''}`}
            value={values.JOB_TITLE}
            onChange={(event) => setField('JOB_TITLE', event.target.value)}
            placeholder="Responsable de compras…"
          />
          {errors.JOB_TITLE ? (
            <div className="invalid-feedback d-block">{errors.JOB_TITLE}</div>
          ) : null}
        </div>

        <div className="row g-3 mb-3">
          <div className="col-md-6">
            <label className="form-label" htmlFor="contact-email">
              Correo electrónico
            </label>
            <input
              id="contact-email"
              type="email"
              className={`form-control ${errors.EMAIL ? 'is-invalid' : ''}`}
              value={values.EMAIL}
              onChange={(event) => setField('EMAIL', event.target.value)}
              placeholder="nombre@empresa.example"
            />
            {errors.EMAIL ? <div className="invalid-feedback d-block">{errors.EMAIL}</div> : null}
          </div>
          <div className="col-md-6">
            <label className="form-label" htmlFor="contact-phone">
              Teléfono
            </label>
            <input
              id="contact-phone"
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

        <div className="mb-4">
          <label className="form-label" htmlFor="contact-notes">
            Notas
          </label>
          <textarea
            id="contact-notes"
            className="form-control"
            rows={2}
            value={values.NOTES}
            onChange={(event) => setField('NOTES', event.target.value)}
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
            {contact ? 'Guardar cambios' : 'Añadir contacto'}
          </button>
        </div>
      </form>
    </Modal>
  )
}
