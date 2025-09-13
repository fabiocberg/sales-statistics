# Sales Statistics

Aplicação **fullstack** desenvolvida como desafio técnico.  
O sistema permite **gerenciar clientes, registrar vendas e visualizar estatísticas** em tempo real.  

É composto por:  
- **Backend:** API REST em **Node.js + TypeScript** com autenticação JWT e banco de dados relacional.  
- **Frontend (mobile):** Aplicativo **React Native** para interação com o usuário.

---

## 🚀 Funcionalidades

- Autenticação de usuários com JWT.  
- Cadastro e listagem de clientes.  
- Registro de vendas associadas a clientes.  
- Visualização de estatísticas agregadas de vendas.  
- Interface mobile intuitiva em React Native.  

---

## 🛠️ Arquitetura

```
sales-statistics/
│── backend/         # API REST em Node.js + TypeScript
│   ├── src/
│   │   ├── app.ts        # Configuração do app
│   │   ├── server.ts     # Inicialização do servidor
│   │   ├── db.ts         # Conexão com o banco
│   │   ├── routes/       # Rotas (auth, clients, sales, stats)
│   │   └── middleware/   # Middlewares (ex: autenticação)
│   └── tests/            # Testes com Jest
│
│── frontend/       # Aplicativo React Native
│   ├── src/
│   │   ├── screens/      # Telas (Login, Clients, Stats)
│   │   ├── navigation/   # Tabs de navegação
│   │   ├── auth/         # Contexto de autenticação
│   │   └── api.ts        # Integração com backend
│
└── README.md       # Documentação unificada
```

---

## 📦 Tecnologias Utilizadas

### Backend
- Node.js + TypeScript  
- Express  
- JWT (autenticação)  
- Banco de dados (ex: PostgreSQL ou SQLite configurável em `.env`)  
- Jest (testes automatizados)  

### Frontend
- React Native  
- Context API para autenticação  
- Navegação com Tabs  
- Axios (requisições HTTP)  

---

## ▶️ Como Rodar o Projeto

### 1. Clonar o repositório
```bash
git clone https://github.com/seuusuario/sales-statistics.git
cd sales-statistics
```

---

### 2. Rodar o Backend

1. Vá até a pasta `backend`:
   ```bash
   cd backend
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Configure variáveis de ambiente:
   ```bash
   cp .env.example .env
   ```

4. Rode a API:
   ```bash
   npm run dev
   ```
   A API estará disponível em: [http://localhost:4000](http://localhost:4000)

5. Rodar testes:
   ```bash
   npm test
   ```

---

### 3. Rodar o Frontend (Mobile)

1. Vá até a pasta `frontend`:
   ```bash
   cd frontend
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Inicie o app:
   ```bash
   npm start
   ```

4. Use o **Expo Go** no celular ou emulador para visualizar o app.  

---

## 📌 Próximos Passos

- Melhorar design da interface mobile.  
- Adicionar relatórios gráficos de vendas.  
- Deploy do backend em nuvem (Heroku, Render, AWS).  
- Implementar CI/CD com GitHub Actions.  
