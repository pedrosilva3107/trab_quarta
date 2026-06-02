import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { getOSs, getUsuarios, getCategorias } from '../services/api'
import styles from './DashboardPage.module.css'

function StatusBadge({ status }) {
  const cls = status === 'Aberta' ? styles.aberta : status === 'Em Andamento' ? styles.andamento : styles.concluida
  return <span className={`${styles.badge} ${cls}`}>{status}</span>
}

export default function DashboardPage() {
  const { token, apiUrl } = useAuth()
  const [osList, setOsList] = useState([])
  const [users, setUsers] = useState([])
  const [cats, setCats] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const [os, u, c] = await Promise.all([
        getOSs(apiUrl, token),
        getUsuarios(apiUrl, token),
        getCategorias(apiUrl, token),
      ])
      setOsList(os || [])
      setUsers(u || [])
      setCats(c || [])
      setLoading(false)
    }
    load()
  }, [])

  const recentes = [...osList].slice(-5).reverse()

  return (
    <div className={styles.page}>
      <h2 className={styles.title}>Dashboard</h2>

      <div className={styles.metrics}>
        <div className={styles.metric}><div className={styles.label}>Total de OS</div><div className={styles.value}>{osList.length}</div></div>
        <div className={styles.metric}><div className={styles.label}>Abertas</div><div className={styles.value}>{osList.filter(o => o.status === 'Aberta').length}</div></div>
        <div className={styles.metric}><div className={styles.label}>Em andamento</div><div className={styles.value}>{osList.filter(o => o.status === 'Em Andamento').length}</div></div>
        <div className={styles.metric}><div className={styles.label}>Concluídas</div><div className={styles.value}>{osList.filter(o => o.status === 'Concluída').length}</div></div>
        <div className={styles.metric}><div className={styles.label}>Usuários</div><div className={styles.value}>{users.length}</div></div>
        <div className={styles.metric}><div className={styles.label}>Categorias</div><div className={styles.value}>{cats.length}</div></div>
      </div>

      <h3 className={styles.subtitle}>Últimas ordens de serviço</h3>
      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>ID</th><th>Descrição</th><th>Status</th><th>Usuário</th><th>Categoria</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} className={styles.empty}>Carregando...</td></tr>
            ) : recentes.length === 0 ? (
              <tr><td colSpan={5} className={styles.empty}>Nenhuma OS encontrada</td></tr>
            ) : recentes.map(o => (
              <tr key={o.id}>
                <td>{o.id}</td>
                <td>{o.descricao}</td>
                <td><StatusBadge status={o.status} /></td>
                <td>{o.usuario?.nome || '—'}</td>
                <td>{o.categoria?.nome || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
