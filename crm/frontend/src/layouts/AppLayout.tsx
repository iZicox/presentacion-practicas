import { useState } from 'react'
import { NavLink, Outlet } from 'react-router-dom'

const NAV_ITEMS = [
  { to: '/', label: 'Inicio', end: true },
  { to: '/companies', label: 'Empresas', end: false },
]

/** Estructura visual general: barra superior, menú lateral y contenido. */
export default function AppLayout() {
  // En pantallas pequeñas el menú se muestra u oculta con estado local
  // (sin JavaScript de Bootstrap).
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-vh-100 d-flex flex-column bg-body-tertiary">
      <nav className="navbar navbar-dark bg-primary px-3">
        <button
          type="button"
          className="btn btn-outline-light me-3 d-lg-none"
          aria-expanded={sidebarOpen}
          aria-label={sidebarOpen ? 'Cerrar menú' : 'Abrir menú'}
          onClick={() => setSidebarOpen((open) => !open)}
        >
          Menú
        </button>
        <span className="navbar-brand mb-0 h1 fs-4">CRM Interno</span>
        <span className="navbar-text d-none d-md-inline">
          Gestión de empresas y seguimiento comercial
        </span>
      </nav>

      <div className="container-fluid flex-grow-1 p-0">
        <div className="row g-0 flex-grow-1">
          <aside
            className={`col-12 col-lg-2 bg-white border-end p-3 ${
              sidebarOpen ? 'd-block' : 'd-none d-lg-block'
            }`}
          >
            <ul
              className="nav nav-pills flex-column gap-1"
              onClick={() => setSidebarOpen(false)}
            >
              {NAV_ITEMS.map((item) => (
                <li className="nav-item" key={item.to}>
                  <NavLink
                    to={item.to}
                    end={item.end}
                    className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
                  >
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </aside>

          <main className="col p-4">
            <Outlet />
          </main>
        </div>
      </div>

      <footer className="border-top bg-white text-secondary small p-3 text-center">
        CRM interno · entorno de desarrollo
      </footer>
    </div>
  )
}
