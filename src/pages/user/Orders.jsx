import { useState, useEffect } from 'react'
import { Package, Loader2 } from 'lucide-react'
import { api } from '../../api/client'

const statusStyles = {
  pending: 'bg-amber-100 text-amber-700',
  processing: 'bg-blue-100 text-blue-700',
  completed: 'bg-emerald-100 text-emerald-700',
  shipped: 'bg-blue-100 text-blue-700',
  delivered: 'bg-emerald-100 text-emerald-700',
  cancelled: 'bg-red-100 text-red-700',
  cancelado: 'bg-red-100 text-red-700',
}

const statusLabels = {
  pending: 'Pendiente',
  processing: 'Procesando',
  completed: 'Completado',
  shipped: 'Enviado',
  delivered: 'Entregado',
  cancelled: 'Cancelado',
  cancelado: 'Cancelado',
}

export default function UserOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadOrders()
  }, [])

  async function loadOrders() {
    try {
      setLoading(true)
      const res = await api.orders.list()
      setOrders(res.data || [])
    } catch (err) {
      setError(err.message || 'Error al cargar pedidos')
    } finally {
      setLoading(false)
    }
  }

  async function handleCancel(orderId) {
    if (!confirm('¿Cancelar este pedido?')) return
    try {
      await api.orders.cancel(orderId)
      await loadOrders()
    } catch (err) {
      setError(err.message || 'Error al cancelar pedido')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 size={32} className="animate-spin text-indigo-600" />
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Mis Pedidos</h1>
        <p className="text-slate-500 mt-1">{orders.length} pedidos realizados</p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">{error}</div>
      )}

      {orders.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-slate-200">
          <Package size={48} className="mx-auto text-slate-300 mb-4" />
          <p className="text-slate-500">No hay pedidos aún</p>
          <a href="/user" className="inline-flex items-center gap-2 mt-2 text-sm text-indigo-600 hover:text-indigo-700 font-medium">
            Ir a la tienda
          </a>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const status = order.status || 'pending'
            return (
              <div key={order.id} className="bg-white rounded-xl border border-slate-200 p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-indigo-50">
                      <Package size={18} className="text-indigo-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">Pedido #{order.id}</p>
                      <p className="text-xs text-slate-500">{new Date(order.created_at || order.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${statusStyles[status] || statusStyles.pending}`}>
                    {statusLabels[status] || status}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">{order.items_count || order.items || 0} artículos</span>
                  <span className="font-bold text-slate-900">${parseFloat(order.total || 0).toLocaleString()}</span>
                </div>
                {['pending', 'processing'].includes(status) && (
                  <button onClick={() => handleCancel(order.id)}
                    className="mt-3 text-sm text-red-600 hover:text-red-700 font-medium cursor-pointer">
                    Cancelar pedido
                  </button>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
