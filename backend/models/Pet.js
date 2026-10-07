const mongoose = require('mongoose');

const horarioSchema = new mongoose.Schema(
  {
    hora: { type: String, required: true, match: /^([01]\d|2[0-3]):[0-5]\d$/ },
    quantidade: { type: Number, required: true, min: 0 },
    tipoAlimento: { type: String, default: 'Ração' },
    ativo: { type: Boolean, default: true }
  },
  { _id: false }
);

const petSchema = new mongoose.Schema(
  {
    // O nome liga o pet aos registros (campo nomePet), por isso é único
    nome: { type: String, required: true, trim: true, unique: true },
    especie: { type: String, enum: ['Cão', 'Gato', 'Outro'], default: 'Cão' },
    peso: { type: Number, min: 0 },
    // meta de comida por dia, em gramas
    metaDiaria: { type: Number, min: 0, default: 0 },
    // meta de água por dia, em ml
    metaAgua: { type: Number, min: 0, default: 0 },
    horarios: { type: [horarioSchema], default: [] },
    // estoque de ração: quantidade no pacote na data em que foi informado
    estoqueGramas: { type: Number, min: 0, default: 0 },
    estoqueDesde: { type: Date }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Pet', petSchema);
