const mongoose = require('mongoose');

// "Humida" continua aceito para não quebrar registros antigos; a tela mostra "Úmida".
const TIPOS = ['Ração', 'Humida', 'Petisco', 'Água'];
const APETITES = ['tudo', 'pouco', 'recusou'];

const registroAlimentarSchema = new mongoose.Schema(
  {
    nomePet: { type: String, required: true, trim: true },
    tipoAlimento: { type: String, required: true, enum: TIPOS },
    // gramas para comida, ml para água
    quantidade: { type: Number, required: true, min: 0 },
    horarioRefeicao: { type: Date, required: true },
    apetite: { type: String, enum: APETITES, default: 'tudo' },
    observacoes: { type: String, trim: true, default: '' }
  },
  { timestamps: true }
);

module.exports = mongoose.model('RegistroAlimentar', registroAlimentarSchema);
