import { authService, demoAccountRoles } from '@/services/auth.service'
import { useAuthStore } from '@/stores/useAuthStore'
import type { TUserRole } from '@/types/mbis'
import { type FormEvent, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const ROLE_ICONS: Record<TUserRole, string> = {
  Administrator: 'gear-six', Pimpinan: 'star', Supervisor: 'shield-check', Analis: 'binoculars', Auditor: 'scales',
}

export default function LoginPage() {
  const navigate = useNavigate()
  const setSession = useAuthStore((state) => state.setSession)
  const [username, setUsername] = useState('Analis')
  const [password, setPassword] = useState('Analis123')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')

  const selectRole = (role: TUserRole) => {
    const credential = authService.credentialsFor(role)
    setUsername(credential.username)
    setPassword(credential.password)
    setError('')
  }

  const submit = (event: FormEvent) => {
    event.preventDefault()
    const user = authService.login(username.trim(), password)
    if (!user) {
      setError('Kredensial tidak cocok. Gunakan salah satu akun operasi yang tersedia.')
      return
    }
    sessionStorage.removeItem('mbis-sidebar-state')
    setSession(user)
    navigate('/', { replace: true })
  }

  return (
    <main className="login-screen">
      <div className="login-radar" aria-hidden="true"><span /><i /><i /><i /></div>
      <section className="login-intro">
        <div className="login-brand"><img src="/logo.svg" alt="Logo MBIS" /><div><strong>MBIS</strong><span>Maritime & Border Intelligence System</span></div></div>
        <div className="login-kicker"><i />NATIONAL INTELLIGENCE FUSION ENVIRONMENT</div>
        <h1>Unified maritime and border<br /><em>operational picture.</em></h1>
        <p>Antarmuka command intelligence untuk pemantauan lintas-domain, triase anomali, early warning, dan produk intelijen eksekutif.</p>
        <div className="login-status-grid">
          <div><span>MAP ENGINE</span><strong>GLOBE / SATELLITE</strong></div>
          <div><span>DATA MODE</span><strong>LOCAL FIXTURE</strong></div>
          <div><span>UI PROFILE</span><strong>TACTICAL NEON</strong></div>
        </div>
      </section>
      <section className="login-console">
        <div className="console-index">ACCESS NODE · MBIS/OPS-01</div>
        <header><span className="console-mark"><i className="ph ph-fingerprint" /></span><div><h2>Operator authentication</h2><p>Development environment · MFA bypass enabled</p></div></header>
        <form onSubmit={submit}>
          <label>USERNAME<input value={username} onChange={(event) => setUsername(event.target.value)} autoComplete="username" spellCheck={false} /></label>
          <label>PASSWORD<div className="password-control"><input type={showPassword ? 'text' : 'password'} value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" /><button type="button" onClick={() => setShowPassword((value) => !value)} aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}><i className={`ph ph-eye${showPassword ? '-slash' : ''}`} /></button></div></label>
          {error && <div className="login-error" role="alert"><i className="ph ph-warning" />{error}</div>}
          <button className="login-submit" type="submit"><span>ENTER OPERATIONAL PICTURE</span><i className="ph ph-arrow-right" /></button>
        </form>
        <div className="account-selector">
          <div><span>DEMO IDENTITY PROFILES</span><small>Klik untuk mengisi kredensial</small></div>
          <div className="account-selector__grid">
            {demoAccountRoles.map((role) => <button key={role} type="button" onClick={() => selectRole(role)} className={username === role ? 'is-selected' : ''}><i className={`ph ph-${ROLE_ICONS[role]}`} /><span>{role}</span><code>{role}123</code></button>)}
          </div>
        </div>
        <footer><span><i className="ph ph-shield-check" /> LOCAL SESSION ONLY</span><span>CLASSIFICATION · INTERNAL</span></footer>
      </section>
    </main>
  )
}
