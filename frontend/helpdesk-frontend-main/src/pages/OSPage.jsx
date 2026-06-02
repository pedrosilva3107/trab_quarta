import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { getOSs, getOS, createOS, updateOS, deleteOS, getUsuarios, getCategorias } from '../services/api'
import { showToast } from '../components/Toast'
import Modal from '../components/Modal'
import Field from '../components/Field'
import styles from './CrudPage.module.css'

function StatusBadge({ status }) {
  const cls = status === 'Aberta' ? styles.aberta : status === 'Em Andamento' ? styles.andamento : styles.concluida
  return <span className={`${styles.badge} ${cls}`}>{status}</span>
}

const emptyForm = { descricao: '', status: 'Aberta', usuarioId: '', categoriaId: '' }

export default function OSPage() {
  const { token, apiUrl } = useAuth()
  const [list, setList] = useState([])
  const [users, setUsers] = useState([])
  const [cats, setCats] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(false)
  const [editing, setEditing] = useState(null) // null = novo
  const [form, setForm] = useState(emptyForm)

  useEffect(() => { loadAll() }, [])

  async function loadAll() {
    setLoading(true)
    const [os, u, c] = await Promise.all([
      getOSs(apiUrl, token),
      getUsuarios(apiUrl, token),
      getCategorias(apiUrl, token),
    ])
    setList(os || [])
    setUsers(u || [])
    setCats(c || [])
    setLoading(false)
  }

  function openNew() {
    setEditing(null)
    setForm(emptyForm)
    setModal(true)
  }

  async function openEdit(id) {
    const os = await getOS(apiUrl, token, id)
    setEditing(id)
    setForm({
      descricao: os.descricao,
      status: os.status,
      usuarioId: String(os.usuarioId),
      categoriaId: String(os.categoriaId),
    })
    setModal(true)
  }

  async function handleSave() {
    const body = {
      descricao: form.descricao,
      status: form.status,
      usuarioId: parseInt(form.usuarioId),
      categoriaId: parseInt(form.categoriaId),
    }
    try {
      if (editing) {
        await updateOS(apiUrl, token, editing, { id: editing, ...body })
        showToast('OS atualizada com sucesso')
      } else {
        await createOS(apiUrl, token, body)
        showToast('OS criada com sucesso')
      }
      setModal(false)
      loadAll()
    } catch (e) {
      showToast(e.message || 'Erro ao salvar', 'error')
    }
  }

  async function handleDelete(id) {
    if (!confirm('Excluir esta OS?')) return
    try {
      await deleteOS(apiUrl, token, id)
      showToast('OS excluída')
      loadAll()
    } catch (e) {
      showToast('Erro ao excluir', 'error')
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h2>Ordens de Serviço</h2>
        <button className={styles.btnAdd} onClick={openNew}>
          <i className="ti ti-plus" /> Nova OS
        </button>
      </div>

      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr><th>ID</th><th>Descrição</th><th>Status</th><th>Usuário</th><th>Categoria</th><th>Ações</th></tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} className={styles.empty}>Carregando...</td></tr>
            ) : list.length === 0 ? (
              <tr><td colSpan={6} className={styles.empty}>Nenhuma OS cadastrada</td></tr>
            ) : list.map(o => (
              <tr key={o.id}>
                <td>{o.id}</td>
                <td>{o.descricao}</td>
                <td><StatusBadge status={o.status} /></td>
                <td>{o.usuario?.nome || '—'}</td>
                <td>{o.categoria?.nome || '—'}</td>
                <td>
                  <div className={styles.actions}>
                    <button className={styles.btnIcon} onClick={() => openEdit(o.id)} title="Editar">
                      <i className="ti ti-edit" />
                    </button>
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

      {modal && (
        <Modal title={editing ? `Editar OS #${editing}` : 'Nova Ordem de Serviço'} onClose={() => setModal(false)} onSave={handleSave}>
          <Field label="Descrição">
            <textarea rows={3} value={form.descricao} onChange={e => setForm({ ...form, descricao: e.target.value })} />
          </Field>
          <Field label="Status">
            <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
              <option value="Aberta">Aberta</option>
              <option value="Em Andamento">Em Andamento</option>
              <option value="Concluída">Concluída</option>
            </select>
          </Field>
          <Field label="Usuário">
            <select value={form.usuarioId} onChange={e => setForm({ ...form, usuarioId: e.target.value })}>
              <option value="">Selecione...</option>
              {users.map(u => <option key={u.id} value={u.id}>{u.nome}</option>)}
            </select>
          </Field>
          <Field label="Categoria">
            <select value={form.categoriaId} onChange={e => setForm({ ...form, categoriaId: e.target.value })}>
              <option value="">Selecione...</option>
              {cats.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}
            </select>
          </Field>
        </Modal>
      )}
    </div>
  )
}
