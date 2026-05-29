import { Package, ShoppingCart, TrendingUp, DollarSign } from 'lucide-react'

/**
 * @component SupervisorDashboard
 * @descripción Panel de supervisor con tarjetas de resumen de productos, pedidos y ventas
 * @returns {JSX.Element} Dashboard con estadísticas y accesos rápidos
 */
export default function SupervisorDashboard() {
  const cards = [
    { label: 'Productos activos', value: '24', icon: Package, color: 'bg-blue-500' },
    { label: 'Pedidos pendientes', value: '8', icon: ShoppingCart, color: 'bg-amber-500' },
    { label: 'Enviados este mes', value: '42', icon: TrendingUp, color: 'bg-emerald-500' },
    { label: 'Ventas del mes', value: '$12,450', icon: DollarSign, color: 'bg-purple-500' },
  ]

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Panel de Supervisor</h1>
        <p className="text-slate-500 mt-1">Monitorea y gestiona productos y pedidos.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {cards.map((card) => (
          <div key={card.label} className="bg-white rounded-xl border border-slate-200 p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-slate-500">{card.label}</span>
              <div className={`p-2 rounded-lg ${card.color} bg-opacity-10`}>
                <card.icon size={18} className={card.color.replace('bg-', 'text-')} />
              </div>
            </div>
            <p className="text-2xl font-bold text-slate-900">{card.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Accesos rápidos</h2>
          <div className="space-y-3">
            {[
              { label: 'Gestionar Productos', href: '/supervisor/products', desc: 'Crear y editar productos del catálogo' },
              { label: 'Ver Pedidos', href: '/supervisor/orders', desc: 'Revisar estado de pedidos' },
            ].map((item) => (
              <a key={item.label} href={item.href}
                className="block p-4 rounded-lg border border-slate-100 hover:border-indigo-200 hover:bg-indigo-50/50 transition-colors">
                <p className="font-medium text-slate-900 text-sm">{item.label}</p>
                <p className="text-xs text-slate-500 mt-0.5">{item.desc}</p>
              </a>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Últimos pedidos</h2>
          <div className="space-y-3">
            {[
              { id: '#1240', user: 'María López', total: '$1,299', status: 'Pendiente' },
              { id: '#1239', user: 'Carlos Ruiz', total: '$459', status: 'Enviado' },
              { id: '#1238', user: 'Ana García', total: '$2,899', status: 'Completado' },
            ].map((o) => (
              <div key={o.id} className="flex items-center justify-between p-3 rounded-lg bg-slate-50">
                <div>
                  <p className="text-sm font-medium text-slate-900">{o.id} - {o.user}</p>
                  <p className="text-xs text-slate-500">{o.total}</p>
                </div>
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                  o.status === 'Pendiente' ? 'bg-amber-100 text-amber-700' :
                  o.status === 'Enviado' ? 'bg-blue-100 text-blue-700' : 'bg-emerald-100 text-emerald-700'
                }`}>{o.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
