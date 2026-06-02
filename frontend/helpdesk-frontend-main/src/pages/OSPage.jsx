// Importa useEffect (executa ao montar/atualizar) e useState (gerencia estados)
import { useEffect, useState } from 'react'
// Importa o contexto de autenticação para pegar token e URL da API
import { useAuth } from '../context/AuthContext'
// Importa todas as funções de OS, Usuários e Categorias do serviço de API
import { getOSs, getOS, createOS, updateOS, deleteOS, getUsuarios, getCategorias } from '../services/api'
// Importa a função para exibir notificações (Toast)
import { showToast } from '../components/Toast'
// Importa o componente Modal (janela pop-up para criar/editar)
import Modal from '../components/Modal'
// Importa o componente Field (label + input agrupados)
import Field from '../components/Field'
// Importa o CSS compartilhado entre as páginas de CRUD
import styles from './CrudPage.module.css'

// Componente que exibe uma tag colorida com o status da OS
function StatusBadge({ status }) {
  // Define a classe CSS de cor baseada no status
  const cls = status === 'Aberta' ? styles.aberta : status === 'Em Andamento' ? styles.andamento : styles.concluida
  return <span className={`${styles.badge} ${cls}`}>{status}</span>
}

// Objeto com os valores padrão do formulário de OS (usado ao abrir o modal vazio)
const emptyForm = { descricao: '', status: 'Aberta', usuarioId: '', categoriaId: '' }

