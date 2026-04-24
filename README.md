# 🐾 Diário de Alimentação Pet — PWA Fullstack

Aplicação completa (Node.js + MongoDB + React) para tutores registrarem e monitorizarem a alimentação dos seus pets.

---

## 📁 Estrutura

```
app-pet/
├── backend/
│   ├── server.js                           # Entry point Express
│   ├── models/
│   │   ├── DiaryEntry.js                   # Entidade original
│   │   └── RegistroAlimentar.js            # ⭐ Nova entidade
│   ├── controllers/
│   │   ├── diaryController.js
│   │   └── registroAlimentarController.js  # ⭐ CRUD da nova entidade
│   ├── routes/
│   │   ├── diaryRoutes.js
│   │   └── registroAlimentarRoutes.js      # ⭐ Rotas /api/registros
│   └── package.json
├── frontend/
│   ├── index.html          # React 18 via CDN
│   ├── app.js              # Componentes React
│   ├── style.css           # Mobile-first responsive
│   ├── manifest.json       # Configuração PWA
│   ├── service-worker.js   # Cache estático + API offline
│   └── icons/
└── README.md
```

---

## 🚀 Funcionalidades

- **CRUD completo** de registros alimentares
- **Dashboard** com consumo total do dia por pet
- **Interface mobile-first** responsiva
- **PWA instalável** com suporte offline (cache da API)

---

## ⚙️ Variáveis de Ambiente (backend/.env)

```env
PORT=3000
MONGO_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/pet_diary?retryWrites=true&w=majority
```

> **Dica:** Use MongoDB Atlas para deploy.

---

## 🖥️ Rodando Localmente

### 1. MongoDB
Certifique-se de que o MongoDB está rodando localmente (padrão: `mongodb://127.0.0.1:27017/pet_diary`).

### 2. Backend
```bash
cd backend
npm install
npm start        # ou npm run dev (nodemon)
```
O servidor iniciará em `http://localhost:3000`.

### 3. Frontend
O próprio backend serve os arquivos estáticos do frontend. Acesse:
```
http://localhost:3000
```

A API estará disponível em:
```
GET    /api/registros
POST   /api/registros
PUT    /api/registros/:id
DELETE /api/registros/:id
```

---

## 🌐 Deploy

### Backend + Frontend juntos (recomendado)
Como o `server.js` já serve a pasta `frontend/` e possui fallback para SPA, você pode fazer deploy de tudo em um único serviço:

1. **Render** (Web Service)
   - Build Command: `cd backend && npm install`
   - Start Command: `cd backend && npm start`
   - Variável `MONGO_URI` apontando para Atlas

2. **Railway / Heroku / Fly.io**
   - Mesma lógica: serviço Node.js com `backend/` como raiz (ou root do repo se ajustar paths).

### Banco de Dados
- Crie um cluster no **MongoDB Atlas**
- Adicione o IP de acesso ou `0.0.0.0/0` para testes
- Copie a connection string para `MONGO_URI`

### PWA
- Acesse a URL deployada pelo navegador
- No menu do navegador (Chrome/Edge) clique em **"Instalar aplicativo"**
- Teste o modo offline desligando a internet e recarregando a página

---

## 📱 PWA — Service Worker

- **Cache estático**: arquivos HTML, CSS, JS, ícones e manifest
- **Cache dinâmico**: requisições à API `/api/registros` usam estratégia **Network First**, permitindo visualizar o histórico mesmo sem conexão

---

## 🛠️ Tecnologias

| Camada | Tecnologia |
|--------|------------|
| Backend | Node.js, Express, Mongoose, CORS |
| Banco | MongoDB (via Mongoose ODM) |
| Frontend | React 18 (CDN), JSX (Babel standalone) |
| Estilo | CSS3 puro — Mobile First |
| PWA | Manifest + Service Worker (Cache API) |

---

## ✅ Checklist da Atividade

- [x] Nova entidade `RegistroAlimentar` com Schema Mongoose
- [x] CRUD completo (POST, GET, PUT, DELETE) em `/api/registros`
- [x] Frontend React com formulário limpo
- [x] Dashboard de consumo diário por pet
- [x] Interface responsiva mobile-first
- [x] `manifest.json` configurado para instalação
- [x] Service Worker com cache offline da API
- [x] Backend serve frontend estático (deploy único)
- [x] Código separado e organizado

---

## 📄 Licença

Projeto acadêmico — livre para uso e modificação.

