import React from 'react'
import { Navigate, Outlet, Route, Routes } from 'react-router-dom'
import { ProtectedRoute, ClientProtectedRoute } from './components/ProtectedRoute'
import { AppShell } from './components/layout/AppShell'
import { DashboardPage } from './pages/DashboardPage'
import { InvoicesPage } from './pages/InvoicesPage'
import { SuppliersPage } from './pages/SuppliersPage'
import { TasksPage } from './pages/TasksPage'
import { ReconciliationPage } from './pages/ReconciliationPage'
import { ClientPortalPage } from './pages/ClientPortalPage'
import { LoginPage } from './pages/LoginPage'
import { ClientLoginPage } from './pages/ClientLoginPage'

const Shell: React.FC = () => (
  <AppShell>
    <Outlet />
  </AppShell>
)

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/client-login" element={<ClientLoginPage />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<Shell />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/invoices" element={<InvoicesPage />} />
          <Route path="/suppliers" element={<SuppliersPage />} />
          <Route path="/tasks" element={<TasksPage />} />
          <Route path="/reconciliation" element={<ReconciliationPage />} />
        </Route>
      </Route>

      <Route element={<ClientProtectedRoute />}>
        <Route element={<Shell />}>
          <Route path="/client-portal" element={<ClientPortalPage />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  )
}

export default App
