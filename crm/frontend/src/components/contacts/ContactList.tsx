import type { Contact } from '../../types'
import Avatar from '../common/Avatar'
import EmptyState from '../common/EmptyState'
import { IconEdit, IconMail, IconPhone, IconPlus } from '../common/icons'

interface ContactListProps {
  contacts: Contact[]
  onAdd: () => void
  onEdit: (contact: Contact) => void
}

/** Rejilla de contactos de la empresa con acciones de alta y edición. */
export default function ContactList({ contacts, onAdd, onEdit }: ContactListProps) {
  return (
    <div>
      <div className="section-toolbar">
        <div>
          <h2 className="section-title">Contactos</h2>
          <p className="section-hint">
            Personas de referencia de la empresa para el seguimiento comercial.
          </p>
        </div>
        <button type="button" className="btn btn-primary btn-sm" onClick={onAdd}>
          <IconPlus size={16} />
          Añadir contacto
        </button>
      </div>

      {contacts.length === 0 ? (
        <EmptyState
          title="Sin contactos"
          description="Añade la primera persona de contacto de esta empresa."
          action={
            <button type="button" className="btn btn-outline-primary btn-sm" onClick={onAdd}>
              Añadir contacto
            </button>
          }
        />
      ) : (
        <div className="row g-3">
          {contacts.map((contact) => (
            <div className="col-12 col-md-6 col-xxl-4" key={contact.ID}>
              <div className="card contact-card h-100">
                <div className="card-body">
                  <div className="d-flex align-items-start gap-3">
                    <Avatar name={`${contact.FIRST_NAME} ${contact.LAST_NAME}`} size="lg" />
                    <div className="flex-grow-1 min-w-0">
                      <div className="d-flex justify-content-between align-items-start gap-2">
                        <div>
                          <div className="row-title">
                            {contact.FIRST_NAME} {contact.LAST_NAME}
                          </div>
                          <div className="row-sub">{contact.JOB_TITLE ?? 'Sin puesto indicado'}</div>
                        </div>
                        <button
                          type="button"
                          className="btn-icon"
                          aria-label={`Editar contacto ${contact.FIRST_NAME} ${contact.LAST_NAME}`}
                          onClick={() => onEdit(contact)}
                        >
                          <IconEdit size={16} />
                        </button>
                      </div>

                      <div className="contact-lines">
                        {contact.EMAIL ? (
                          <a href={`mailto:${contact.EMAIL}`} className="contact-line">
                            <IconMail size={15} />
                            {contact.EMAIL}
                          </a>
                        ) : null}
                        {contact.PHONE_NUMBER ? (
                          <a href={`tel:${contact.PHONE_NUMBER}`} className="contact-line">
                            <IconPhone size={15} />
                            {contact.PHONE_NUMBER}
                          </a>
                        ) : null}
                      </div>

                      {contact.NOTES ? (
                        <p className="notes-line mb-0">{contact.NOTES}</p>
                      ) : null}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