export default function OSPage() {
  // Pega o token JWT e a URL da API do contexto de autenticação
  const { token, apiUrl } = useAuth()

  // Lista de Ordens de Serviço carregadas da API
  const [list, setList] = useState([])

  // Lista de usuários (para popular o select no formulário)
  const [users, setUsers] = useState([])

  // Lista de categorias (para popular o select no formulário)
  const [cats, setCats] = useState([])

  // Controla o estado de carregamento inicial
  const [loading, setLoading] = useState(true)

  // Controla se o Modal está aberto (true) ou fechado (false)
  const [modal, setModal] = useState(false)

  // Guarda o Id da OS sendo editada — null indica que é uma nova OS
  const [editing, setEditing] = useState(null)

  // Estado do formulário dentro do Modal (descrição, status, usuário, categoria)
  const [form, setForm] = useState(emptyForm)

  // useEffect carrega todos os dados ao montar o componente
  // [] = executa só uma vez quando a página abre
  useEffect(() => { loadAll() }, [])

  // Função que carrega OS, usuários e categorias em paralelo
  async function loadAll() {
    setLoading(true)

    // Promise.all executa as três requisições ao mesmo tempo (mais eficiente)
    const [os, u, c] = await Promise.all([
      getOSs(apiUrl, token),
      getUsuarios(apiUrl, token),
      getCategorias(apiUrl, token),
    ])

    // Atualiza os estados com os dados recebidos
    setList(os || [])
    setUsers(u || [])
    setCats(c || [])
    setLoading(false) // Desativa o carregamento
  }

  // Abre o Modal para criar uma nova OS
  function openNew() {
    setEditing(null)     // null = modo criação (não é edição)
    setForm(emptyForm)   // Limpa o formulário com os valores padrão
    setModal(true)       // Abre o Modal
  }

  // Abre o Modal para editar uma OS existente
  async function openEdit(id) {
    // Busca os dados da OS específica na API pelo Id
    const os = await getOS(apiUrl, token, id)
    setEditing(id) // Guarda o Id para saber que está no modo edição

    // Preenche o formulário com os dados da OS encontrada
    // String(os.usuarioId) converte o número para string (necessário para o <select>)
    setForm({
      descricao: os.descricao,
      status: os.status,
      usuarioId: String(os.usuarioId),
      categoriaId: String(os.categoriaId),
    })
    setModal(true) // Abre o Modal
  }

  // Salva a OS (cria ou atualiza dependendo do estado "editing")
  async function handleSave() {
    // Monta o objeto que será enviado para a API
    // parseInt converte as strings dos selects de volta para número
    const body = {
      descricao: form.descricao,
      status: form.status,
      usuarioId: parseInt(form.usuarioId),
      categoriaId: parseInt(form.categoriaId),
    }

    try {
      if (editing) {
        // Se "editing" tem valor → é uma edição → chama updateOS (PUT)
        await updateOS(apiUrl, token, editing, { id: editing, ...body })
        showToast('OS atualizada com sucesso') // Notificação de sucesso
      } else {
        // Se "editing" é null → é uma criação → chama createOS (POST)
        await createOS(apiUrl, token, body)
        showToast('OS criada com sucesso') // Notificação de sucesso
      }
      setModal(false) // Fecha o Modal após salvar
      loadAll()       // Recarrega a lista para refletir as mudanças
    } catch (e) {
      // Se der erro, exibe notificação de erro
      showToast(e.message || 'Erro ao salvar', 'error')
    }
  }

  // Deleta uma OS após confirmação do usuário
  async function handleDelete(id) {
    // confirm() abre uma caixa de diálogo nativa do navegador pedindo confirmação
    if (!confirm('Excluir esta OS?')) return // Se cancelar, sai da função sem fazer nada

    try {
      await deleteOS(apiUrl, token, id) // Chama a API para deletar (DELETE)
      showToast('OS excluída')          // Notificação de sucesso
      loadAll()                         // Recarrega a lista
    } catch (e) {
      showToast('Erro ao excluir', 'error') // Notificação de erro
    }
  }

  return (
    <div className={styles.page}>
      {/* Cabeçalho da página com título e botão de criar */}
      <div className={styles.header}>
        <h2>Ordens de Serviço</h2>
        {/* Botão que abre o Modal para criar uma nova OS */}
        <button className={styles.btnAdd} onClick={openNew}>
          <i className="ti ti-plus" /> Nova OS
        </button>
      </div>

      {/* Tabela com todas as OS */}
      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr><th>ID</th><th>Descrição</th><th>Status</th><th>Usuário</th><th>Categoria</th><th>Ações</th></tr>
          </thead>
          <tbody>
            {/* Renderização condicional: carregando → sem dados → lista */}
            {loading ? (
              <tr><td colSpan={6} className={styles.empty}>Carregando...</td></tr>
            ) : list.length === 0 ? (
              <tr><td colSpan={6} className={styles.empty}>Nenhuma OS cadastrada</td></tr>
            ) : list.map(o => (
              // Para cada OS, renderiza uma linha
              <tr key={o.id}>
                <td>{o.id}</td>
                <td>{o.descricao}</td>
                <td><StatusBadge status={o.status} /></td> {/* Badge colorido */}
                <td>{o.usuario?.nome || '—'}</td>   {/* "?." evita erro se usuario for null */}
                <td>{o.categoria?.nome || '—'}</td> {/* "?." evita erro se categoria for null */}
                <td>
                  <div className={styles.actions}>
                    {/* Botão de editar — abre o Modal com os dados da OS */}
                    <button className={styles.btnIcon} onClick={() => openEdit(o.id)} title="Editar">
                      <i className="ti ti-edit" />
                    </button>
                    {/* Botão de excluir — pede confirmação antes de deletar */}
                    <button className={`${styles.btnIcon} ${styles.danger}`} onClick={() => handleDelete(o.id)} title="Excluir">
                      <i className="ti ti-trash" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal de criar/editar OS — renderizado só quando modal=true */}
      {modal && (
        <Modal
          title={editing ? `Editar OS #${editing}` : 'Nova Ordem de Serviço'} // Título muda conforme o modo
          onClose={() => setModal(false)} // Fechar sem salvar
          onSave={handleSave}             // Salvar os dados
        >
          {/* Campo de descrição — textarea para textos maiores */}
          <Field label="Descrição">
            <textarea rows={3} value={form.descricao} onChange={e => setForm({ ...form, descricao: e.target.value })} />
          </Field>

          {/* Select de status — só aceita os três valores válidos */}
          <Field label="Status">
            <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
              <option value="Aberta">Aberta</option>
              <option value="Em Andamento">Em Andamento</option>
              <option value="Concluída">Concluída</option>
            </select>
          </Field>

          {/* Select de usuário — populado com a lista de usuários do banco */}
          <Field label="Usuário">
            <select value={form.usuarioId} onChange={e => setForm({ ...form, usuarioId: e.target.value })}>
              <option value="">Selecione...</option>
              {/* Mapeia cada usuário como uma opção — key e value usam o id */}
              {users.map(u => <option key={u.id} value={u.id}>{u.nome}</option>)}
            </select>
          </Field>

          {/* Select de categoria — populado com a lista de categorias do banco */}
          <Field label="Categoria">
            <select value={form.categoriaId} onChange={e => setForm({ ...form, categoriaId: e.target.value })}>
              <option value="">Selecione...</option>
              {/* Mapeia cada categoria como uma opção */}
              {cats.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}
            </select>
          </Field>
        </Modal>
      )}
    </div>
  )
}
