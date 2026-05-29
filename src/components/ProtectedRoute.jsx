import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

/**
 * @component ProtectedRoute
 * @descripción Componente de ruta protegida que verifica autenticación y roles del usuario
 * @param {Object} props - Propiedades del componente
 * @param {React.ReactNode} props.children - Contenido a renderizar si está autorizado
 * @param {string[]} [props.roles] - Lista de roles permitidos para acceder a la ruta
 * @returns {JSX.Element} Los hijos si está autorizado, o redirección al login/dashboard
 */
export default function ProtectedRoute({ children, roles }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600" />
      </div>
    )
  }

  if (!user) return <Navigate to="/login" replace />

  if (roles && !roles.includes(user.role)) {
    const dashboard = user.role === 'admin' ? '/admin' : user.role === 'moderator' ? '/supervisor' : '/user'
    return <Navigate to={dashboard} replace />
  }

  return children
}
