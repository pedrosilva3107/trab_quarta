// Importa useEffect (executa código ao carregar a página) e useState (gerencia estados)
import { useEffect, useState } from 'react'
// Importa o contexto de autenticação para pegar o token e a URL da API
import { useAuth } from '../context/AuthContext'
// Importa as funções que buscam dados na API
import { getOSs, getUsuarios, getCategorias } from '../services/api'
// Importa o CSS específico desta página
import styles from './DashboardPage.module.css'

// Componente que exibe uma tag colorida com o status da OS
// Recebe o status como prop e aplica a classe CSS correspondente
function StatusBadge({ status }) {
  // Define a classe CSS baseada no valor do status
  // Operador ternário encadeado: se "Aberta" → classe aberta, se "Em Andamento" → andamento, senão → concluida
  const cls = status === 'Aberta' ? styles.aberta : status === 'Em Andamento' ? styles.andamento : styles.concluida

  // Renderiza um <span> com as classes de badge e a classe de cor específica
  return <span className={`${styles.badge} ${cls}`}>{status}</span>
}

export default function DashboardPage() {
  // Pega o token JWT e a URL da API do contexto de autenticação
  const { token, apiUrl } = useAuth()

  // Estado com a lista completa de Ordens de Serviço
  const [osList, setOsList] = useState([])

  // Estado com a lista de usuários cadastrados
  const [users, setUsers] = useState([])

  // Estado com a lista de categorias cadastradas
  const [cats, setCats] = useState([])

  // Estado de carregamento — exibe "Carregando..." enquanto busca os dados
  const [loading, setLoading] = useState(true)

  // useEffect executa a função ao montar o componente ([] = executa só uma vez)
  useEffect(() => {
    async function load() {
      // Promise.all executa as três requisições em paralelo (mais rápido que uma por vez)
      // Desestrutura o resultado: [lista de OS, lista de usuários, lista de categorias]
      const [os, u, c] = await Promise.all([
        getOSs(apiUrl, token),
        getUsuarios(apiUrl, token),
        getCategorias(apiUrl, token),
      ])

      // Atualiza os estados com os dados recebidos
      // "|| []" garante que nunca será null (evita erros de .length e .map)
      setOsList(os || [])
      setUsers(u || [])
      setCats(c || [])
      setLoading(false) // Desativa o carregamento após receber os dados
    }
    load() // Chama a função assíncrona imediatamente
  }, []) // [] = dependências vazias → executa só uma vez ao montar

  // Pega as últimas 5 OS e inverte a ordem (mais recentes primeiro)
  // spread [...osList] evita mutar o array original antes de ordenar
  const recentes = [...osList].slice(-5).reverse()

  return (
    <div className={styles.page}>
      <h2 className={styles.title}>Dashboard</h2>

      {/* Grid de métricas — resumo rápido dos dados */}
      <div className={styles.metrics}>
        {/* Total de OS cadastradas */}
        <div className={styles.metric}>
          <div className={styles.label}>Total de OS</div>
          <div className={styles.value}>{osList.length}</div>
        </div>

        {/* Filtra as OS com status "Aberta" e conta quantas são */}
        <div className={styles.metric}>
          <div className={styles.label}>Abertas</div>
          <div className={styles.value}>{osList.filter(o => o.status === 'Aberta').length}</div>
        </div>

        {/* Filtra as OS com status "Em Andamento" e conta */}
        <div className={styles.metric}>
          <div className={styles.label}>Em andamento</div>
          <div className={styles.value}>{osList.filter(o => o.status === 'Em Andamento').length}</div>
        </div>

        {/* Filtra as OS com status "Concluída" e conta */}
        <div className={styles.metric}>
          <div className={styles.label}>Concluídas</div>
          <div className={styles.value}>{osList.filter(o => o.status === 'Concluída').length}</div>
        </div>

        {/* Total de usuários cadastrados */}
        <div className={styles.metric}>
          <div className={styles.label}>Usuários</div>
          <div className={styles.value}>{users.length}</div>
        </div>

        {/* Total de categorias cadastradas */}
        <div className={styles.metric}>
          <div className={styles.label}>Categorias</div>
          <div className={styles.value}>{cats.length}</div>
        </div>
      </div>

      <h3 className={styles.subtitle}>Últimas ordens de serviço</h3>

      {/* Tabela com as últimas OS */}
      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>ID</th><th>Descrição</th><th>Status</th><th>Usuário</th><th>Categoria</th>
            </tr>
          </thead>
          <tbody>
            {/* Renderização condicional: mostra "Carregando..." enquanto busca */}
            {loading ? (
              <tr><td colSpan={5} className={styles.empty}>Carregando...</td></tr>
            ) : recentes.length === 0 ? (
              // Se não houver OS, exibe mensagem
              <tr><td colSpan={5} className={styles.empty}>Nenhuma OS encontrada</td></tr>
            ) : recentes.map(o => (
              // Para cada OS, renderiza uma linha na tabela
              // key={o.id} é obrigatório para o React identificar cada item da lista
              <tr key={o.id}>
                <td>{o.id}</td>
                <td>{o.descricao}</td>
                <td><StatusBadge status={o.status} /></td> {/* Badge colorido */}
                {/* "?." é optional chaining — evita erro se usuario for null */}
                {/* "|| '—'" exibe traço se o nome não estiver disponível */}
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
