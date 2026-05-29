import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard, Package, ShoppingCart, Users, LogOut, Store,
  ClipboardList, ShieldCheck, UserCircle, FileText,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'

/**
 * @const {Object[]} adminLinks
 * @descripción Enlaces de navegación para el rol de administrador
 */
const adminLinks = [
  { to: '/admin', icon: LayoutDashboard, label: 'Dashboard', end: true },
  { to: '/admin/users', icon: Users, label: 'Usuarios' },
  { to: '/admin/products', icon: Package, label: 'Productos' },
  { to: '/admin/orders', icon: ClipboardList, label: 'Pedidos' },
]

/**
 * @const {Object[]} supervisorLinks
 * @descripción Enlaces de navegación para el rol de supervisor/moderador
 */
const supervisorLinks = [
  { to: '/supervisor', icon: LayoutDashboard, label: 'Dashboard', end: true },
  { to: '/supervisor/products', icon: Package, label: 'Productos' },
  { to: '/supervisor/orders', icon: ClipboardList, label: 'Pedidos' },
]

/**
 * @const {Object[]} userLinks
 * @descripción Enlaces de navegación para el rol de usuario
 */
const userLinks = [
  { to: '/user', icon: Store, label: 'Tienda', end: true },
  { to: '/user/cart', icon: ShoppingCart, label: 'Carrito' },
  { to: '/user/orders', icon: ClipboardList, label: 'Mis Pedidos' },
  { to: '/user/fiscal-data', icon: FileText, label: 'Datos Fiscales' },
  { to: '/user/invoices', icon: FileText, label: 'Mis Facturas' },
]

/**
 * @const {Object.<string, Object>} roleConfig
 * @descripción Configuración de la barra lateral según el rol del usuario (enlaces, insignia e ícono)
 */
const roleConfig = {
  admin: { links: adminLinks, badge: 'Admin', badgeClass: 'bg-purple-100 text-purple-700', icon: ShieldCheck },
  moderator: { links: supervisorLinks, badge: 'Supervisor', badgeClass: 'bg-amber-100 text-amber-700', icon: UserCircle },
  user: { links: userLinks, badge: 'Usuario', badgeClass: 'bg-blue-100 text-blue-700', icon: Store },
}

/**
 * @component Sidebar
 * @descripción Barra lateral de navegación con enlaces según el rol del usuario y opción de cerrar sesión
 * @returns {JSX.Element} Barra lateral con navegación y perfil del usuario
 */
export default function Sidebar() {
  const { user, logout } = useAuth()
  const config = roleConfig[user?.role] || roleConfig.user
  const RoleIcon = config.icon

  return (
    <aside className="fixed top-0 left-0 z-40 w-64 h-screen bg-white border-r border-slate-200">
      <div className="flex flex-col h-full">
        <div className="flex items-center gap-3 px-6 h-16 border-b border-slate-200">
          <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-indigo-600 text-white">
            <Store size={18} />
          </div>
          <div>
            <h1 className="text-base font-bold text-slate-900 leading-tight">ShopFlow</h1>
            <p className="text-[11px] text-slate-500 leading-tight">Panel de gestión</p>
          </div>
        </div>

        <div className="px-4 py-3 border-b border-slate-100">
          <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${config.badgeClass}`}>
            <RoleIcon size={13} />
            {config.badge}
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {config.links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-700'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`
              }
            >
              <link.icon size={18} />
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="p-3 border-t border-slate-200">
          <div className="flex items-center gap-3 px-3 py-2 mb-1">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 text-sm font-semibold">
              {user?.id ? String(user.id).slice(0, 2).toUpperCase() : 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-900 truncate">ID: {user?.id}</p>
              <p className="text-xs text-slate-500 capitalize">{user?.role}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut size={18} />
            Cerrar sesión
          </button>
        </div>
      </div>
    </aside>
  )
}
