import type { Contact, Interaction } from '../../types'
import { formatDate, formatRelativeDate } from '../../utils/format'
import EmptyState from '../common/EmptyState'
import { IconCalendar, IconEdit, IconPlus, IconUsers } from '../common/icons'

interface InteractionTimelineProps {
  interactions: Interaction[]
  contactsById: Record<number, Contact>
  onAdd: () => void
  onEdit: (interaction: Interaction) => void
}

/** Línea temporal con el historial de seguimiento de la empresa. */
export default function InteractionTimeline({
  interactions,
  contactsById,
  onAdd,
  onEdit,
}: InteractionTimelineProps) {
  return (
    <div>
      <div className="section-toolbar">
        <div>
          <h2 className="section-title">Interacciones</h2>
          <p className="section-hint">
            Historial de seguimiento comercial, de la más reciente a la más antigua.
          </p>
        </div>
        <button type="button" className="btn btn-primary btn-sm" onClick={onAdd}>
          <IconPlus size={16} />
          Registrar interacción
        </button>
      </div>

      {interactions.length === 0 ? (
        <EmptyState
          title="Sin interacciones registradas"
          description="Anota la primera llamada, visita o correo de seguimiento."
          action={
            <button type="button" className="btn btn-outline-primary btn-sm" onClick={onAdd}>
              Registrar interacción
            </button>
          }
        />
      ) : (
        <ul className="tl">
          {interactions.map((interaction) => {
            const contact =
              interaction.CONTACT_ID !== null ? contactsById[interaction.CONTACT_ID] : undefined
            const relative = formatRelativeDate(interaction.DATE)

            return (
              <li className="tl-item" key={interaction.ID}>
                <span className="tl-dot" aria-hidden="true" />
                <div className="tl-card">
                  <div className="d-flex justify-content-between align-items-start gap-2">
                    <div>
                      <span className="tl-date">
                        <IconCalendar size={14} />
                        {formatDate(interaction.DATE)}
                        {relative ? <span className="tl-relative">· {relative}</span> : null}
                      </span>
                      <div className="row-title mt-1">{interaction.DESCRIPTION}</div>
                    </div>
                    <button
                      type="button"
                      className="btn-icon"
                      aria-label={`Editar interacción: ${interaction.DESCRIPTION}`}
                      onClick={() => onEdit(interaction)}
                    >
                      <IconEdit size={16} />
                    </button>
                  </div>

                  {contact ? (
                    <div className="tl-contact">
                      <IconUsers size={14} />
                      {contact.FIRST_NAME} {contact.LAST_NAME}
                    </div>
                  ) : null}

                  {interaction.NOTES ? <p className="notes-line mb-0 mt-2">{interaction.NOTES}</p> : null}
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
