# HelpDesk — Frontend

Frontend React para a API HelpDesk. Consome todas as rotas da API com autenticação JWT.

---

## Estrutura de pastas

```
helpdesk-frontend/
├── index.html                  ← página HTML base
├── package.json                ← dependências do projeto
├── vite.config.js              ← configuração do Vite
└── src/
    ├── main.jsx                ← ponto de entrada React
    ├── App.jsx                 ← rotas públicas e privadas
    ├── index.css               ← estilos globais
    │
    ├── context/
    │   └── AuthContext.jsx     ← estado global de autenticação (token, usuário, URL da API)
    │
    ├── services/
    │   └── api.js              ← todas as chamadas para a API (auth, OS, usuários, categorias)
    │
    ├── components/
    │   ├── Navbar.jsx          ← barra de navegação
    │   ├── Modal.jsx           ← modal reutilizável
    │   ├── Toast.jsx           ← notificações de sucesso/erro
    │   └── Field.jsx           ← campo de formulário reutilizável
    │
    └── pages/
        ├── PublicPage.jsx      ← página inicial pública
        ├── LoginPage.jsx       ← login com JWT
        ├── DashboardPage.jsx   ← métricas + últimas OS
        ├── OSPage.jsx          ← CRUD de Ordens de Serviço
        ├── UsuariosPage.jsx    ← CRUD de Usuários
        └── CategoriasPage.jsx  ← CRUD de Categorias
```

---

## Passo a passo para rodar no VS Code

### 1. Instalar o Node.js (se ainda não tiver)

Acesse https://nodejs.org e baixe a versão **LTS**.
Depois de instalar, abra o terminal e confirme:

```
node -v
npm -v
```

Ambos devem mostrar um número de versão.

---

### 2. Abrir a pasta no VS Code

1. Abra o VS Code
2. Clique em **File → Open Folder...**
3. Selecione a pasta `helpdesk-frontend`

---

### 3. Abrir o terminal integrado

No VS Code: **Terminal → New Terminal** (ou `Ctrl + \``)

---

### 4. Instalar as dependências

No terminal, execute:

```
npm install
```

Aguarde terminar. Vai criar a pasta `node_modules/`.

---

### 5. Rodar o projeto

```
npm run dev
```

O terminal vai mostrar algo como:

```
  VITE v5.x.x  ready in 300ms

  ➜  Local:   http://localhost:5173/
```

Abra **http://localhost:5173** no navegador.

---

### 6. Configurar a URL da API

Na tela de **Login**, o campo "URL da API" vem preenchido com `http://localhost:5000`.

Ajuste para o endereço onde sua API .NET está rodando
(verifique no `launchSettings.json` da API — campo `applicationUrl`).

---

### 7. CORS na API (importante!)

Se aparecer erro de CORS no navegador, adicione isso no `Program.cs` da API:

```csharp
// Antes de builder.Build()
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

// Depois de app = builder.Build(), antes de app.MapControllers()
app.UseCors();
```

---

## Rotas do sistema

| Rota          | Tipo    | Descrição                          |
|---------------|---------|------------------------------------|
| `/`           | Pública | Página inicial                     |
| `/login`      | Pública | Tela de login                      |
| `/dashboard`  | Privada | Métricas e últimas OS              |
| `/os`         | Privada | CRUD de Ordens de Serviço          |
| `/usuarios`   | Privada | CRUD de Usuários                   |
| `/categorias` | Privada | CRUD de Categorias                 |
