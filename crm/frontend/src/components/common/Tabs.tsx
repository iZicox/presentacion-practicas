interface TabItem {
  id: string
  label: string
  /** Número junto a la etiqueta (por ejemplo, nº de contactos). */
  count?: number
}

interface TabsProps {
  items: TabItem[]
  active: string
  onChange: (id: string) => void
}

/** Pestañas controladas por la página que las usa. */
export default function Tabs({ items, active, onChange }: TabsProps) {
  return (
    <ul className="nav nav-tabs-modern" role="tablist">
      {items.map((item) => (
        <li className="nav-item" role="presentation" key={item.id}>
          <button
            type="button"
            role="tab"
            aria-selected={item.id === active}
            className={item.id === active ? 'nav-link active' : 'nav-link'}
            onClick={() => onChange(item.id)}
          >
            {item.label}
            {typeof item.count === 'number' ? (
              <span className="tab-count">{item.count}</span>
            ) : null}
          </button>
        </li>
      ))}
    </ul>
  )
}
