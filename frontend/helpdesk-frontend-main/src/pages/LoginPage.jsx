// Importa o hook useState para controlar os campos do formulário
import { useState } from 'react'
// Importa o hook useNavigate para redirecionar o usuário após o login
import { useNavigate } from 'react-router-dom'
// Importa o contexto de autenticação para salvar o token e os dados do usuário
import { useAuth } from '../context/AuthContext'
// Importa a função de login do serviço de API
import { login } from '../services/api'
// Importa o componente Field (label + input agrupados)
import Field from '../components/Field'
// Importa o CSS específico desta página (CSS Modules — estilos isolados)
import styles from './LoginPage.module.css'

export default function LoginPage() {
  // Desestrutura do contexto: apiUrl (URL da API), setApiUrl (altera a URL), authLogin (salva o login)
  const { apiUrl, setApiUrl, login: authLogin } = useAuth()

  // Estado do campo e-mail — começa vazio
  const [email, setEmail] = useState('')

  // Estado do campo senha — começa vazio
  const [senha, setSenha] = useState('')

  // Estado da mensagem de erro — exibida abaixo do botão se o login falhar
  const [error, setError] = useState('')

  // Estado de carregamento — desabilita o botão enquanto aguarda a resposta da API
  const [loading, setLoading] = useState(false)

  // Hook que permite redirecionar para outra página programaticamente
  const navigate = useNavigate()

  // Função assíncrona chamada quando o usuário clica em "Entrar"
  async function handleLogin() {
    setError('')      // Limpa qualquer mensagem de erro anterior
    setLoading(true)  // Ativa o estado de carregamento (desabilita o botão)

    try {
      // Chama a API de login enviando a URL, e-mail e senha
      // Aguarda a resposta (token + dados do usuário)
      const data = await login(apiUrl, email, senha)

      // Salva o token e os dados do usuário no contexto global de autenticação
      authLogin(data.token, data.usuario)

      // Redireciona para o dashboard após login bem-sucedido
      navigate('/dashboard')
    } catch (e) {
      // Se der erro (credenciais erradas, API offline, etc.), exibe a mensagem
      setError(e.message || 'Erro ao conectar. Verifique a URL da API.')
    } finally {
      // Sempre desativa o carregamento ao final (com sucesso ou erro)
      setLoading(false)
    }
  }

  // Permite fazer login pressionando Enter nos campos de e-mail e senha
  function handleKey(e) {
    if (e.key === 'Enter') handleLogin() // Se a tecla pressionada for Enter, chama o login
  }

  return (
    // Container externo centraliza o card na tela
    <div className={styles.wrap}>
      <div className={styles.card}>
        <h2>Entrar</h2>
        <p>Acesse o painel de administração</p>

        {/* Seção para configurar a URL da API — útil em diferentes ambientes */}
        <div className={styles.apiSection}>
          <Field label="URL da API">
            <input
              type="text"
              value={apiUrl}                              // Valor controlado pelo estado
              onChange={(e) => setApiUrl(e.target.value)} // Atualiza o estado ao digitar
              placeholder="http://localhost:5000"
            />
          </Field>
        </div>

        <div className={styles.fields}>
          {/* Campo de e-mail */}
          <Field label="E-mail">
            <input
              type="email"
              value={email}                              // Valor controlado pelo estado
              onChange={(e) => setEmail(e.target.value)} // Atualiza o estado ao digitar
              onKeyDown={handleKey}                      // Ouve o Enter
              placeholder="admin@email.com"
            />
          </Field>

          {/* Campo de senha — type="password" oculta os caracteres digitados */}
          <Field label="Senha">
            <input
              type="password"
              value={senha}                              // Valor controlado pelo estado
              onChange={(e) => setSenha(e.target.value)} // Atualiza o estado ao digitar
              onKeyDown={handleKey}                      // Ouve o Enter
              placeholder="••••••"
            />
          </Field>
        </div>

        {/* Botão de login — desabilitado enquanto aguarda resposta da API */}
        <button className={styles.btn} onClick={handleLogin} disabled={loading}>
          {loading ? 'Entrando...' : 'Entrar'} {/* Muda o texto enquanto carrega */}
        </button>

        {/* Mostra a mensagem de erro apenas se houver algum erro */}
        {error && <p className={styles.error}>{error}</p>}
      </div>
    </div>
  )
}
