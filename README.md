# 🎫 HelpDesk

Sistema de gerenciamento de ordens de serviço com autenticação JWT, painel administrativo e API RESTful.

---

## 📋 Sobre o Projeto

O **HelpDesk** é uma aplicação full-stack para gestão de chamados técnicos (ordens de serviço). Permite cadastrar usuários, categorias e acompanhar OS com controle de acesso via token JWT.

---

## 🚀 Tecnologias

### Backend
| Tecnologia | Versão |
|---|---|
| .NET | 8.0 |
| ASP.NET Core Web API | 8.0 |
| Entity Framework Core | 8.0 |
| SQLite | — |
| JWT Bearer Auth | 8.0 |
| Swagger / OpenAPI | 6.6 |

### Frontend
| Tecnologia | Versão |
|---|---|
| React | 18.2 |
| React Router DOM | 6.22 |
| Vite | 5.1 |

---

## 📁 Estrutura do Projeto

```
trab_quarta/
├── backend/
│   └── help-main/
│       └── HelpDeskApi/
│           ├── Controllers/       # AuthController, UsuariosController, OSs, Categorias
│           ├── Models/            # Usuario, OS, Categoria
│           ├── DTOs/              # LoginDto
│           ├── Data/              # AppDbContext (EF Core)
│           ├── Migrations/        # Migrações do banco
│           ├── helpdesk.db        # Banco SQLite
│           └── Program.cs
└── frontend/
    └── helpdesk-frontend-main/
        ├── src/
│           ├── pages/             # Login, Dashboard, OS, Usuarios, Categorias, Public
│           ├── components/        # Navbar, Modal, Toast, Field
│           ├── context/
│           └── services/
        └── index.html
```

---

## ⚙️ Como Rodar

### Pré-requisitos

- [.NET SDK 8+](https://dotnet.microsoft.com/download)
- [Node.js LTS](https://nodejs.org/)

---

### Backend

```bash
cd backend/help-main/HelpDeskApi
dotnet restore
dotnet run
```

A API estará disponível em: `http://localhost:5144`

Documentação Swagger: `http://localhost:5144/swagger`

---

### Frontend

```bash
cd frontend/helpdesk-frontend-main
npm install
npm run dev
```

O frontend estará disponível em: `http://localhost:5173`

> Na tela de login, informe a URL da API: `http://localhost:5144`

---

## 🔐 Autenticação

O sistema utiliza **JWT (JSON Web Token)**. Após o login, o token é armazenado e enviado automaticamente nas requisições autenticadas.

### Usuário de teste

| Campo | Valor |
|---|---|
| E-mail | `admin@teste.com` |
| Senha | `123456` |

---

## 📡 Endpoints da API

| Método | Rota | Descrição | Auth |
|---|---|---|---|
| POST | `/api/auth/login` | Autenticação do usuário | ❌ |
| GET | `/api/usuarios` | Lista todos os usuários | ✅ |
| POST | `/api/usuarios` | Cria um novo usuário | ✅ |
| PUT | `/api/usuarios/{id}` | Atualiza um usuário | ✅ |
| DELETE | `/api/usuarios/{id}` | Remove um usuário | ✅ |
| GET | `/api/categorias` | Lista categorias | ✅ |
| POST | `/api/categorias` | Cria uma categoria | ✅ |
| GET | `/api/oss` | Lista ordens de serviço | ✅ |
| POST | `/api/oss` | Cria uma ordem de serviço | ✅ |
| PUT | `/api/oss/{id}` | Atualiza uma OS | ✅ |
| DELETE | `/api/oss/{id}` | Remove uma OS | ✅ |

---

## 🖥️ Telas do Sistema

- **Login** — autenticação com e-mail e senha
- **Dashboard** — visão geral do sistema
- **Ordens de Serviço** — listagem, criação, edição e exclusão de OS
- **Usuários** — gerenciamento de usuários
- **Categorias** — gerenciamento de categorias
- **Página Pública** — acesso sem autenticação

---

## 👨‍💻 Autor

**Pedro Henrique** — [pedrosilva3107](https://github.com/pedrosilva3107)
