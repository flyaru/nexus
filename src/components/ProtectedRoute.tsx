import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export const ProtectedRoute: React.FC = () => {
  const { user } = useAuth()
  if (!user || user.role === 'client') return <Navigate to="/login" replace />
  return <Outlet />
}

export const ClientProtectedRoute: React.FC = () => {
  const { user } = useAuth()
  if (!user || user.role !== 'client') return <Navigate to="/client-login" replace />
  return <Outlet />
}
