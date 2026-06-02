// Importa hooks do React Router para navegação e detecção da rota atual
import { useNavigate, useLocation } from 'react-router-dom'
// Importa o contexto de autenticação para saber se o usuário está logado e fazer logout
import { useAuth } from '../context/AuthContext'
// Importa o CSS específico deste componente (CSS Modules — estilos isolados)
import styles from './Navbar.module.css'

export default function Navbar() {
  // Pega o usuário logado e a função de logout do contexto global
  const { user, logout } = useAuth()

  // useNavigate retorna uma função para redirecionar para outra rota programaticamente
  const navigate = useNavigate()

  // useLocation retorna o objeto da rota atual (pathname, search, hash, etc.)
  const location = useLocation()

  // Função chamada ao clicar em "Sair"
  function handleLogout() {
    logout()      // Limpa o token e os dados do usuário no contexto
    navigate('/') // Redireciona para a página inicial
  }

  // Função auxiliar que retorna a classe CSS "active" se a rota atual bater com "path"
  // Usada para destacar o link da página que está sendo visitada
  const isActive = (path) => location.pathname === path ? styles.active : ''

  return (
    <nav className={styles.nav}>
      {/* Logo / Nome do sistema */}
      <div className={styles.logo}>
        <i className="ti ti-headset" /> {/* Ícone de fone de ouvido (Tabler Icons) */}
        HelpDesk
      </div>

      {/* Links de navegação */}
      <div className={styles.links}>
        {/* Link "Início" — sempre visível */}
        <button className={`${styles.link} ${isActive('/')}`} onClick={() => navigate('/')}>
          Início
        </button>

        {/* Links da área privada — só aparecem se o usuário estiver logado */}
        {user && (
          <>
            <button className={`${styles.link} ${isActive('/dashboard')}`} onClick={() => navigate('/dashboard')}>
              Dashboard
            </button>
            <button className={`${styles.link} ${isActive('/os')}`} onClick={() => navigate('/os')}>
              Ordens de Serviço
            </button>
            <button className={`${styles.link} ${isActive('/usuarios')}`} onClick={() => navigate('/usuarios')}>
              Usuários
            </button>
            <button className={`${styles.link} ${isActive('/categorias')}`} onClick={() => navigate('/categorias')}>
              Categorias
            </button>
          </>
        )}
      </div>

      {/* Área direita da navbar — mostra nome do usuário e botão de sair, ou botão de entrar */}
      <div className={styles.right}>
        {user ? (
          // Se estiver logado: exibe o nome do usuário e o botão "Sair"
          <>
            <span className={styles.badge}>{user.nome}</span> {/* Nome do usuário logado */}
            <button className={styles.btnLogout} onClick={handleLogout}>
              <i className="ti ti-logout" /> Sair
            </button>
          </>
        ) : (
          // Se não estiver logado: exibe o botão "Entrar"
          <button className={styles.link} onClick={() => navigate('/login')}>
            Entrar
          </button>
        )}
      </div>
    </nav>
  )
}
