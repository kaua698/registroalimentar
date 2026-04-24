const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

// Rotas da API
app.get('/api', (req, res) => res.json({ message: 'API do Diário Pet funcionando.' }));
app.use('/api/entries', require('./routes/diaryRoutes'));
app.use('/api/registros', require('./routes/registroAlimentarRoutes'));

// Servir frontend estático (para deploy fullstack em um único serviço)
app.use(express.static(path.join(__dirname, '../frontend')));

// Fallback para SPA
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/pet_diary';

mongoose.connect(MONGO_URI)
  .then(() => {
    app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
  })
  .catch((err) => {
    console.error('Erro ao conectar no MongoDB:', err.message);
    process.exit(1);
  });
