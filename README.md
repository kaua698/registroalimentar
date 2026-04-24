# Diário de Alimentação Pet

Aplicação fullstack para registro e monitoramento da alimentação diária de pets.

## Tecnologias

- **Backend:** Node.js, Express, Mongoose
- **Banco de Dados:** MongoDB
- **Frontend:** React 18, HTML5, CSS3
- **PWA:** Service Worker, Web Manifest

## Estrutura do Projeto

```
├── backend/
│   ├── controllers/     # Lógica das rotas
│   ├── models/          # Schemas do Mongoose
│   ├── routes/          # Definição de rotas
│   └── server.js        # Entry point
├── frontend/
│   ├── index.html       # Estrutura base
│   ├── app.js           # Componentes React
│   ├── style.css        # Estilos responsivos
│   ├── manifest.json    # Configuração PWA
│   └── service-worker.js # Cache offline
```

## Variáveis de Ambiente

Criar arquivo `backend/.env`:

```env
PORT=3000
MONGO_URI=mongodb+srv://usuario:senha@cluster.mongodb.net/pet_diary
```

## Executar Localmente

```bash
cd backend
npm install
npm start
```

Acesse `http://localhost:3000`

## Rotas da API

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | /api/registros | Listar registros |
| POST | /api/registros | Criar registro |
| PUT | /api/registros/:id | Atualizar registro |
| DELETE | /api/registros/:id | Remover registro |

## Deploy

1. Configurar variável `MONGO_URI` no ambiente de produção
2. Executar `npm install && npm start` a partir da pasta `backend/`

---

Projeto acadêmico desenvolvido como Progressive Web Application.

