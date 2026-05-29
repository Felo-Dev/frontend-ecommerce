import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ShoppingCart, Trash2, ArrowLeft, Loader2, FileText } from 'lucide-react'
import { api } from '../../api/client'

export default function UserCart() {
  const navigate = useNavigate()
  const [cartItems, setCartItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [checkingOut, setCheckingOut] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const [requestInvoice, setRequestInvoice] = useState(false)

  useEffect(() => {
    loadCart()
  }, [])

  async function loadCart() {
    try {
      setLoading(true)
      const res = await api.cart.get()
      setCartItems(res.data?.items || [])
    } catch (err) {
      setError('Error al cargar el carrito')
    } finally {
      setLoading(false)
    }
  }

  async function handleRemove(productId) {
    try {
      await api.cart.removeItem(productId)
      setCartItems(prev => prev.filter(i => i.product_id !== productId && i.productId !== productId))
    } catch (err) {
      setError('Error al eliminar producto')
    }
  }

  async function handleUpdateQty(productId, delta) {
    const item = cartItems.find(i => i.product_id === productId || i.productId === productId)
    if (!item) return
    const newQty = (item.quantity || item.qty) + delta
    if (newQty <= 0) {
      await handleRemove(productId)
      return
    }
    try {
      await api.cart.updateItem(productId, newQty)
      setCartItems(prev => prev.map(i =>
        (i.product_id === productId || i.productId === productId)
          ? { ...i, quantity: newQty, qty: newQty }
          : i
      ))
    } catch (err) {
      setError('Error al actualizar cantidad')
    }
  }

  async function handleCheckout() {
    try {
      setCheckingOut(true)
      setError(null)
      const data = {
        shippingAddress: {
          street: 'Calle Principal 123',
          city: 'Ciudad de México',
          state: 'CDMX',
          zipCode: '06600',
          country: 'México',
        },
        paymentMethod: 'credit_card',
        notes: requestInvoice ? 'Solicitar factura' : '',
      }
      const order = await api.cart.checkout(data)
      setSuccess(`¡Pedido #${order.data?.id || order.id} creado con éxito!${requestInvoice ? ' La factura se generará automáticamente si tienes datos fiscales configurados.' : ''}`)
      setCartItems([])
    } catch (err) {
      setError(err.message || 'Error al procesar el pago')
    } finally {
      setCheckingOut(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 size={32} className="animate-spin text-indigo-600" />
      </div>
    )
  }

  const total = cartItems.reduce((sum, item) => {
    const qty = item.quantity || item.qty || 1
    return sum + (parseFloat(item.price) || 0) * qty
  }, 0)

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Tu Carrito</h1>
        <p className="text-slate-500 mt-1">{cartItems.length} artículos</p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">{error}</div>
      )}
      {success && (
        <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-sm text-emerald-700">{success}</div>
      )}

      {cartItems.length === 0 && !loading ? (
        <div className="text-center py-16 bg-white rounded-xl border border-slate-200">
          <ShoppingCart size={48} className="mx-auto text-slate-300 mb-4" />
          <p className="text-slate-500 mb-4">Tu carrito está vacío</p>
          <a href="/user" className="inline-flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-700 font-medium">
            <ArrowLeft size={16} /> Seguir comprando
          </a>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => {
              const id = item.product_id || item.productId || item.id
              const name = item.name || item.product_name || `Producto #${id}`
              const qty = item.quantity || item.qty || 1
              const price = parseFloat(item.price) || 0
              const image = item.image || '📦'
              return (
                <div key={id} className="bg-white rounded-xl border border-slate-200 p-5 flex items-center gap-5">
                  <div className="text-3xl">{image}</div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-slate-900">{name}</h3>
                    <p className="text-sm text-slate-500">${price.toLocaleString()} c/u</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center border border-slate-300 rounded-lg">
                      <button onClick={() => handleUpdateQty(id, -1)} className="p-2 hover:bg-slate-50 cursor-pointer">
                        <span className="text-sm text-slate-500 px-1">-</span>
                      </button>
                      <span className="px-3 text-sm font-medium text-slate-900">{qty}</span>
                      <button onClick={() => handleUpdateQty(id, 1)} className="p-2 hover:bg-slate-50 cursor-pointer">
                        <span className="text-sm text-slate-500 px-1">+</span>
                      </button>
                    </div>
                    <p className="font-semibold text-slate-900 w-24 text-right">${(price * qty).toLocaleString()}</p>
                    <button onClick={() => handleRemove(id)} className="p-2 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors cursor-pointer">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              )
            })}

            <a href="/user" className="inline-flex items-center gap-2 text-sm text-indigo-600 hover:text-indigo-700 font-medium">
              <ArrowLeft size={16} /> Seguir comprando
            </a>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-6 h-fit">
            <h2 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <ShoppingCart size={18} className="text-indigo-600" /> Resumen
            </h2>
            <div className="space-y-3 text-sm">
              {cartItems.map((item) => {
                const id = item.product_id || item.productId || item.id
                const name = item.name || item.product_name || `Producto #${id}`
                const qty = item.quantity || item.qty || 1
                const price = parseFloat(item.price) || 0
                return (
                  <div key={id} className="flex justify-between text-slate-600">
                    <span className="truncate">{name} x{qty}</span>
                    <span>${(price * qty).toLocaleString()}</span>
                  </div>
                )
              })}
            </div>
            <div className="border-t border-slate-200 mt-4 pt-4">
              <div className="flex justify-between font-semibold text-slate-900 text-base">
                <span>Total</span>
                <span>${total.toLocaleString()}</span>
              </div>
            </div>

            <label className="flex items-center gap-2 mt-4 text-sm text-slate-600 cursor-pointer">
              <input type="checkbox" checked={requestInvoice} onChange={e => setRequestInvoice(e.target.checked)}
                className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
              <FileText size={14} />
              Solicitar factura
            </label>

            <button onClick={handleCheckout} disabled={checkingOut || cartItems.length === 0}
              className="w-full mt-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white rounded-xl text-sm font-medium transition-colors cursor-pointer disabled:cursor-not-allowed flex items-center justify-center gap-2">
              {checkingOut ? <Loader2 size={16} className="animate-spin" /> : null}
              {checkingOut ? 'Procesando...' : 'Proceder al pago'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
