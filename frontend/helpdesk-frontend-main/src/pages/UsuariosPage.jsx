import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { getUsuarios, getUsuario, createUsuario, updateUsuario, deleteUsuario } from '../services/api'
import { showToast } from '../components/Toast'
import Modal from '../components/Modal'
import Field from '../components/Field'
import styles from './CrudPage.module.css'

const emptyForm = { nome: '', email: '', senha: '' }

export default function UsuariosPage() {
  const { token, apiUrl } = useAuth()
  const [list, setList] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(emptyForm)

  useEffect(() => { load() }, [])

  async function load() {
    setLoading(true)
    const data = await getUsuarios(apiUrl, token)
    setList(data || [])
    setLoading(false)
  }

  function openNew() {
    setEditing(null)
    setForm(emptyForm)
    setModal(true)
  }

  async function openEdit(id) {
    const u = await getUsuario(apiUrl, token, id)
    setEditing(id)
    setForm({ nome: u.nome, email: u.email, senha: '' })
    setModal(true)
  }

  async function handleSave() {
    try {
      if (editing) {
        await updateUsuario(apiUrl, token, editing, { id: editing, ...form })
        showToast('Usuário atualizado')
      } else {
        await createUsuario(apiUrl, token, form)
        showToast('Usuário criado')
      }
      setModal(false)
      load()
    } catch (e) {
      showToast(e.message || 'Erro ao salvar', 'error')
    }
  }

  async function handleDelete(id) {
    if (!confirm('Excluir este usuário?')) return
    try {
      await deleteUsuario(apiUrl, token, id)
      showToast('Usuário excluído')
      load()
    } catch (e) {
      showToast('Erro ao excluir', 'error')
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h2>Usuários</h2>
        <button className={styles.btnAdd} onClick={openNew}>
          <i className="ti ti-plus" /> Novo usuário
        </button>
      </div>

      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr><th>ID</th><th>Nome</th><th>E-mail</th><th>Ações</th></tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={4} className={styles.empty}>Carregando...</td></tr>
            ) : list.length === 0 ? (
              <tr><td colSpan={4} className={styles.empty}>Nenhum usuário cadastrado</td></tr>
            ) : list.map(u => (
              <tr key={u.id}>
                <td>{u.id}</td>
                <td>{u.nome}</td>
                <td>{u.email}</td>
                <td>
                  <div className={styles.actions}>
                    <button className={styles.btnIcon} onClick={() => openEdit(u.id)} title="Editar">
                      <i className="ti ti-edit" />
                    </button>
                    <button className={`${styles.btnIcon} ${styles.danger}`} onClick={() => handleDelete(u.id)} title="Excluir">
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
        <Modal title={editing ? 'Editar usuário' : 'Novo usuário'} onClose={() => setModal(false)} onSave={handleSave}>
          <Field label="Nome">
            <input type="text" value={form.nome} onChange={e => setForm({ ...form, nome: e.target.value })} />
          </Field>
          <Field label="E-mail">
            <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
          </Field>
          <Field label="Senha">
            <input type="password" value={form.senha} onChange={e => setForm({ ...form, senha: e.target.value })} placeholder="mín. 6 caracteres" />
          </Field>
        </Modal>
      )}
    </div>
  )
}
