// Importa os componentes de roteamento do React Router
// Routes = container de rotas | Route = uma rota específica | Navigate = redirecionamento
import { Routes, Route, Navigate } from 'react-router-dom'
// Importa o Provider e o hook de autenticação do contexto criado
import { AuthProvider, useAuth } from './context/AuthContext'
// Importa os componentes globais (aparecem em todas as páginas)
import Navbar from './components/Navbar'
import Toast from './components/Toast'
// Importa todas as páginas da aplicação
import PublicPage from './pages/PublicPage'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import OSPage from './pages/OSPage'
import UsuariosPage from './pages/UsuariosPage'
import CategoriasPage from './pages/CategoriasPage'

// Componente "Guarda de Rota" — protege páginas que exigem login
// Se o usuário não estiver autenticado, redireciona para /login
function PrivateRoute({ children }) {
  const { user } = useAuth() // Pega o usuário do contexto de autenticação

  // Se "user" tiver valor = está logado → mostra a página normalmente
  // Se "user" for null = não está logado → redireciona para /login
  // "replace" evita que a página protegida fique no histórico do navegador
  return user ? children : <Navigate to="/login" replace />
}

// Componente que define todas as rotas da aplicação
function AppRoutes() {
  return (
    <>
      {/* Navbar aparece em todas as páginas (fora do Routes) */}
      <Navbar />
      {/* Toast aparece em todas as páginas (notificações de sucesso/erro) */}
      <Toast />

      {/* Container de rotas — só uma rota é renderizada por vez */}
      <Routes>
        {/* ── Área Pública — qualquer pessoa acessa ── */}
        <Route path="/" element={<PublicPage />} />           {/* Página inicial */}
        <Route path="/login" element={<LoginPage />} />       {/* Página de login */}

        {/* ── Área Privada — só usuários logados acessam ── */}
        {/* Cada rota é envolta pelo PrivateRoute que verifica o login */}
        <Route path="/dashboard" element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
        <Route path="/os" element={<PrivateRoute><OSPage /></PrivateRoute>} />
        <Route path="/usuarios" element={<PrivateRoute><UsuariosPage /></PrivateRoute>} />
        <Route path="/categorias" element={<PrivateRoute><CategoriasPage /></PrivateRoute>} />

        {/* Rota coringa — qualquer URL não reconhecida redireciona para a home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
}

// Componente raiz da aplicação
// AuthProvider envolve tudo para que o contexto de autenticação esteja disponível em toda a app
export default function App() {
  return (
    <AuthProvider>
      <AppRoutes /> {/* Renderiza as rotas dentro do contexto de autenticação */}
    </AuthProvider>
  )
}
