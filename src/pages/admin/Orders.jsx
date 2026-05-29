import { useState } from 'react'
import { Search, Eye } from 'lucide-react'

/**
 * @const {Object[]} mockOrders
 * @descripción Datos de ejemplo de pedidos para el panel de administración
 */
const mockOrders = [
  { id: 1, user: 'juan@mail.com', items: 3, total: 2599, status: 'completado', date: '2026-05-20' },
  { id: 2, user: 'maria@mail.com', items: 1, total: 1299, status: 'pendiente', date: '2026-05-21' },
  { id: 3, user: 'carlos@mail.com', items: 5, total: 4899, status: 'enviado', date: '2026-05-19' },
  { id: 4, user: 'ana@mail.com', items: 2, total: 799, status: 'cancelado', date: '2026-05-18' },
  { id: 5, user: 'luis@mail.com', items: 4, total: 3599, status: 'pendiente', date: '2026-05-22' },
]

/**
 * @const {Object.<string, string>} statusStyles
 * @descripción Mapa de clases de estilo para cada estado de pedido
 */
const statusStyles = {
  completado: 'bg-emerald-100 text-emerald-700',
  pendiente: 'bg-amber-100 text-amber-700',
  enviado: 'bg-blue-100 text-blue-700',
  cancelado: 'bg-red-100 text-red-700',
}

/**
 * @component AdminOrders
 * @descripción Página de listado de pedidos con búsqueda y visualización de estado
 * @returns {JSX.Element} Tabla de pedidos con filtros
 */
export default function AdminOrders() {
  const [search, setSearch] = useState('')
  const [orders] = useState(mockOrders)

  const filtered = orders.filter((o) =>
    String(o.id).includes(search) || o.user.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Pedidos</h1>
        <p className="text-slate-500 mt-1">{orders.length} pedidos registrados</p>
      </div>

      <div className="relative mb-5">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
        <input type="text" placeholder="Buscar por ID o email..." value={search} onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/50">
              <th className="text-left px-5 py-3 font-medium text-slate-500">ID</th>
              <th className="text-left px-5 py-3 font-medium text-slate-500">Usuario</th>
              <th className="text-center px-5 py-3 font-medium text-slate-500">Artículos</th>
              <th className="text-right px-5 py-3 font-medium text-slate-500">Total</th>
              <th className="text-center px-5 py-3 font-medium text-slate-500">Estado</th>
              <th className="text-left px-5 py-3 font-medium text-slate-500">Fecha</th>
              <th className="text-center px-5 py-3 font-medium text-slate-500">Acción</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((o) => (
              <tr key={o.id} className="border-b border-slate-50 hover:bg-slate-50/50">
                <td className="px-5 py-3.5 text-slate-500">#{o.id}</td>
                <td className="px-5 py-3.5 font-medium text-slate-900">{o.user}</td>
                <td className="px-5 py-3.5 text-center text-slate-600">{o.items}</td>
                <td className="px-5 py-3.5 text-right font-medium text-slate-900">${o.total.toLocaleString()}</td>
                <td className="px-5 py-3.5 text-center">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusStyles[o.status]}`}>
                    {o.status.charAt(0).toUpperCase() + o.status.slice(1)}
                  </span>
                </td>
                <td className="px-5 py-3.5 text-slate-500">{o.date}</td>
                <td className="px-5 py-3.5 text-center">
                  <button className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-indigo-600 transition-colors cursor-pointer">
                    <Eye size={15} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
