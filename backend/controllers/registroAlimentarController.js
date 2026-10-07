const RegistroAlimentar = require('../models/RegistroAlimentar');

// id inválido ou campo fora das regras é erro de quem chamou (400), não do servidor
const status = (err, padrao) => (err.name === 'ValidationError' || err.name === 'CastError' ? 400 : padrao);

exports.listRegistros = async (req, res) => {
  try {
    // ?desde=AAAA-MM-DD limita o período (o app pede só os últimos meses)
    const filtro = {};
    const desde = new Date(req.query.desde);
    if (req.query.desde && !Number.isNaN(desde.getTime())) filtro.horarioRefeicao = { $gte: desde };
    const registros = await RegistroAlimentar.find(filtro).sort({ horarioRefeicao: -1 });
    res.json(registros);
  } catch (err) {
    res.status(500).json({ message: 'Erro ao listar registros.', error: err.message });
  }
};

exports.getRegistroById = async (req, res) => {
  try {
    const registro = await RegistroAlimentar.findById(req.params.id);
    if (!registro) return res.status(404).json({ message: 'Registro não encontrado.' });
    res.json(registro);
  } catch (err) {
    res.status(status(err, 500)).json({ message: 'Erro ao buscar registro.', error: err.message });
  }
};

exports.createRegistro = async (req, res) => {
  try {
    const registro = await RegistroAlimentar.create(req.body);
    res.status(201).json(registro);
  } catch (err) {
    res.status(status(err, 500)).json({ message: 'Erro ao criar registro.', error: err.message });
  }
};

exports.updateRegistro = async (req, res) => {
  try {
    const registro = await RegistroAlimentar.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!registro) return res.status(404).json({ message: 'Registro não encontrado.' });
    res.json(registro);
  } catch (err) {
    res.status(status(err, 500)).json({ message: 'Erro ao atualizar registro.', error: err.message });
  }
};

exports.deleteRegistro = async (req, res) => {
  try {
    const registro = await RegistroAlimentar.findByIdAndDelete(req.params.id);
    if (!registro) return res.status(404).json({ message: 'Registro não encontrado.' });
    res.json({ message: 'Registro removido com sucesso.' });
  } catch (err) {
    res.status(status(err, 500)).json({ message: 'Erro ao remover registro.', error: err.message });
  }
};

