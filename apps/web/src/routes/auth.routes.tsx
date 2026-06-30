import { lazy, Suspense } from 'react'
import type { RouteObject } from 'react-router-dom'

const LoginPage = lazy(() => import('@/pages/auth/LoginPage'))

const authRoutes: RouteObject[] = [
  { path: '/auth/login', element: <Suspense fallback={<div className="route-loader">INITIALIZING ACCESS NODE</div>}><LoginPage /></Suspense> },
]

export default authRoutes
