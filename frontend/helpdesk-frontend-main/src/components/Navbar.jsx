import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import styles from './Navbar.module.css'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  function handleLogout() {
    logout()
    navigate('/')
  }

  const isActive = (path) => location.pathname === path ? styles.active : ''

  return (
    <nav className={styles.nav}>
      <div className={styles.logo}>
        <i className="ti ti-headset" />
        HelpDesk
      </div>

      <div className={styles.links}>
        <button className={`${styles.link} ${isActive('/')}`} onClick={() => navigate('/')}>
          Início
        </button>
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

      <div className={styles.right}>
        {user ? (
          <>
            <span className={styles.badge}>{user.nome}</span>
            <button className={styles.btnLogout} onClick={handleLogout}>
              <i className="ti ti-logout" /> Sair
            </button>
          </>
        ) : (
          <button className={styles.link} onClick={() => navigate('/login')}>
            Entrar
          </button>
        )}
      </div>
    </nav>
  )
}
