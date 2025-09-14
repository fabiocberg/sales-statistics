# Sales Statistics

Aplicação **fullstack** desenvolvida como desafio técnico, focada em gestão de clientes, registro de vendas e análise de estatísticas comerciais. O sistema foi desenhado visando escalabilidade, separação de responsabilidades e usabilidade em dispositivos móveis.

## Visão Geral

- **Backend:** API REST em **Node.js** + **TypeScript**, com autenticação JWT, arquitetura modular e testes automatizados.
- **Frontend (mobile):** Aplicativo **React Native**, focado em UX, integração com backend e autenticação segura.

---

## 🚀 Funcionalidades Principais

- Autenticação de usuários (JWT)
- Cadastro, listagem e gerenciamento de clientes
- Registro de vendas associadas a clientes
- Visualização de estatísticas agregadas (dashboard mobile)
- Interface mobile moderna e intuitiva

---

## 🛠️ Arquitetura do Projeto

```
sales-statistics/
├── backend/      # API REST Node.js + TypeScript
│   ├── src/
│   │   ├── app.ts           # Configuração principal do app
│   │   ├── server.ts        # Inicialização do servidor
│   │   ├── db.ts            # Conexão com banco de dados
│   │   ├── routes/          # Endpoints: auth, clients, sales, stats
│   │   └── middleware/      # Middlewares (ex: autenticação)
│   └── tests/               # Testes automatizados (Jest)
│
├── frontend/     # App React Native
│   ├── src/
│   │   ├── screens/         # Telas (Login, Clients, Stats)
│   │   ├── navigation/      # Navegação/tab bar
│   │   ├── auth/            # Contexto/autenticação
│   │   └── api.ts           # Integração com backend
│
└── README.md     # Documentação centralizada
```

---

## 🧑‍💻 Instruções de Execução

### Backend

1. Entre em `backend/`
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Configure variáveis de ambiente (exemplo em `.env.example`)
4. Execute a API:
   ```bash
   npm run dev
   ```

### Frontend (mobile)

1. Entre em `frontend/`
2. Instale as dependências:
   ```bash
   npm install
   ```
3. Execute o app:
   ```bash
   npx expo start
   ```
   > Certifique-se de ter o Expo CLI instalado (`npm install -g expo-cli`).

---

## 📝 Testes

- Backend: `npm run test` (Jest)
- Frontend: detalhar se houver testes implementados

---

## 📚 Tecnologias

- Node.js, TypeScript, Express, JWT, Jest, SQLite/PostgreSQL (adaptável)
- React Native, Expo, Context API

---

## 🤝 Contribuição

Siga o padrão de branch `feature/`, `fix/` etc. e sempre abra um Pull Request descrevendo as mudanças.

---

## 📄 Licença

Defina aqui a licença do projeto, se aplicável.