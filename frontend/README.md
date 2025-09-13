# Sales Statistics

https://docs.google.com/document/d/1OE0q5KpovtUkoVSMrhFAEWI-kvYtRBmEDkYFpBXHEtI/edit?tab=t.0

# Avantsoft — Expo App

App em **React Native (Expo, SDK 53, TypeScript)** para consumir o backend.

## Como rodar
```bash
npm install
npx expo install --fix   # alinha versões compatíveis do SDK 53
npm start
```

Edite `src/config.ts` e ajuste `BASE_URL` para o backend:
- iOS Simulator: `http://localhost:3000`
- Android Emulator: `http://10.0.2.2:3000` (default)
- Dispositivo físico: `http://SEU_IP_LOCAL:3000`

= Usuário padrão: admin@avantsoft.com / 123456

## Token nas requisições
O token de login é salvo no AsyncStorage, propagado via `setAuthToken(token)` e também por um **interceptor** do axios que injeta `Authorization` caso não esteja presente.

## Funcionalidades
- Login (`/auth/login`)
- Clientes — adicionar e listar; **normaliza** a resposta de `/clients` (estrutura aninhada/duplicada).
- Estatísticas — gráfico de vendas por dia e destaques (tops).
- Badge por cliente com **primeira letra do alfabeto que não aparece no nome** (ou `-`).

## Principais deps
- `expo@~53.0.0`, `react-native@0.79.5`, `react@19`
- React Navigation, axios, AsyncStorage
- react-native-chart-kit + react-native-svg


### Tratamento de sessão expirada (401)
- O app exibe um **Toast** e retorna para a tela de Login automaticamente quando o backend responde 401.
