import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { getCategorias, getCategoria, createCategoria, updateCategoria, deleteCategoria } from '../services/api'
import { showToast } from '../components/Toast'
import Modal from '../components/Modal'
import Field from '../components/Field'
import styles from './CrudPage.module.css'

export default function CategoriasPage() {
  const { token, apiUrl } = useAuth()
  const [list, setList] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [nome, setNome] = useState('')

  useEffect(() => { load() }, [])

  async function load() {
    setLoading(true)
    const data = await getCategorias(apiUrl, token)
    setList(data || [])
    setLoading(false)
  }

  function openNew() {
    setEditing(null)
    setNome('')
    setModal(true)
  }

  async function openEdit(id) {
    const c = await getCategoria(apiUrl, token, id)
    setEditing(id)
    setNome(c.nome)
    setModal(true)
  }

  async function handleSave() {
    try {
      if (editing) {
        await updateCategoria(apiUrl, token, editing, { id: editing, nome })
        showToast('Categoria atualizada')
      } else {
        await createCategoria(apiUrl, token, { nome })
        showToast('Categoria criada')
      }
      setModal(false)
      load()
    } catch (e) {
      showToast(e.message || 'Erro ao salvar', 'error')
    }
  }

  async function handleDelete(id) {
    if (!confirm('Excluir esta categoria?')) return
    try {
      await deleteCategoria(apiUrl, token, id)
      showToast('Categoria excluída')
      load()
    } catch (e) {
      showToast('Erro ao excluir', 'error')
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h2>Categorias</h2>
        <button className={styles.btnAdd} onClick={openNew}>
          <i className="ti ti-plus" /> Nova categoria
        </button>
      </div>

      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr><th>ID</th><th>Nome</th><th>Ações</th></tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={3} className={styles.empty}>Carregando...</td></tr>
            ) : list.length === 0 ? (
              <tr><td colSpan={3} className={styles.empty}>Nenhuma categoria cadastrada</td></tr>
            ) : list.map(c => (
              <tr key={c.id}>
                <td>{c.id}</td>
                <td>{c.nome}</td>
                <td>
                  <div className={styles.actions}>
                    <button className={styles.btnIcon} onClick={() => openEdit(c.id)} title="Editar">
                      <i className="ti ti-edit" />
                    </button>
                    <button className={`${styles.btnIcon} ${styles.danger}`} onClick={() => handleDelete(c.id)} title="Excluir">
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
        <Modal title={editing ? 'Editar categoria' : 'Nova categoria'} onClose={() => setModal(false)} onSave={handleSave}>
          <Field label="Nome">
            <input type="text" value={nome} onChange={e => setNome(e.target.value)} />
          </Field>
        </Modal>
      )}
    </div>
  )
}
