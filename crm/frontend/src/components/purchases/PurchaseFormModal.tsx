import { useState } from 'react'
import type { FormEvent } from 'react'
import { ApiError, api } from '../../services/api'
import type { Purchase, PurchaseInput } from '../../types'
import { MAX_PURCHASE_AMOUNT_CENTS, formatCents, parseEurosToCents, todayIso } from '../../utils/format'
import Modal from '../common/Modal'

interface PurchaseFormModalProps {
  companyId: number
  /** Si se proporciona, el formulario edita en lugar de crear. */
  purchase?: Purchase
  onClose: () => void
  onSaved: (purchase: Purchase) => void
}

/** Formulario de registro y edición de compras (fecha e importe en euros). */
export default function PurchaseFormModal({
  companyId,
  purchase,
  onClose,
  onSaved,
}: PurchaseFormModalProps) {
  const [date, setDate] = useState(purchase?.DATE ?? todayIso())
  const [amount, setAmount] = useState(
    purchase ? formatCents(purchase.AMOUNT_CENTS).replace(/\s?€/, '') : '',
  )
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [generalError, setGeneralError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const parsedCents = parseEurosToCents(amount)

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setGeneralError('')

    const clientErrors: Record<string, string> = {}
    if (!date) {
      clientErrors.DATE = 'Indica la fecha de la compra.'
    }
    if (!amount.trim()) {
      clientErrors.AMOUNT_CENTS = 'Introduce el importe de la compra.'
    } else if (parsedCents === null) {
      clientErrors.AMOUNT_CENTS = 'No se reconoce un importe válido. Usa por ejemplo 250,50.'
    } else if (parsedCents > MAX_PURCHASE_AMOUNT_CENTS) {
      clientErrors.AMOUNT_CENTS = 'El importe supera el máximo admitido (10.000.000 €).'
    }
    if (Object.keys(clientErrors).length > 0) {
      setErrors(clientErrors)
      return
    }

    const input: PurchaseInput = { DATE: date, AMOUNT_CENTS: parsedCents as number }

    setSubmitting(true)
    setErrors({})
    try {
      const saved = purchase
        ? await api.updatePurchase(purchase.ID, input)
        : await api.createPurchase(companyId, input)
      onSaved(saved)
    } catch (error) {
      if (error instanceof ApiError) {
        if (error.fields) {
          setErrors(error.fields)
        } else {
          setGeneralError(error.message)
        }
      } else {
        setGeneralError('No se pudo guardar la compra. Inténtalo de nuevo.')
      }
      setSubmitting(false)
    }
  }

  return (
    <Modal title={purchase ? 'Editar compra' : 'Registrar compra'} onClose={onClose}>
      <form onSubmit={handleSubmit} noValidate>
        {generalError ? (
          <div className="alert alert-danger py-2 small" role="alert">
            {generalError}
          </div>
        ) : null}

        <div className="row g-3 mb-3">
          <div className="col-md-6">
            <label className="form-label" htmlFor="purchase-date">
              Fecha de la compra <span className="text-danger">*</span>
            </label>
            <input
              id="purchase-date"
              type="date"
              className={`form-control ${errors.DATE ? 'is-invalid' : ''}`}
              value={date}
              onChange={(event) => setDate(event.target.value)}
            />
            {errors.DATE ? <div className="invalid-feedback d-block">{errors.DATE}</div> : null}
          </div>
          <div className="col-md-6">
            <label className="form-label" htmlFor="purchase-amount">
              Importe en euros <span className="text-danger">*</span>
            </label>
            <input
              id="purchase-amount"
              type="text"
              inputMode="decimal"
              className={`form-control ${errors.AMOUNT_CENTS ? 'is-invalid' : ''}`}
              value={amount}
              onChange={(event) => setAmount(event.target.value)}
              placeholder="250,50"
              autoFocus
            />
            {errors.AMOUNT_CENTS ? (
              <div className="invalid-feedback d-block">{errors.AMOUNT_CENTS}</div>
            ) : null}
            {!errors.AMOUNT_CENTS && parsedCents !== null ? (
              <div className="form-text">Se guardará como {formatCents(parsedCents)}.</div>
            ) : null}
            {!errors.AMOUNT_CENTS && parsedCents === null ? (
              <div className="form-text">
                Usa coma decimal: 250,50 corresponde a 250,50 €.
              </div>
            ) : null}
          </div>
        </div>

        <div className="d-flex justify-content-end gap-2">
          <button type="button" className="btn btn-outline-secondary" onClick={onClose}>
            Cancelar
          </button>
          <button type="submit" className="btn btn-primary" disabled={submitting}>
            {submitting ? (
              <span className="spinner-border spinner-border-sm" aria-hidden="true" />
            ) : null}
            {purchase ? 'Guardar cambios' : 'Registrar compra'}
          </button>
        </div>
      </form>
    </Modal>
  )
}
