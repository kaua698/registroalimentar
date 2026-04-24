const mongoose = require('mongoose');

const registroAlimentarSchema = new mongoose.Schema(
  {
    nomePet: { type: String, required: true, trim: true },
    tipoAlimento: {
      type: String,
      required: true,
      enum: ['Ração', 'Humida', 'Petisco']
    },
    quantidade: { type: Number, required: true, min: 0 },
    horarioRefeicao: { type: Date, required: true },
    observacoes: { type: String, trim: true, default: '' }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('RegistroAlimentar', registroAlimentarSchema);

