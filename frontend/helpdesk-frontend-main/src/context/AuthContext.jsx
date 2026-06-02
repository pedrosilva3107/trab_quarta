// Importa os hooks do React para criar contexto e gerenciar estado
import { createContext, useContext, useState } from 'react'

// Cria o contexto de autenticação
// Context é como uma "variável global" do React — qualquer componente da árvore pode acessá-la
// O valor inicial é null (nenhum usuário logado)
const AuthContext = createContext(null)

// AuthProvider é o componente que FORNECE os dados de autenticação para toda a aplicação
// Ele envolve a aplicação no App.jsx, tornando os dados acessíveis em qualquer página
export function AuthProvider({ children }) {
  // Estado que guarda o token JWT recebido após o login
  // Começa null (usuário não autenticado)
  const [token, setToken] = useState(null)

  // Estado que guarda os dados do usuário logado (id, nome, email)
  // Começa null (nenhum usuário logado)
  const [user, setUser] = useState(null)

  // Estado que guarda a URL base da API
  // Começa com o valor padrão — o usuário pode alterar na tela de login
  const [apiUrl, setApiUrl] = useState('http://localhost:5000')

  // Função chamada após o login bem-sucedido
  // Salva o token e os dados do usuário nos estados
  function login(tokenValue, userData) {
    setToken(tokenValue) // Armazena o JWT para usar nas requisições autenticadas
    setUser(userData)    // Armazena os dados do usuário para exibir na interface
  }

  // Função chamada quando o usuário clica em "Sair"
  // Limpa o token e os dados do usuário (efetua o logout)
  function logout() {
    setToken(null) // Remove o token
    setUser(null)  // Remove os dados do usuário
  }

  // O Provider disponibiliza os valores para todos os componentes filhos
  // Qualquer componente que usar useAuth() terá acesso a: token, user, apiUrl, setApiUrl, login, logout
  return (
    <AuthContext.Provider value={{ token, user, apiUrl, setApiUrl, login, logout }}>
      {children} {/* Renderiza todos os componentes filhos (toda a aplicação) */}
    </AuthContext.Provider>
  )
}

// Hook personalizado para acessar o contexto de autenticação de forma simples
// Em vez de escrever useContext(AuthContext) em todo lugar, basta chamar useAuth()
export function useAuth() {
  return useContext(AuthContext)
}
