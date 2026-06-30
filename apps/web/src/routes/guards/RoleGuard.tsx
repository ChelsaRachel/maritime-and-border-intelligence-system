import { useAuthStore } from '@/stores/useAuthStore'
import type { TUserRole } from '@/types/mbis'
import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'

export default function RoleGuard({ children, allowedRoles }: { children: ReactNode; allowedRoles: TUserRole[] }) {
  const role = useAuthStore((state) => state.user?.role)
  if (!role || !allowedRoles.includes(role)) return <Navigate to="/" replace />
  return <>{children}</>
}
