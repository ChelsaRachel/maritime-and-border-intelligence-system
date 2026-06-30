import { APP_MENU } from '@/config/menu/app.menu'
import { useAuthStore } from '@/stores/useAuthStore'
import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

export default function AppHeader() {
  const location = useLocation()
  const navigate = useNavigate()
  const user = useAuthStore((state) => state.user)
  const clearSession = useAuthStore((state) => state.clearSession)
  const [clock, setClock] = useState(() => new Date())
  const current = APP_MENU.find((item) => item.path === location.pathname) ?? APP_MENU[0]

  useEffect(() => {
    const timer = window.setInterval(() => setClock(new Date()), 1000)
    return () => window.clearInterval(timer)
  }, [])

  const logout = () => {
    clearSession()
    navigate('/auth/login', { replace: true })
  }

  return (
    <header className="app-header">
      <div className="app-header__title"><span>OPERATIONAL WORKSPACE</span><strong>{current.display}</strong></div>
      <div className="app-header__status">
        <time>{clock.toLocaleTimeString('id-ID', { hour12: false })} WIB</time>
        <span className="live-chip"><i />REAL-TIME FIXTURE</span>
        <button className="header-icon" type="button" aria-label="Peringatan"><i className="ph ph-bell" /><b>6</b></button>
        <span className="classification-chip">INTERNAL</span>
        <div className="header-user"><span className="avatar-ring"><i className="ph ph-user" /></span><div><strong>{user?.displayName}</strong><small>{user?.role}{user?.readOnly ? ' · READ ONLY' : ''}</small></div></div>
        <button className="header-icon" type="button" onClick={logout} aria-label="Keluar"><i className="ph ph-sign-out" /></button>
      </div>
    </header>
  )
}
