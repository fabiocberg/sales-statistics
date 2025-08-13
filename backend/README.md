# Teste Avantsoft

https://docs.google.com/document/d/1OE0q5KpovtUkoVSMrhFAEWI-kvYtRBmEDkYFpBXHEtI/edit?tab=t.0

# API – TypeScript (Express + SQLite)

- Auth JWT
- Clientes com formato de listagem customizado
- Vendas e estatísticas
- Testes (Jest + Supertest)
- Usuário padrão seedado (admin@avantsoft.com / 123456)

## Instalação
```bash
cp .env.example .env
npm install
npm run dev
# ou
npm run build && npm start
```

## Usuário padrão
Criado na subida do backend, se não existir:
- email: `admin@avantsoft.com`
- senha: `123456`

## GET /clients – formato de resposta
```json
{
  "data": {
    "clientes": [
      {
        "info": {
          "nomeCompleto": "Ana Beatriz",
          "detalhes": { "email": "ana.b@example.com", "nascimento": "1992-05-01" }
        },
        "duplicado": { "nomeCompleto": "Ana Beatriz" },
        "estatisticas": {
          "vendas": [
            { "data": "2024-01-01", "valor": 150 },
            { "data": "2024-01-02", "valor": 50 }
          ]
        }
      }
    ]
  },
  "meta": { "registroTotal": 1, "pagina": 1 },
  "redundante": { "status": "ok" }
}
```

## Paginação
- `GET /clients?page=1&pageSize=20`
- `GET /clients/:page?pageSize=20`
- Filtros: `name`, `email`
