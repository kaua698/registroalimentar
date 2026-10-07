const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

// Rotas da API
app.get('/api', (req, res) => res.json({ message: 'API do Diário Pet funcionando.' }));
app.use('/api/registros', require('./routes/registroAlimentarRoutes'));
app.use('/api/pets', require('./routes/petRoutes'));

// Rota de API inexistente responde 404 em JSON (em vez de cair no index.html do front)
app.use('/api', (req, res) => res.status(404).json({ message: 'Rota não encontrada.' }));

// Front: build do Vite em frontend/dist (gere com "npm run build" na raiz)
const DIST = path.join(__dirname, '../frontend/dist');
if (fs.existsSync(DIST)) {
  app.use(express.static(DIST));
  app.get('*', (req, res) => res.sendFile(path.join(DIST, 'index.html')));
} else {
  app.get('/', (req, res) =>
    res.send('API no ar. O front ainda não foi gerado: rode "npm run build" na raiz ou "npm run dev" em frontend/.')
  );
}

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/pet_diary';

mongoose
  .connect(MONGO_URI)
  .then(() => {
    app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
  })
  .catch((err) => {
    console.error('Erro ao conectar no MongoDB:', err.message);
    process.exit(1);
  });
