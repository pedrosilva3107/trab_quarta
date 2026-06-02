import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { login } from '../services/api'
import Field from '../components/Field'
import styles from './LoginPage.module.css'

export default function LoginPage() {
  const { apiUrl, setApiUrl, login: authLogin } = useAuth()
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  async function handleLogin() {
    setError('')
    setLoading(true)
    try {
      const data = await login(apiUrl, email, senha)
      authLogin(data.token, data.usuario)
      navigate('/dashboard')
    } catch (e) {
      setError(e.message || 'Erro ao conectar. Verifique a URL da API.')
    } finally {
      setLoading(false)
    }
  }

  function handleKey(e) {
    if (e.key === 'Enter') handleLogin()
  }

  return (
    <div className={styles.wrap}>
      <div className={styles.card}>
        <h2>Entrar</h2>
        <p>Acesse o painel de administração</p>

        <div className={styles.apiSection}>
          <Field label="URL da API">
            <input
              type="text"
              value={apiUrl}
              onChange={(e) => setApiUrl(e.target.value)}
              placeholder="http://localhost:5000"
            />
          </Field>
        </div>

        <div className={styles.fields}>
          <Field label="E-mail">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={handleKey}
              placeholder="admin@email.com"
            />
          </Field>

          <Field label="Senha">
            <input
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              onKeyDown={handleKey}
              placeholder="••••••"
            />
          </Field>
        </div>

        <button className={styles.btn} onClick={handleLogin} disabled={loading}>
          {loading ? 'Entrando...' : 'Entrar'}
        </button>

        {error && <p className={styles.error}>{error}</p>}
      </div>
    </div>
  )
}
