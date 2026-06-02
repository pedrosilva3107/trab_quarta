import { useNavigate } from 'react-router-dom'
import styles from './PublicPage.module.css'

export default function PublicPage() {
  const navigate = useNavigate()

  return (
    <div className={styles.hero}>
      <h1>Sistema de Chamados</h1>
      <p>Gerencie ordens de serviço, usuários e categorias em um único lugar.</p>
      <button className={styles.btn} onClick={() => navigate('/login')}>
        Acessar o painel
      </button>

      <div className={styles.cards}>
        <div className={styles.card}>
          <i className="ti ti-ticket" />
          <h3>Ordens de Serviço</h3>
          <p>Abra, acompanhe e conclua chamados com controle total de status.</p>
        </div>
        <div className={styles.card}>
          <i className="ti ti-users" />
          <h3>Usuários</h3>
          <p>Gerencie os técnicos e responsáveis pelos atendimentos.</p>
        </div>
        <div className={styles.card}>
          <i className="ti ti-tag" />
          <h3>Categorias</h3>
          <p>Organize os chamados por tipo para facilitar o filtro.</p>
        </div>
      </div>
    </div>
  )
}
