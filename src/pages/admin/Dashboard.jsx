import { useState, useEffect } from 'react'
import { api } from '../../api/client'
import {
  Package, ShoppingCart, Users, TrendingUp, TrendingDown, DollarSign,
  AlertTriangle,
} from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, AreaChart, Area,
} from 'recharts'

const monthlyRevenue = [
  { month: 'Ene', revenue: 32000, orders: 28 },
  { month: 'Feb', revenue: 28000, orders: 24 },
  { month: 'Mar', revenue: 35000, orders: 31 },
  { month: 'Abr', revenue: 42000, orders: 36 },
  { month: 'May', revenue: 38000, orders: 33 },
  { month: 'Jun', revenue: 48000, orders: 42 },
  { month: 'Jul', revenue: 45000, orders: 39 },
  { month: 'Ago', revenue: 52000, orders: 45 },
  { month: 'Sep', revenue: 49000, orders: 41 },
  { month: 'Oct', revenue: 55000, orders: 48 },
  { month: 'Nov', revenue: 61000, orders: 53 },
  { month: 'Dic', revenue: 72000, orders: 62 },
]

const orderStatusData = [
  { name: 'Completados', value: 185, color: '#10b981' },
  { name: 'Pendientes', value: 42, color: '#f59e0b' },
  { name: 'Procesando', value: 28, color: '#3b82f6' },
  { name: 'Cancelados', value: 15, color: '#ef4444' },
]

const topProducts = [
  { name: 'Laptop Pro 15"', sales: 87, revenue: 2174913, color: '#6366f1' },
  { name: 'Audífonos ANC', sales: 64, revenue: 223936, color: '#8b5cf6' },
  { name: 'Monitor 27" 4K', sales: 53, revenue: 476947, color: '#a855f7' },
  { name: 'Teclado Mecánico', sales: 48, revenue: 119952, color: '#06b6d4' },
  { name: 'Mouse Inalámbrico', sales: 42, revenue: 54558, color: '#14b8a6' },
  { name: 'Webcam HD Pro', sales: 31, revenue: 58869, color: '#f97316' },
]

const lowStockProducts = [
  { name: 'Monitor 27" 4K', stock: 8, minStock: 10, category: 'Electrónica' },
  { name: 'Webcam HD Pro', stock: 12, minStock: 15, category: 'Accesorios' },
  { name: 'Tablet 11" Pro', stock: 10, minStock: 10, category: 'Electrónica' },
]

const recentOrders = [
  { id: 104, customer: 'María García', items: 2, total: 27498, status: 'completado', time: 'Hace 10 min' },
  { id: 103, customer: 'Juan López', items: 1, total: 8999, status: 'procesando', time: 'Hace 25 min' },
  { id: 102, customer: 'Ana Martínez', items: 3, total: 7297, status: 'completado', time: 'Hace 1h' },
  { id: 101, customer: 'Carlos Ruiz', items: 1, total: 24999, status: 'pendiente', time: 'Hace 2h' },
]

const weeklyVisits = [
  { day: 'Lun', visits: 240, orders: 18 },
  { day: 'Mar', visits: 320, orders: 24 },
  { day: 'Mié', visits: 280, orders: 21 },
  { day: 'Jue', visits: 410, orders: 33 },
  { day: 'Vie', visits: 380, orders: 29 },
  { day: 'Sáb', visits: 200, orders: 15 },
  { day: 'Dom', visits: 150, orders: 11 },
]

const PIE_COLORS = orderStatusData.map(d => d.color)

function formatCurrency(n) {
  return '$' + Number(n).toLocaleString('en-MX')
}

