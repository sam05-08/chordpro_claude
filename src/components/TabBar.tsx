import { NavLink } from 'react-router-dom'

const tabs = [
  { to: '/', icon: '♪', label: 'Biblioteca' },
  { to: '/tools', icon: '♬', label: 'Ferramentas' },
  { to: '/favorites', icon: '★', label: 'Favoritos' },
  { to: '/search', icon: '⌕', label: 'Busca' },
  { to: '/profile', icon: '◉', label: 'Perfil' },
  { to: '/settings', icon: '⚙', label: 'Ajustes' },
]

export default function TabBar() {
  return (
    <nav className="tabbar" aria-label="Navegação principal">
      {tabs.map((t) => (
        <NavLink key={t.to} to={t.to} end={t.to === '/'}
          className={({ isActive }) => 'tab' + (isActive ? ' active' : '')}>
          <span aria-hidden>{t.icon}</span>
          <span>{t.label}</span>
        </NavLink>
      ))}
    </nav>
  )
}
