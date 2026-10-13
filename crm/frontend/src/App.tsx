import { Route, Routes } from 'react-router-dom'
import AppLayout from './layouts/AppLayout'
import CompaniesPage from './pages/CompaniesPage'
import CompanyDetailPage from './pages/CompanyDetailPage'
import HomePage from './pages/HomePage'
import NotFoundPage from './pages/NotFoundPage'

// Todas las vistas viven dentro de AppLayout (barra + menú lateral).
// Las rutas corresponden a las etapas del proyecto; el contenido se conecta
// al backend etapa a etapa.
function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<HomePage />} />
        <Route path="companies" element={<CompaniesPage />} />
        <Route path="companies/:id" element={<CompanyDetailPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}

export default App
