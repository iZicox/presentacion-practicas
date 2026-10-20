import type { Purchase } from '../../types'
import { formatCents, formatDate } from '../../utils/format'
import EmptyState from '../common/EmptyState'
import { IconEdit, IconPlus } from '../common/icons'

interface PurchaseTableProps {
  purchases: Purchase[]
  onAdd: () => void
  onEdit: (purchase: Purchase) => void
}

/** Tabla de compras de la empresa con total del historial. */
export default function PurchaseTable({ purchases, onAdd, onEdit }: PurchaseTableProps) {
  const total = purchases.reduce((sum, row) => sum + row.AMOUNT_CENTS, 0)

  return (
    <div>
      <div className="section-toolbar">
        <div>
          <h2 className="section-title">Compras</h2>
          <p className="section-hint">Cada fila es una compra individual, con fecha e importe en euros.</p>
        </div>
        <button type="button" className="btn btn-primary btn-sm" onClick={onAdd}>
          <IconPlus size={16} />
          Registrar compra
        </button>
      </div>

      {purchases.length === 0 ? (
        <EmptyState
          title="Sin compras registradas"
          description="Registra la primera compra para ver los indicadores."
          action={
            <button type="button" className="btn btn-outline-primary btn-sm" onClick={onAdd}>
              Registrar compra
            </button>
          }
        />
      ) : (
        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead>
              <tr>
                <th scope="col">Fecha</th>
                <th scope="col" className="text-end">
                  Importe
                </th>
                <th scope="col">Registrada</th>
                <th scope="col" className="text-end">
                  <span className="visually-hidden">Acciones</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {purchases.map((purchase) => (
                <tr key={purchase.ID}>
                  <td>{formatDate(purchase.DATE)}</td>
                  <td className="text-end amount-cell">{formatCents(purchase.AMOUNT_CENTS)}</td>
                  <td className="text-secondary">{formatDate(purchase.CREATED_AT)}</td>
                  <td className="text-end">
                    <button
                      type="button"
                      className="btn-icon"
                      aria-label={`Editar compra del ${formatDate(purchase.DATE)}`}
                      onClick={() => onEdit(purchase)}
                    >
                      <IconEdit size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <th scope="row">Total histórico</th>
                <td className="text-end amount-cell">{formatCents(total)}</td>
                <td aria-hidden="true"></td>
                <td aria-hidden="true"></td>
              </tr>
            </tfoot>
          </table>
        </div>
      )}
    </div>
  )
}
