/**
 * @const {string} API_BASE
 * @descripción URL base para las solicitudes a la API
 */
const API_BASE = '/api'

/**
 * @descripción Realiza una solicitud HTTP con manejo de autenticación y renovación de tokens
 * @param {string} endpoint - Ruta del endpoint de la API
 * @param {Object} [options={}] - Opciones de la solicitud (method, headers, body, etc.)
 * @returns {Promise<Object>} Datos de la respuesta parseados como JSON
 */
async function request(endpoint, options = {}) {
  const token = localStorage.getItem('accessToken')
  const headers = { 'Content-Type': 'application/json', ...options.headers }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const res = await fetch(`${API_BASE}${endpoint}`, { ...options, headers })

  if (res.status === 401 && !endpoint.includes('/auth/signin') && !endpoint.includes('/auth/signup')) {
    const refreshed = await tryRefresh()
    if (refreshed) {
      const newToken = localStorage.getItem('accessToken')
      headers['Authorization'] = `Bearer ${newToken}`
      const retryRes = await fetch(`${API_BASE}${endpoint}`, { ...options, headers })
      return handleResponse(retryRes)
    }
    localStorage.clear()
    window.location.href = '/login'
    throw new Error('Sesión expirada')
  }

  return handleResponse(res)
}

/**
 * @descripción Procesa la respuesta HTTP y la convierte en JSON, lanzando error si no es exitosa
 * @param {Response} res - Objeto Response de la solicitud fetch
 * @returns {Promise<Object>} Datos de la respuesta en formato JSON
 * @throws {Error} Error con el mensaje de la API o mensaje por defecto
 */
async function handleResponse(res) {
  let data
  try {
    data = await res.json()
  } catch {
    throw new Error('La respuesta del servidor no es válida. Intente de nuevo.')
  }
  if (!res.ok) {
    throw new Error(data.message || data.error || 'Error en la solicitud')
  }
  return data
}

/**
 * @descripción Intenta renovar el token de acceso usando el refresh token almacenado en localStorage
 * @returns {Promise<boolean>} true si el token se renovó exitosamente, false en caso contrario
 */
async function tryRefresh() {
  const refreshToken = localStorage.getItem('refreshToken')
  if (!refreshToken) return false

  try {
    const res = await fetch(`${API_BASE}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    })

    if (!res.ok) return false

    const data = await res.json()
    localStorage.setItem('accessToken', data.accessToken)
    localStorage.setItem('refreshToken', data.refreshToken)
    return true
  } catch {
    return false
  }
}

/**
 * @const {Object} api
 * @descripción Cliente HTTP con métodos para los distintos recursos de la API
 * @property {Object} auth - Métodos de autenticación (signin, signup, logout, refresh)
 * @property {Object} products - Métodos CRUD de productos (list, get, create, update, delete)
 * @property {Object} users - Métodos CRUD de usuarios (list, get, create, update, delete)
 * @property {Object} orders - Métodos de consulta de pedidos (list, get)
 */
export const api = {
  get: (url) => request(url),
  post: (url, body) => request(url, { method: 'POST', body: JSON.stringify(body) }),
  put: (url, body) => request(url, { method: 'PUT', body: JSON.stringify(body) }),
  delete: (url) => request(url, { method: 'DELETE' }),

  auth: {
    signin: (credentials) =>
      request('/auth/signin', { method: 'POST', body: JSON.stringify(credentials) }),
    signup: (data) =>
      request('/auth/signup', { method: 'POST', body: JSON.stringify(data) }),
    logout: () =>
      request('/auth/logout', { method: 'POST' }),
    refresh: (refreshToken) =>
      request('/auth/refresh', { method: 'POST', body: JSON.stringify({ refreshToken }) }),
  },

  products: {
    list: (params) => request(`/products?${new URLSearchParams(params)}`),
    get: (id) => request(`/products/${id}`),
    create: (data) => request('/products', { method: 'POST', body: JSON.stringify(data) }),
    update: (id, data) => request(`/products/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id) => request(`/products/${id}`, { method: 'DELETE' }),
  },

  users: {
    list: () => request('/users'),
    get: (id) => request(`/users/${id}`),
    create: (data) => request('/users', { method: 'POST', body: JSON.stringify(data) }),
    update: (id, data) => request(`/users/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id) => request(`/users/${id}`, { method: 'DELETE' }),
  },

  orders: {
    list: () => request('/orders'),
    get: (id) => request(`/orders/${id}`),
    cancel: (id) => request(`/orders/${id}/cancel`, { method: 'POST' }),
  },

  cart: {
    get: () => request('/cart'),
    addItem: (data) => request('/cart/items', { method: 'POST', body: JSON.stringify(data) }),
    updateItem: (productId, quantity) => request(`/cart/items/${productId}`, { method: 'PUT', body: JSON.stringify({ quantity }) }),
    removeItem: (productId) => request(`/cart/items/${productId}`, { method: 'DELETE' }),
    checkout: (data) => request('/cart/checkout', { method: 'POST', body: JSON.stringify(data) }),
  },

  invoices: {
    list: (params) => request(`/invoices?${new URLSearchParams(params || {})}`),
    get: (id) => request(`/invoices/${id}`),
    create: (data) => request('/invoices', { method: 'POST', body: JSON.stringify(data) }),
    update: (id, data) => request(`/invoices/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    stamp: (id) => request(`/invoices/${id}/stamp`, { method: 'POST' }),
    cancel: (id, reason) => request(`/invoices/${id}/cancel`, { method: 'POST', body: JSON.stringify({ reason }) }),
    getXml: async (id) => {
      const token = localStorage.getItem('accessToken')
      const res = await fetch(`/api/invoices/${id}/xml`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!res.ok) throw new Error('Error al descargar XML')
      return res.text()
    },
    getPdf: async (id) => {
      const token = localStorage.getItem('accessToken')
      const res = await fetch(`/api/invoices/${id}/pdf`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (!res.ok) throw new Error('Error al descargar PDF')
      return res.text()
    },
  },

  fiscalData: {
    get: () => request('/fiscal-data'),
    save: (data) => request('/fiscal-data', { method: 'PUT', body: JSON.stringify(data) }),
    delete: () => request('/fiscal-data', { method: 'DELETE' }),
  },

  catalogs: {
    taxRegimes: () => request('/catalogs/tax-regimes'),
    cfdiUsages: () => request('/catalogs/cfdi-usages'),
    satProducts: () => request('/catalogs/sat-products'),
    satUnits: () => request('/catalogs/sat-units'),
  },
}
