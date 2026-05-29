import { useState, useEffect } from 'react'
import { api } from '../../api/client'
import { Plus, Pencil, Trash2, Search, X } from 'lucide-react'

/**
 * @component AdminProducts
 * @descripción Página de administración de productos con CRUD, búsqueda y modal de edición
 * @param {Object} props - Propiedades del componente
 * @param {string} [props.role='admin'] - Rol del usuario para determinar permisos de edición
 * @returns {JSX.Element} Tabla de productos con acciones de crear, editar y eliminar
 */
export default function AdminProducts({ role = 'admin' }) {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ name: '', description: '', price: '', stock: '', category: '' })

  useEffect(() => { loadProducts() }, [])

  /**
   * @descripción Carga la lista de productos desde la API
   */
  async function loadProducts() {
    try {
      const data = await api.products.list({ limit: 100 })
      setProducts(Array.isArray(data) ? data : data.data || [])
    } catch { setProducts([]) }
    finally { setLoading(false) }
  }

  /**
   * @descripción Guarda un producto nuevo o actualiza uno existente
   * @param {React.FormEvent} e - Evento de envío del formulario
   */
  async function handleSave(e) {
    e.preventDefault()
    try {
      const payload = { ...form, price: Number(form.price), stock: Number(form.stock) }
      if (editing) {
        await api.products.update(editing.id, payload)
      } else {
        await api.products.create(payload)
      }
      setShowModal(false)
      setEditing(null)
      setForm({ name: '', description: '', price: '', stock: '', category: '' })
      loadProducts()
    } catch (err) { alert(err.message) }
  }

  /**
   * @descripción Elimina un producto por su ID después de confirmar
   * @param {number|string} id - ID del producto a eliminar
   */
  async function handleDelete(id) {
    if (!confirm('¿Eliminar este producto?')) return
    try {
      await api.products.delete(id)
      loadProducts()
    } catch (err) { alert(err.message) }
  }

  /**
   * @descripción Abre el modal de edición con los datos del producto seleccionado
   * @param {Object} product - Datos del producto a editar
   */
  function openEdit(product) {
    setEditing(product)
    setForm({ name: product.name, description: product.description || '', price: String(product.price), stock: String(product.stock), category: product.category || '' })
    setShowModal(true)
  }

  const filtered = products.filter((p) =>
    p.name?.toLowerCase().includes(search.toLowerCase()) ||
    p.category?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Productos</h1>
          <p className="text-slate-500 mt-1">{products.length} productos en el catálogo</p>
        </div>
        <button
          onClick={() => { setEditing(null); setForm({ name: '', description: '', price: '', stock: '', category: '' }); setShowModal(true) }}
          className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-medium transition-colors cursor-pointer"
        >
          <Plus size={16} /> Nuevo Producto
        </button>
      </div>

      <div className="relative mb-5">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
        <input type="text" placeholder="Buscar productos..." value={search} onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/50">
              <th className="text-left px-5 py-3 font-medium text-slate-500">ID</th>
              <th className="text-left px-5 py-3 font-medium text-slate-500">Nombre</th>
              <th className="text-left px-5 py-3 font-medium text-slate-500">Categoría</th>
              <th className="text-right px-5 py-3 font-medium text-slate-500">Precio</th>
              <th className="text-right px-5 py-3 font-medium text-slate-500">Stock</th>
              {(role === 'admin') && <th className="text-right px-5 py-3 font-medium text-slate-500">Acciones</th>}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={role === 'admin' ? 6 : 5} className="text-center py-12 text-slate-400">Cargando...</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={role === 'admin' ? 6 : 5} className="text-center py-12 text-slate-400">No hay productos</td></tr>
            ) : filtered.map((p) => (
              <tr key={p.id} className="border-b border-slate-50 hover:bg-slate-50/50">
                <td className="px-5 py-3.5 text-slate-500">#{p.id}</td>
                <td className="px-5 py-3.5 font-medium text-slate-900">{p.name}</td>
                <td className="px-5 py-3.5">
                  <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
                    {p.category || 'General'}
                  </span>
                </td>
                <td className="px-5 py-3.5 text-right font-medium text-slate-900">${Number(p.price).toLocaleString()}</td>
                <td className="px-5 py-3.5 text-right">
                  <span className={`font-medium ${Number(p.stock) < 10 ? 'text-red-600' : 'text-emerald-600'}`}>
                    {p.stock}
                  </span>
                </td>
                {role === 'admin' && (
                  <td className="px-5 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => openEdit(p)} className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-indigo-600 transition-colors cursor-pointer">
                        <Pencil size={15} />
                      </button>
                      <button onClick={() => handleDelete(p.id)} className="p-2 rounded-lg hover:bg-red-50 text-slate-500 hover:text-red-600 transition-colors cursor-pointer">
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-semibold text-slate-900">{editing ? 'Editar Producto' : 'Nuevo Producto'}</h2>
              <button onClick={() => setShowModal(false)} className="p-1.5 rounded-lg hover:bg-slate-100 cursor-pointer">
                <X size={18} className="text-slate-400" />
              </button>
            </div>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Nombre</label>
                <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Descripción</label>
                <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" rows={3} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Precio</label>
                  <input type="number" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Stock</label>
                  <input type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" required />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Categoría</label>
                <input type="text" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-300 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer">
                  Cancelar
                </button>
                <button type="submit"
                  className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-medium transition-colors cursor-pointer">
                  {editing ? 'Guardar Cambios' : 'Crear Producto'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
