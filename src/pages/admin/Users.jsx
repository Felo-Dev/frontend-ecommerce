import { useState, useEffect } from 'react'
import { api } from '../../api/client'
import { Plus, Pencil, Trash2, Search, X } from 'lucide-react'

/**
 * @component AdminUsers
 * @descripción Página de administración de usuarios con CRUD, búsqueda y modal de edición
 * @returns {JSX.Element} Tabla de usuarios con acciones de crear, editar y eliminar
 */
export default function AdminUsers() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ username: '', email: '', password: '', roles: ['user'] })

  useEffect(() => { loadUsers() }, [])

  /**
   * @descripción Carga la lista de usuarios desde la API
   */
  async function loadUsers() {
    try {
      const data = await api.users.list()
      setUsers(Array.isArray(data) ? data : data.data || [])
    } catch { setUsers([]) }
    finally { setLoading(false) }
  }

  /**
   * @descripción Guarda un usuario nuevo o actualiza uno existente
   * @param {React.FormEvent} e - Evento de envío del formulario
   */
  async function handleSave(e) {
    e.preventDefault()
    try {
      if (editing) {
        const { password, ...rest } = form
        await api.users.update(editing.id, password ? form : rest)
      } else {
        await api.users.create(form)
      }
      setShowModal(false)
      setEditing(null)
      setForm({ username: '', email: '', password: '', roles: ['user'] })
      loadUsers()
    } catch (err) { alert(err.message) }
  }

  /**
   * @descripción Elimina un usuario por su ID después de confirmar
   * @param {number|string} id - ID del usuario a eliminar
   */
  async function handleDelete(id) {
    if (!confirm('¿Eliminar este usuario?')) return
    try {
      await api.users.delete(id)
      loadUsers()
    } catch (err) { alert(err.message) }
  }

  /**
   * @descripción Abre el modal de edición con los datos del usuario seleccionado
   * @param {Object} user - Datos del usuario a editar
   */
  function openEdit(user) {
    setEditing(user)
    setForm({ username: user.username, email: user.email, password: '', roles: user.roles || ['user'] })
    setShowModal(true)
  }

  const filtered = users.filter((u) =>
    u.username?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Usuarios</h1>
          <p className="text-slate-500 mt-1">{users.length} usuarios registrados</p>
        </div>
        <button
          onClick={() => { setEditing(null); setForm({ username: '', email: '', password: '', roles: ['user'] }); setShowModal(true) }}
          className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-medium transition-colors cursor-pointer"
        >
          <Plus size={16} /> Nuevo Usuario
        </button>
      </div>

      <div className="relative mb-5">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text" placeholder="Buscar usuarios..." value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/50">
              <th className="text-left px-5 py-3 font-medium text-slate-500">ID</th>
              <th className="text-left px-5 py-3 font-medium text-slate-500">Usuario</th>
              <th className="text-left px-5 py-3 font-medium text-slate-500">Email</th>
              <th className="text-left px-5 py-3 font-medium text-slate-500">Roles</th>
              <th className="text-right px-5 py-3 font-medium text-slate-500">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} className="text-center py-12 text-slate-400">Cargando...</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={5} className="text-center py-12 text-slate-400">No hay usuarios</td></tr>
            ) : filtered.map((u) => (
              <tr key={u.id} className="border-b border-slate-50 hover:bg-slate-50/50">
                <td className="px-5 py-3.5 text-slate-500">#{u.id}</td>
                <td className="px-5 py-3.5 font-medium text-slate-900">{u.username}</td>
                <td className="px-5 py-3.5 text-slate-600">{u.email}</td>
                <td className="px-5 py-3.5">
                  <div className="flex gap-1.5">
                    {(u.roles || ['user']).map((r) => (
                      <span key={r} className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        r === 'admin' ? 'bg-purple-100 text-purple-700' :
                        r === 'moderator' ? 'bg-amber-100 text-amber-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>{r}</span>
                    ))}
                  </div>
                </td>
                <td className="px-5 py-3.5 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button onClick={() => openEdit(u)} className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-indigo-600 transition-colors cursor-pointer">
                      <Pencil size={15} />
                    </button>
                    <button onClick={() => handleDelete(u.id)} className="p-2 rounded-lg hover:bg-red-50 text-slate-500 hover:text-red-600 transition-colors cursor-pointer">
                      <Trash2 size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setShowModal(false)}>
          <div className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-semibold text-slate-900">{editing ? 'Editar Usuario' : 'Nuevo Usuario'}</h2>
              <button onClick={() => setShowModal(false)} className="p-1.5 rounded-lg hover:bg-slate-100 cursor-pointer">
                <X size={18} className="text-slate-400" />
              </button>
            </div>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Usuario</label>
                <input type="text" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">{editing ? 'Nueva contraseña (dejar vacío para mantener)' : 'Contraseña'}</label>
                <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  {...(!editing && { required: true })} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Roles</label>
                <div className="flex gap-3">
                  {['user', 'moderator', 'admin'].map((r) => (
                    <label key={r} className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
                      <input type="checkbox" checked={form.roles.includes(r)}
                        onChange={(e) => setForm({
                          ...form,
                          roles: e.target.checked ? [...form.roles, r] : form.roles.filter((x) => x !== r)
                        })}
                        className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
                      {r}
                    </label>
                  ))}
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-300 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer">
                  Cancelar
                </button>
                <button type="submit"
                  className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-medium transition-colors cursor-pointer">
                  {editing ? 'Guardar Cambios' : 'Crear Usuario'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
