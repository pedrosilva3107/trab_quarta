// Importa o React — biblioteca principal para criar interfaces
import React from 'react'
// Importa o ReactDOM — responsável por renderizar o React no HTML da página
import ReactDOM from 'react-dom/client'
// Importa o BrowserRouter — habilita o sistema de rotas usando a URL do navegador
import { BrowserRouter } from 'react-router-dom'
// Importa o componente raiz da aplicação
import App from './App.jsx'
// Importa o CSS global da aplicação (estilos que valem para todas as páginas)
import './index.css'

// Cria a "raiz" do React no elemento HTML com id="root" (está no index.html)
// e renderiza toda a aplicação dentro dele
ReactDOM.createRoot(document.getElementById('root')).render(
  // BrowserRouter envolve tudo para que o React Router funcione em toda a aplicação
  // Ele lê a URL do navegador e decide qual página mostrar
  <BrowserRouter>
    <App />
  </BrowserRouter>
)
