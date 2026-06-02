// Função central que faz todas as requisições para a API
async function request(baseUrl, token, method, path, body = null) {
  const headers = { 'Content-Type': 'application/json' }
  if (token) headers['Authorization'] = `Bearer ${token}`

  const options = { method, headers }
  if (body) options.body = JSON.stringify(body)

  const response = await fetch(baseUrl + path, options)

  if (response.status === 204) return null

  const text = await response.text()
  const data = text ? JSON.parse(text) : null

  if (!response.ok) {
    throw new Error(data?.message || `Erro ${response.status}`)
  }

  return data
}

// ─── AUTH ──────────────────────────────────────────────
export function login(baseUrl, email, senha) {
  return request(baseUrl, null, 'POST', '/api/auth/login', { email, senha })
}

// ─── ORDENS DE SERVIÇO ─────────────────────────────────
export function getOSs(baseUrl, token) {
  return request(baseUrl, token, 'GET', '/api/oss')
}

export function getOS(baseUrl, token, id) {
  return request(baseUrl, token, 'GET', `/api/oss/${id}`)
}

export function createOS(baseUrl, token, data) {
  return request(baseUrl, token, 'POST', '/api/oss', data)
}

export function updateOS(baseUrl, token, id, data) {
  return request(baseUrl, token, 'PUT', `/api/oss/${id}`, data)
}

export function deleteOS(baseUrl, token, id) {
  return request(baseUrl, token, 'DELETE', `/api/oss/${id}`)
}

// ─── USUÁRIOS ──────────────────────────────────────────
export function getUsuarios(baseUrl, token) {
  return request(baseUrl, token, 'GET', '/api/usuarios')
}

export function getUsuario(baseUrl, token, id) {
  return request(baseUrl, token, 'GET', `/api/usuarios/${id}`)
}

export function createUsuario(baseUrl, token, data) {
  return request(baseUrl, token, 'POST', '/api/usuarios', data)
}

export function updateUsuario(baseUrl, token, id, data) {
  return request(baseUrl, token, 'PUT', `/api/usuarios/${id}`, data)
}

export function deleteUsuario(baseUrl, token, id) {
  return request(baseUrl, token, 'DELETE', `/api/usuarios/${id}`)
}

// ─── CATEGORIAS ────────────────────────────────────────
export function getCategorias(baseUrl, token) {
  return request(baseUrl, token, 'GET', '/api/categorias')
}

export function getCategoria(baseUrl, token, id) {
  return request(baseUrl, token, 'GET', `/api/categorias/${id}`)
}

export function createCategoria(baseUrl, token, data) {
  return request(baseUrl, token, 'POST', '/api/categorias', data)
}

export function updateCategoria(baseUrl, token, id, data) {
  return request(baseUrl, token, 'PUT', `/api/categorias/${id}`, data)
}

export function deleteCategoria(baseUrl, token, id) {
  return request(baseUrl, token, 'DELETE', `/api/categorias/${id}`)
}
