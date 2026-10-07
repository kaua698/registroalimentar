const Pet = require('../models/Pet');
const RegistroAlimentar = require('../models/RegistroAlimentar');

const erroDeValidacao = (err) => err.name === 'ValidationError' || err.name === 'CastError' || err.code === 11000;

function mensagem(err) {
  if (err.code === 11000) return 'Já existe um pet com esse nome.';
  return err.message;
}

exports.listPets = async (req, res) => {
  try {
    res.json(await Pet.find().sort({ createdAt: 1 }));
  } catch (err) {
    res.status(500).json({ message: 'Erro ao listar pets.', error: err.message });
  }
};

exports.createPet = async (req, res) => {
  try {
    const dados = { ...req.body };
    if (dados.estoqueGramas != null && !dados.estoqueDesde) dados.estoqueDesde = new Date();
    res.status(201).json(await Pet.create(dados));
  } catch (err) {
    res.status(erroDeValidacao(err) ? 400 : 500).json({ message: 'Erro ao criar pet.', error: mensagem(err) });
  }
};

exports.updatePet = async (req, res) => {
  try {
    const atual = await Pet.findById(req.params.id);
    if (!atual) return res.status(404).json({ message: 'Pet não encontrado.' });

    const dados = { ...req.body };
    // Estoque informado de novo: o consumo passa a contar a partir de agora
    if (dados.estoqueGramas != null && Number(dados.estoqueGramas) !== atual.estoqueGramas) {
      dados.estoqueDesde = new Date();
    }
    // Renomear o pet leva os registros junto
    if (dados.nome && dados.nome.trim() !== atual.nome) {
      await RegistroAlimentar.updateMany({ nomePet: atual.nome }, { nomePet: dados.nome.trim() });
    }

    const pet = await Pet.findByIdAndUpdate(req.params.id, dados, { new: true, runValidators: true });
    res.json(pet);
  } catch (err) {
    res.status(erroDeValidacao(err) ? 400 : 500).json({ message: 'Erro ao atualizar pet.', error: mensagem(err) });
  }
};

exports.deletePet = async (req, res) => {
  try {
    const pet = await Pet.findByIdAndDelete(req.params.id);
    if (!pet) return res.status(404).json({ message: 'Pet não encontrado.' });
    // Os registros ficam guardados no histórico mesmo sem o pet
    res.json({ message: 'Pet removido.' });
  } catch (err) {
    res.status(erroDeValidacao(err) ? 400 : 500).json({ message: 'Erro ao remover pet.', error: err.message });
  }
};
