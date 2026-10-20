import { useEffect } from 'react'
import type { ReactNode } from 'react'

interface ModalProps {
  title: string
  onClose: () => void
  children: ReactNode
  /** Anchura del diálogo; "lg" para formularios con más campos. */
  size?: 'md' | 'lg'
}

// Modal sin JavaScript de Bootstrap: se monta con divs y estado local,
// coherente con el resto del proyecto (que no carga el bundle de Bootstrap).
export default function Modal({ title, onClose, children, size = 'md' }: ModalProps) {
  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [onClose])

  useEffect(() => {
    document.body.classList.add('modal-open')
    return () => document.body.classList.remove('modal-open')
  }, [])

  return (
    <>
      <div
        className="modal fade show d-block"
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onMouseDown={onClose}
      >
        <div
          className={`modal-dialog modal-dialog-centered modal-dialog-scrollable ${size === 'lg' ? 'modal-lg' : ''}`}
          onMouseDown={(event) => event.stopPropagation()}
        >
          <div className="modal-content modal-soft">
            <div className="modal-header">
              <h2 className="modal-title h5">{title}</h2>
              <button type="button" className="btn-close" aria-label="Cerrar" onClick={onClose} />
            </div>
            <div className="modal-body">{children}</div>
          </div>
        </div>
      </div>
      <div className="modal-backdrop fade show" aria-hidden="true" />
    </>
  )
}
