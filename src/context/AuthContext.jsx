import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { api } from '../api/client'

/**
 * @const {React.Context} AuthContext
 * @descripción Contexto de autenticación compartido en toda la aplicación
 */
const AuthContext = createContext(null)

/**
 * @descripción Decodifica un token JWT extrayendo su payload
 * @param {string} token - Token JWT a decodificar
 * @returns {Object|null} Payload del token decodificado o null si es inválido
 */
function decodeToken(token) {
  try {
    return JSON.parse(atob(token.split('.')[1]))
  } catch {
    return null
  }
}

/**
 * @component AuthProvider
 * @descripción Proveedor de autenticación que gestiona el estado del usuario, login, registro y logout
 * @param {Object} props - Propiedades del componente
 * @param {React.ReactNode} props.children - Componentes hijos que tendrán acceso al contexto
 * @returns {JSX.Element} Provider del contexto de autenticación
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('accessToken')
    if (token) {
      const payload = decodeToken(token)
      if (payload && payload.exp * 1000 > Date.now()) {
        setUser({ id: payload.id, role: payload.role || 'user' })
      } else {
        localStorage.clear()
      }
    }
    setLoading(false)
  }, [])

  const signin = useCallback(async (username, password) => {
    const data = await api.auth.signin({ username, password })
    localStorage.setItem('accessToken', data.accessToken)
    localStorage.setItem('refreshToken', data.refreshToken)
    const payload = decodeToken(data.accessToken)
    const userData = { id: payload.id, role: payload.role || 'user' }
    setUser(userData)
    return userData
  }, [])

  const signup = useCallback(async (userData) => {
    const data = await api.auth.signup(userData)
    localStorage.setItem('accessToken', data.accessToken)
    localStorage.setItem('refreshToken', data.refreshToken)
    const payload = decodeToken(data.accessToken)
    const newUser = { id: payload.id, role: payload.role || 'user' }
    setUser(newUser)
    return newUser
  }, [])

  const logout = useCallback(async () => {
    try {
      await api.auth.logout()
    } catch {
    } finally {
      localStorage.clear()
      setUser(null)
      window.location.href = '/login'
    }
  }, [])

  return (
    <AuthContext.Provider value={{ user, loading, signin, signup, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

/**
 * @descripción Hook personalizado para acceder al contexto de autenticación
 * @returns {Object} Objeto con user, loading, signin, signup y logout
 * @throws {Error} Si se usa fuera de un AuthProvider
 */
export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider')
  return ctx
}
