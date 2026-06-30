import AppLayout from '@/components/layouts/AppLayout'
import { ROUTE_ACCESS } from '@/config/access-config'
import AuthGuard from '@/routes/guards/AuthGuard'
import RoleGuard from '@/routes/guards/RoleGuard'
import { lazy, Suspense, type ReactNode } from 'react'
import type { RouteObject } from 'react-router-dom'

const Dashboard = lazy(() => import('@/pages/dashboard/DashboardPage'))
const Border = lazy(() => import('@/pages/border-intelligence/BorderIntelligencePage'))
const Vessel = lazy(() => import('@/pages/vessel-intelligence/VesselIntelligencePage'))
const Aircraft = lazy(() => import('@/pages/aircraft-intelligence/AircraftIntelligencePage'))
const Anomaly = lazy(() => import('@/pages/anomaly-detection/AnomalyDetectionPage'))
const Warning = lazy(() => import('@/pages/early-warning/EarlyWarningPage'))
const Threat = lazy(() => import('@/pages/threat-assessment/ThreatAssessmentPage'))
const Reporting = lazy(() => import('@/pages/intelligence-reporting/IntelligenceReportingPage'))
const DataManagement = lazy(() => import('@/pages/data-management/DataManagementPage'))
const Administration = lazy(() => import('@/pages/administration/AdministrationPage'))

function page(path: string, element: ReactNode) {
  return <RoleGuard allowedRoles={ROUTE_ACCESS[path]}><Suspense fallback={<div className="route-loader">LOADING OPERATIONAL WORKSPACE</div>}>{element}</Suspense></RoleGuard>
}

const mainRoutes: RouteObject[] = [
  {
    path: '/',
    element: <AuthGuard><AppLayout /></AuthGuard>,
    children: [
      { index: true, element: page('/', <Dashboard />) },
      { path: 'border-intelligence', element: page('/border-intelligence', <Border />) },
      { path: 'vessel-intelligence', element: page('/vessel-intelligence', <Vessel />) },
      { path: 'aircraft-intelligence', element: page('/aircraft-intelligence', <Aircraft />) },
      { path: 'anomaly-detection', element: page('/anomaly-detection', <Anomaly />) },
      { path: 'early-warning', element: page('/early-warning', <Warning />) },
      { path: 'threat-assessment', element: page('/threat-assessment', <Threat />) },
      { path: 'intelligence-reporting', element: page('/intelligence-reporting', <Reporting />) },
      { path: 'data-management', element: page('/data-management', <DataManagement />) },
      { path: 'administration', element: page('/administration', <Administration />) },
    ],
  },
]

export default mainRoutes
