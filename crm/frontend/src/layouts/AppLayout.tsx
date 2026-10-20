import { useState } from 'react'
import type { ReactNode } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import Avatar from '../components/common/Avatar'
import { IconBriefcase, IconHome, IconMenu } from '../components/common/icons'

interface NavItem {
  to: string
  label: string
  end: boolean
  icon: ReactNode
}

const NAV_ITEMS: NavItem[] = [
  { to: '/', label: 'Inicio', end: true, icon: <IconHome size={18} /> },
  { to: '/companies', label: 'Empresas', end: false, icon: <IconBriefcase size={18} /> },
]

/** Estructura visual general: menú lateral, barra superior y contenido. */
export default function AppLayout() {
  // En pantallas pequeñas el menú se muestra u oculta con estado local
  // (sin JavaScript de Bootstrap).
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="crm-shell">
      <aside className={`crm-sidebar${sidebarOpen ? ' is-open' : ''}`}>
        <div className="crm-brand">
          <span className="crm-brand-mark" aria-hidden="true">
            C
          </span>
          <span className="crm-brand-text">
            <span className="crm-brand-name">CRM Interno</span>
            <span className="crm-brand-sub">Gestión comercial</span>
          </span>
        </div>

        <nav className="crm-nav" aria-label="Principal">
          <span className="crm-nav-label">Menú</span>
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) => (isActive ? 'crm-nav-link active' : 'crm-nav-link')}
            >
              {item.icon}
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="crm-sidebar-foot">
          <span className="b-soft b-slate">v0.1 · prototipo</span>
        </div>
      </aside>

      {sidebarOpen ? (
        <div
          className="crm-backdrop"
          aria-hidden="true"
          onClick={() => setSidebarOpen(false)}
        />
      ) : null}

      <div className="crm-main">
        <header className="crm-topbar">
          <button
            type="button"
            className="btn-icon d-lg-none"
            aria-label="Abrir menú"
            onClick={() => setSidebarOpen(true)}
          >
            <IconMenu size={20} />
          </button>

          <span className="demo-pill">
            <span className="dot" aria-hidden="true" />
            Datos ficticios · modo demo
          </span>

          <div className="ms-auto d-flex align-items-center gap-2">
            <Avatar name="Francisco García" size="sm" />
            <span className="d-none d-sm-block lh-sm">
              <span className="crm-user-name">Francisco G.</span>
              <span className="crm-user-role">Equipo comercial</span>
            </span>
          </div>
        </header>

        <main className="crm-content">
          <Outlet />
        </main>

        <footer className="crm-footer">
          CRM interno · prototipo de diseño con datos ficticios · los cambios se reinician al
          recargar la página
        </footer>
      </div>
    </div>
  )
}