export default function AdminDashboard() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const [products, users, orders] = await Promise.all([
          api.products.list({ limit: 1 }),
          api.users.list(),
          api.orders.list(),
        ])
        const totalProducts = products.total || products.data?.length || 0
        const totalUsers = users.total || users.data?.length || users.length || 0
        const totalOrders = orders.total || orders.data?.length || orders.length || 0
        const monthlyTotal = monthlyRevenue.reduce((s, m) => s + m.revenue, 0)
        setStats({
          products: totalProducts,
          users: totalUsers,
          orders: totalOrders,
          revenue: monthlyTotal,
          revenueGrowth: 23.5,
          ordersGrowth: 18.2,
          usersGrowth: 12.8,
          productsGrowth: 5.3,
        })
      } catch {
        const monthlyTotal = monthlyRevenue.reduce((s, m) => s + m.revenue, 0)
        setStats({
          products: 8,
          users: 8,
          orders: 270,
          revenue: monthlyTotal,
          revenueGrowth: 23.5,
          ordersGrowth: 18.2,
          usersGrowth: 12.8,
          productsGrowth: 5.3,
        })
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const kpiCards = [
    { label: 'Ingresos Totales', value: formatCurrency(stats?.revenue ?? 0), icon: DollarSign, color: 'from-emerald-500 to-emerald-600', bg: 'bg-emerald-50', textColor: 'text-emerald-600', growth: stats?.revenueGrowth ?? 0, prefix: '+' },
    { label: 'Pedidos', value: stats?.orders ?? '—', icon: ShoppingCart, color: 'from-blue-500 to-blue-600', bg: 'bg-blue-50', textColor: 'text-blue-600', growth: stats?.ordersGrowth ?? 0, prefix: '+' },
    { label: 'Usuarios', value: stats?.users ?? '—', icon: Users, color: 'from-purple-500 to-purple-600', bg: 'bg-purple-50', textColor: 'text-purple-600', growth: stats?.usersGrowth ?? 0, prefix: '+' },
    { label: 'Productos', value: stats?.products ?? '—', icon: Package, color: 'from-amber-500 to-amber-600', bg: 'bg-amber-50', textColor: 'text-amber-600', growth: stats?.productsGrowth ?? 0, prefix: '+' },
  ]

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-lg text-xs">
          <p className="font-semibold text-slate-900 mb-1">{label}</p>
          {payload.map((p, i) => (
            <p key={i} style={{ color: p.color }} className="font-medium">
              {p.name}: {p.name === 'Ingresos' ? formatCurrency(p.value) : p.value.toLocaleString()}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-slate-500 mt-1">Panel de control general del sistema</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiCards.map((card) => (
          <div key={card.label} className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-slate-500">{card.label}</span>
              <div className={`p-2.5 rounded-xl ${card.bg}`}>
                <card.icon size={18} className={card.textColor} />
              </div>
            </div>
            <p className="text-2xl font-bold text-slate-900">{card.value}</p>
            <div className={`flex items-center gap-1 mt-2 text-xs font-medium ${card.growth >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
              {card.growth >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
              <span>{card.prefix}{card.growth}% vs mes anterior</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-base font-semibold text-slate-900">Ingresos Mensuales</h2>
              <p className="text-xs text-slate-500 mt-0.5">Enero - Diciembre 2026</p>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-indigo-500" /> Ingresos</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-emerald-400" /> Órdenes</span>
            </div>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyRevenue} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis yAxisId="left" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar yAxisId="left" dataKey="revenue" name="Ingresos" fill="#6366f1" radius={[4, 4, 0, 0]} maxBarSize={32} />
                <Line yAxisId="right" type="monotone" dataKey="orders" name="Órdenes" stroke="#34d399" strokeWidth={2.5} dot={{ r: 3, fill: '#34d399', strokeWidth: 0 }} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-semibold text-slate-900">Estado de Pedidos</h2>
              <p className="text-xs text-slate-500 mt-0.5">Distribución actual</p>
            </div>
          </div>
          <div className="h-52">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={orderStatusData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value">
                  {orderStatusData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2.5 mt-2">
            {orderStatusData.map((item) => (
              <div key={item.name} className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-2 text-slate-600">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                  {item.name}
                </span>
                <span className="font-semibold text-slate-900">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-semibold text-slate-900">Productos Más Vendidos</h2>
              <p className="text-xs text-slate-500 mt-0.5">Por unidades vendidas</p>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topProducts} layout="vertical" barGap={4}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: '#475569' }} axisLine={false} tickLine={false} width={120} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="sales" name="Vendidos" radius={[0, 4, 4, 0]} maxBarSize={20}>
                  {topProducts.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-semibold text-slate-900">Visitas vs Órdenes</h2>
              <p className="text-xs text-slate-500 mt-0.5">Esta semana</p>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weeklyVisits}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="visits" name="Visitas" stroke="#6366f1" fill="#6366f1" fillOpacity={0.1} strokeWidth={2} />
                <Area type="monotone" dataKey="orders" name="Órdenes" stroke="#10b981" fill="#10b981" fillOpacity={0.1} strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-slate-900">Órdenes Recientes</h2>
            <a href="/admin/orders" className="text-xs text-indigo-600 hover:text-indigo-700 font-medium">Ver todas</a>
          </div>
          <div className="space-y-3">
            {recentOrders.map((order) => {
              const statusColor = {
                completado: 'bg-emerald-100 text-emerald-700',
                procesando: 'bg-blue-100 text-blue-700',
                pendiente: 'bg-amber-100 text-amber-700',
                cancelado: 'bg-red-100 text-red-700',
              }[order.status] || 'bg-slate-100 text-slate-700'
              return (
                <div key={order.id} className="flex items-center justify-between py-2.5 border-b border-slate-100 last:border-0">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-xs font-bold text-indigo-600">
                      {order.customer[0]}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-900">#{order.id} · {order.customer}</p>
                      <p className="text-xs text-slate-400">{order.items} artículos · {order.time}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-slate-900">${order.total.toLocaleString()}</p>
                    <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-medium mt-0.5 ${statusColor}`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-slate-900 flex items-center gap-2">
              <AlertTriangle size={16} className="text-amber-500" />
              Stock Bajo
            </h2>
            <a href="/admin/products" className="text-xs text-indigo-600 hover:text-indigo-700 font-medium">Gestionar</a>
          </div>
          {lowStockProducts.length === 0 ? (
            <p className="text-sm text-slate-400 text-center py-8">No hay productos con stock bajo</p>
          ) : (
            <div className="space-y-4">
              {lowStockProducts.map((product) => {
                const ratio = Math.min(product.stock / product.minStock, 1)
                const barColor = ratio < 0.5 ? 'bg-red-500' : ratio < 0.8 ? 'bg-amber-500' : 'bg-yellow-500'
                return (
                  <div key={product.name}>
                    <div className="flex items-center justify-between mb-1.5">
                      <div>
                        <p className="text-sm font-medium text-slate-900">{product.name}</p>
                        <p className="text-xs text-slate-400">{product.category}</p>
                      </div>
                      <div className="text-right">
                        <p className={`text-sm font-bold ${product.stock <= 5 ? 'text-red-600' : 'text-amber-600'}`}>
                          {product.stock}
                        </p>
                        <p className="text-xs text-slate-400">min. {product.minStock}</p>
                      </div>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full transition-all ${barColor}`} style={{ width: `${ratio * 100}%` }} />
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          <div className="mt-6 pt-4 border-t border-slate-100">
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Resumen Rápido</h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Ticket Promedio', value: formatCurrency(12450), icon: DollarSign },
                { label: 'Conversión', value: '8.4%', icon: TrendingUp },
                { label: 'Pedidos/Hoy', value: stats?.orders ? Math.round(stats.orders / 30) : 9, icon: ShoppingCart },
                { label: 'Prod. x Pedido', value: '2.3', icon: Package },
              ].map((item) => (
                <div key={item.label} className="p-3 rounded-lg bg-slate-50">
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
                    <item.icon size={12} />
                    {item.label}
                  </div>
                  <p className="text-lg font-bold text-slate-900">{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
