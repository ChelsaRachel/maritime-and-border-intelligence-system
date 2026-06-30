import { ROUTE_ACCESS } from '@/config/access-config'
import { APP_MENU } from '@/config/menu/app.menu'
import { useAuthStore } from '@/stores/useAuthStore'
import { NavLink } from 'react-router-dom'

interface IAppSidebarProps { collapsed: boolean; onToggle: () => void }

export default function AppSidebar({ collapsed, onToggle }: IAppSidebarProps) {
  const user = useAuthStore((state) => state.user)
  const visibleMenu = APP_MENU.filter((item) => user && ROUTE_ACCESS[item.path]?.includes(user.role))

  return (
    <aside className={`app-sidebar ${collapsed ? 'app-sidebar--collapsed' : ''}`} aria-label="Navigasi utama">
      <div className="app-sidebar__brand">
        <img src="/logo.svg" alt="MBIS" />
        {!collapsed && <div><strong>MBIS</strong><span>Maritime & Border<br />Intelligence System</span></div>}
      </div>
      <nav className="app-sidebar__nav">
        {visibleMenu.map((item) => (
          <NavLink key={item.id} to={item.path} end={item.path === '/'} title={collapsed ? item.display : undefined} className={({ isActive }) => `app-sidebar__link ${isActive ? 'is-active' : ''}`}>
            <i className={`ph ph-${item.icon}`} aria-hidden="true" />
            {!collapsed && <span>{item.display}</span>}
          </NavLink>
        ))}
      </nav>
      <div className="app-sidebar__footer">
        {!collapsed && user && <div className="sidebar-user"><span className="avatar-ring"><i className="ph ph-user" /></span><div><strong>{user.displayName}</strong><small>{user.unit}</small></div></div>}
        <button type="button" className="rail-toggle" onClick={onToggle} aria-label={collapsed ? 'Perluas sidebar' : 'Tutup sidebar'} aria-expanded={!collapsed}>
          <i className={`ph ph-caret-${collapsed ? 'right' : 'left'}`} aria-hidden="true" />
          {!collapsed && <span>Collapse rail</span>}
        </button>
      </div>
    </aside>
  )
}
