import { APP_MENU } from '@/config/menu/app.menu'
import { useAuthStore } from '@/stores/useAuthStore'
import { useMbisStore } from '@/stores/useMbisStore'
import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

export default function AppHeader() {
  const location = useLocation()
  const navigate = useNavigate()
  const user = useAuthStore((state) => state.user)
  const clearSession = useAuthStore((state) => state.clearSession)
  const intelligence = useMbisStore((state) => state.nmpIntelligence)
  const [clock, setClock] = useState(() => new Date())
  const [notificationsOpen, setNotificationsOpen] = useState(false)
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
        <div className="header-notifications">
          <button className="header-icon" type="button" aria-label="Peringatan" aria-expanded={notificationsOpen} onClick={() => setNotificationsOpen((value) => !value)}><i className="ph ph-bell" /><b>{Math.min(intelligence?.earlyWarnings.length ?? 0, 99)}</b></button>
          {notificationsOpen && <div className="header-notifications__panel glass-panel"><header><span>EARLY WARNING FEED</span><button type="button" onClick={() => setNotificationsOpen(false)} aria-label="Tutup peringatan"><i className="ph ph-x" /></button></header>{intelligence?.earlyWarnings.slice(0, 4).map((warning) => <button type="button" key={warning.id} onClick={() => { setNotificationsOpen(false); navigate('/early-warning') }}><i className="ph-fill ph-warning" /><span><strong>{warning.title}</strong><small>{new Date(warning.timestamp).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB · {warning.severity}</small></span></button>)}</div>}
        </div>
        <span className="classification-chip">INTERNAL</span>
        <div className="header-user"><span className="avatar-ring"><i className="ph ph-user" /></span><div><strong>{user?.displayName}</strong><small>{user?.role}{user?.readOnly ? ' · READ ONLY' : ''}</small></div></div>
        <button className="header-icon" type="button" onClick={logout} aria-label="Keluar"><i className="ph ph-sign-out" /></button>
      </div>
    </header>
  )
}
