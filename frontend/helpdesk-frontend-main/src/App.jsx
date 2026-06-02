import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Navbar from './components/Navbar'
import Toast from './components/Toast'
import PublicPage from './pages/PublicPage'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import OSPage from './pages/OSPage'
import UsuariosPage from './pages/UsuariosPage'
import CategoriasPage from './pages/CategoriasPage'

// Guarda de rota privada: redireciona para /login se não estiver autenticado
function PrivateRoute({ children }) {
  const { user } = useAuth()
  return user ? children : <Navigate to="/login" replace />
}

function AppRoutes() {
  return (
    <>
      <Navbar />
      <Toast />
      <Routes>
        {/* ── Área Pública ── */}
        <Route path="/" element={<PublicPage />} />
        <Route path="/login" element={<LoginPage />} />

        {/* ── Área Privada ── */}
        <Route path="/dashboard" element={<PrivateRoute><DashboardPage /></PrivateRoute>} />
        <Route path="/os" element={<PrivateRoute><OSPage /></PrivateRoute>} />
        <Route path="/usuarios" element={<PrivateRoute><UsuariosPage /></PrivateRoute>} />
        <Route path="/categorias" element={<PrivateRoute><CategoriasPage /></PrivateRoute>} />

        {/* Qualquer rota desconhecida vai para a home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  )
}
