import { useState } from 'react'
import type { FormEvent } from 'react'
import { ApiError, api } from '../../services/api'
import type { Contact, Interaction, InteractionInput } from '../../types'
import { todayIso } from '../../utils/format'
import Modal from '../common/Modal'

interface InteractionFormModalProps {
  companyId: number
  /** Contactos de la empresa para el selector opcional. */
  contacts: Contact[]
  /** Si se proporciona, el formulario edita en lugar de crear. */
  interaction?: Interaction
  onClose: () => void
  onSaved: (interaction: Interaction) => void
}

interface FormValues {
  DATE: string
  CONTACT_ID: string
  DESCRIPTION: string
  NOTES: string
}

function emptyToNull(value: string): string | null {
  const trimmed = value.trim()
  return trimmed ? trimmed : null
}

/** Formulario de registro y edición de interacciones. */
export default function InteractionFormModal({
  companyId,
  contacts,
  interaction,
  onClose,
  onSaved,
}: InteractionFormModalProps) {
  const [values, setValues] = useState<FormValues>({
    DATE: interaction?.DATE ?? todayIso(),
    CONTACT_ID: interaction?.CONTACT_ID?.toString() ?? '',
    DESCRIPTION: interaction?.DESCRIPTION ?? '',
    NOTES: interaction?.NOTES ?? '',
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
    if (!values.DESCRIPTION.trim()) {
      clientErrors.DESCRIPTION = 'La descripción es obligatoria.'
    }
    if (!values.DATE) {
      clientErrors.DATE = 'Indica la fecha de la interacción.'
    }
    if (Object.keys(clientErrors).length > 0) {
      setErrors(clientErrors)
      return
    }

    const input: InteractionInput = {
      DATE: values.DATE,
      CONTACT_ID: values.CONTACT_ID ? Number(values.CONTACT_ID) : null,
      DESCRIPTION: values.DESCRIPTION.trim(),
      NOTES: emptyToNull(values.NOTES),
    }

    setSubmitting(true)
    setErrors({})
    try {
      const saved = interaction
        ? await api.updateInteraction(interaction.ID, input)
        : await api.createInteraction(companyId, input)
      onSaved(saved)
    } catch (error) {
      if (error instanceof ApiError) {
        if (error.fields) {
          setErrors(error.fields)
        } else {
          setGeneralError(error.message)
        }
      } else {
        setGeneralError('No se pudo guardar la interacción. Inténtalo de nuevo.')
      }
      setSubmitting(false)
    }
  }

  return (
    <Modal title={interaction ? 'Editar interacción' : 'Registrar interacción'} onClose={onClose}>
      <form onSubmit={handleSubmit} noValidate>
        {generalError ? (
          <div className="alert alert-danger py-2 small" role="alert">
            {generalError}
          </div>
        ) : null}

        <div className="row g-3 mb-3">
          <div className="col-md-5">
            <label className="form-label" htmlFor="interaction-date">
              Fecha <span className="text-danger">*</span>
            </label>
            <input
              id="interaction-date"
              type="date"
              className={`form-control ${errors.DATE ? 'is-invalid' : ''}`}
              value={values.DATE}
              onChange={(event) => setField('DATE', event.target.value)}
            />
            {errors.DATE ? <div className="invalid-feedback d-block">{errors.DATE}</div> : null}
          </div>
          <div className="col-md-7">
            <label className="form-label" htmlFor="interaction-contact">
              Contacto
            </label>
            <select
              id="interaction-contact"
              className={`form-select ${errors.CONTACT_ID ? 'is-invalid' : ''}`}
              value={values.CONTACT_ID}
              onChange={(event) => setField('CONTACT_ID', event.target.value)}
            >
              <option value="">Sin contacto asociado</option>
              {contacts.map((contact) => (
                <option key={contact.ID} value={contact.ID}>
                  {contact.FIRST_NAME} {contact.LAST_NAME}
                </option>
              ))}
            </select>
            {errors.CONTACT_ID ? (
              <div className="invalid-feedback d-block">{errors.CONTACT_ID}</div>
            ) : null}
          </div>
        </div>

        <div className="mb-3">
          <label className="form-label" htmlFor="interaction-description">
            Descripción <span className="text-danger">*</span>
          </label>
          <input
            id="interaction-description"
            type="text"
            className={`form-control ${errors.DESCRIPTION ? 'is-invalid' : ''}`}
            value={values.DESCRIPTION}
            onChange={(event) => setField('DESCRIPTION', event.target.value)}
            placeholder="Llamada de seguimiento, visita, envío de propuesta…"
            autoFocus
          />
          {errors.DESCRIPTION ? (
            <div className="invalid-feedback d-block">{errors.DESCRIPTION}</div>
          ) : null}
        </div>

        <div className="mb-4">
          <label className="form-label" htmlFor="interaction-notes">
            Notas
          </label>
          <textarea
            id="interaction-notes"
            className="form-control"
            rows={3}
            value={values.NOTES}
            onChange={(event) => setField('NOTES', event.target.value)}
            placeholder="Detalles de la conversación…"
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
            {interaction ? 'Guardar cambios' : 'Registrar interacción'}
          </button>
        </div>
      </form>
    </Modal>
  )
}
