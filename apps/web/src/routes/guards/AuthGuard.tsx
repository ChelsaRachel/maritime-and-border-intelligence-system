import { useAuthStore } from '@/stores/useAuthStore'
import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'

export default function AuthGuard({ children }: { children: ReactNode }) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const location = useLocation()
  if (!isAuthenticated) return <Navigate to="/auth/login" state={{ from: location.pathname }} replace />
  return <>{children}</>
}
