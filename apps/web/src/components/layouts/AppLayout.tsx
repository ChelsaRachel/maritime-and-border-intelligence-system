import AppHeader from '@/components/layouts/AppHeader'
import AppSidebar from '@/components/layouts/AppSidebar'
import { useMbisStore } from '@/stores/useMbisStore'
import { useEffect, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'

export default function AppLayout() {
  const [collapsed, setCollapsed] = useState(true)
  const load = useMbisStore((state) => state.load)
  const location = useLocation()
  const isFullMap = location.pathname === '/'

  useEffect(() => { void load() }, [load])

  return (
    <div className="app-shell">
      <AppSidebar collapsed={collapsed} onToggle={() => setCollapsed((value) => !value)} />
      <div className="app-shell__workspace">
        <AppHeader />
        <main className={`app-main ${isFullMap ? 'app-main--full-map' : ''}`}><Outlet /></main>
      </div>
    </div>
  )
}
