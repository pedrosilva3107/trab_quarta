// ─── FUNÇÃO CENTRAL DE REQUISIÇÕES ────────────────────────────────────────────
// Toda chamada para a API passa por essa função
// Parâmetros:
//   baseUrl = URL base da API (ex: http://localhost:5144)
//   token   = token JWT do usuário logado (null se for login)
//   method  = método HTTP (GET, POST, PUT, DELETE)
//   path    = caminho do endpoint (ex: /api/oss)
//   body    = dados enviados no corpo da requisição (null para GET e DELETE)
async function request(baseUrl, token, method, path, body = null) {
  // Define os cabeçalhos padrão — informa que o corpo é JSON
  const headers = { 'Content-Type': 'application/json' }

  // Se tiver token (usuário logado), adiciona o cabeçalho de autorização
  // Formato: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  if (token) headers['Authorization'] = `Bearer ${token}`

  // Monta as opções da requisição (método e cabeçalhos)
  const options = { method, headers }

  // Se tiver corpo (POST ou PUT), converte o objeto JS para string JSON
  if (body) options.body = JSON.stringify(body)

  // Executa a requisição HTTP para a URL completa (baseUrl + path)
  const response = await fetch(baseUrl + path, options)

  // 204 = No Content — resposta de sucesso sem corpo (usado em PUT e DELETE)
  // Retorna null pois não há dados para processar
  if (response.status === 204) return null

  // Lê o corpo da resposta como texto
  const text = await response.text()

  // Converte o texto para objeto JS se não estiver vazio, senão null
  const data = text ? JSON.parse(text) : null

  // Se a resposta indicar erro (status 400, 401, 404, 500...), lança uma exceção
  // A mensagem vem do campo "message" do JSON retornado pela API, ou um erro genérico
  if (!response.ok) {
    throw new Error(data?.message || `Erro ${response.status}`)
  }

  // Retorna os dados convertidos para objeto JS
  return data
}

// ─── AUTH ──────────────────────────────────────────────────────────────────────
// Realiza o login enviando e-mail e senha para a API
// Não precisa de token pois o usuário ainda não está autenticado
export function login(baseUrl, email, senha) {
  return request(baseUrl, null, 'POST', '/api/auth/login', { email, senha })
}

// ─── ORDENS DE SERVIÇO ─────────────────────────────────────────────────────────

// Busca todas as OS do banco (GET)
export function getOSs(baseUrl, token) {
  return request(baseUrl, token, 'GET', '/api/oss')
}

// Busca uma OS específica pelo Id (GET com parâmetro na URL)
export function getOS(baseUrl, token, id) {
  return request(baseUrl, token, 'GET', `/api/oss/${id}`)
}

// Cria uma nova OS enviando os dados no corpo (POST)
export function createOS(baseUrl, token, data) {
  return request(baseUrl, token, 'POST', '/api/oss', data)
}

// Atualiza uma OS existente pelo Id (PUT com parâmetro na URL e dados no corpo)
export function updateOS(baseUrl, token, id, data) {
  return request(baseUrl, token, 'PUT', `/api/oss/${id}`, data)
}

// Deleta uma OS pelo Id (DELETE com parâmetro na URL)
export function deleteOS(baseUrl, token, id) {
  return request(baseUrl, token, 'DELETE', `/api/oss/${id}`)
}

// ─── USUÁRIOS ──────────────────────────────────────────────────────────────────

// Busca todos os usuários do banco (GET)
export function getUsuarios(baseUrl, token) {
  return request(baseUrl, token, 'GET', '/api/usuarios')
}

// Busca um usuário específico pelo Id (GET com parâmetro na URL)
export function getUsuario(baseUrl, token, id) {
  return request(baseUrl, token, 'GET', `/api/usuarios/${id}`)
}

// Cria um novo usuário enviando os dados no corpo (POST)
export function createUsuario(baseUrl, token, data) {
  return request(baseUrl, token, 'POST', '/api/usuarios', data)
}

// Atualiza um usuário existente pelo Id (PUT com parâmetro na URL e dados no corpo)
export function updateUsuario(baseUrl, token, id, data) {
  return request(baseUrl, token, 'PUT', `/api/usuarios/${id}`, data)
}

// Deleta um usuário pelo Id (DELETE com parâmetro na URL)
export function deleteUsuario(baseUrl, token, id) {
  return request(baseUrl, token, 'DELETE', `/api/usuarios/${id}`)
}

// ─── CATEGORIAS ────────────────────────────────────────────────────────────────

// Busca todas as categorias do banco (GET)
export function getCategorias(baseUrl, token) {
  return request(baseUrl, token, 'GET', '/api/categorias')
}

// Busca uma categoria específica pelo Id (GET com parâmetro na URL)
export function getCategoria(baseUrl, token, id) {
  return request(baseUrl, token, 'GET', `/api/categorias/${id}`)
}

// Cria uma nova categoria enviando os dados no corpo (POST)
export function createCategoria(baseUrl, token, data) {
  return request(baseUrl, token, 'POST', '/api/categorias', data)
}

// Atualiza uma categoria existente pelo Id (PUT com parâmetro na URL e dados no corpo)
export function updateCategoria(baseUrl, token, id, data) {
  return request(baseUrl, token, 'PUT', `/api/categorias/${id}`, data)
}

// Deleta uma categoria pelo Id (DELETE com parâmetro na URL)
export function deleteCategoria(baseUrl, token, id) {
  return request(baseUrl, token, 'DELETE', `/api/categorias/${id}`)
}
