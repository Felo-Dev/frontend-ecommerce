import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Layout from './components/Layout'
import Login from './pages/Login'

import AdminDashboard from './pages/admin/Dashboard'
import AdminUsers from './pages/admin/Users'
import AdminProducts from './pages/admin/Products'
import AdminOrders from './pages/admin/Orders'

import SupervisorDashboard from './pages/supervisor/Dashboard'
import SupervisorProducts from './pages/supervisor/Products'
import SupervisorOrders from './pages/supervisor/Orders'

import UserProducts from './pages/user/Products'
import UserCart from './pages/user/Cart'
import UserOrders from './pages/user/Orders'
import UserFiscalData from './pages/user/FiscalData'
import UserInvoices from './pages/user/Invoices'

/**
 * @component RoleRedirect
 * @descripción Redirige al usuario al dashboard correspondiente según su rol
 * @returns {JSX.Element} Elemento Navigate a la ruta del rol o al login
 */
function RoleRedirect() {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  const routes = { admin: '/admin', moderator: '/supervisor', user: '/user' }
  return <Navigate to={routes[user.role] || '/user'} replace />
}

/**
 * @component App
 * @descripción Componente principal que define las rutas de la aplicación con protección por roles
 * @returns {JSX.Element} Árbol de rutas de la aplicación
 */
export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<RoleRedirect />} />

      <Route path="/admin" element={
        <ProtectedRoute roles={['admin']}>
          <Layout><AdminDashboard /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/admin/users" element={
        <ProtectedRoute roles={['admin']}>
          <Layout><AdminUsers /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/admin/products" element={
        <ProtectedRoute roles={['admin']}>
          <Layout><AdminProducts /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/admin/orders" element={
        <ProtectedRoute roles={['admin']}>
          <Layout><AdminOrders /></Layout>
        </ProtectedRoute>
      } />

      <Route path="/supervisor" element={
        <ProtectedRoute roles={['moderator']}>
          <Layout><SupervisorDashboard /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/supervisor/products" element={
        <ProtectedRoute roles={['moderator']}>
          <Layout><SupervisorProducts /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/supervisor/orders" element={
        <ProtectedRoute roles={['moderator']}>
          <Layout><SupervisorOrders /></Layout>
        </ProtectedRoute>
      } />

      <Route path="/user" element={
        <ProtectedRoute roles={['user']}>
          <Layout><UserProducts /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/user/cart" element={
        <ProtectedRoute roles={['user']}>
          <Layout><UserCart /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/user/orders" element={
        <ProtectedRoute roles={['user']}>
          <Layout><UserOrders /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/user/fiscal-data" element={
        <ProtectedRoute roles={['user']}>
          <Layout><UserFiscalData /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/user/invoices" element={
        <ProtectedRoute roles={['user']}>
          <Layout><UserInvoices /></Layout>
        </ProtectedRoute>
      } />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
