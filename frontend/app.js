const { useState, useEffect, useMemo } = React;

// Configurável conforme ambiente de deploy
const API_URL = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
  ? 'http://localhost:3000/api/registros'
  : '/api/registros';

function formatDateTimeLocal(date) {
  const d = new Date(date);
  const offset = d.getTimezoneOffset();
  const local = new Date(d.getTime() - offset * 60000);
  return local.toISOString().slice(0, 16);
}

function formatDisplayDate(date) {
  return new Date(date).toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

function getStartOfDay() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

function getEndOfDay() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
}

/* ---------- Formulário ---------- */
function FormularioAlimentacao({ onSalvar, editando, onCancelar }) {
  const [nomePet, setNomePet] = useState('');
  const [tipoAlimento, setTipoAlimento] = useState('Ração');
  const [quantidade, setQuantidade] = useState('');
  const [horarioRefeicao, setHorarioRefeicao] = useState(formatDateTimeLocal(new Date()));
  const [observacoes, setObservacoes] = useState('');

  useEffect(() => {
    if (editando) {
      setNomePet(editando.nomePet || '');
      setTipoAlimento(editando.tipoAlimento || 'Ração');
      setQuantidade(editando.quantidade != null ? String(editando.quantidade) : '');
      setHorarioRefeicao(formatDateTimeLocal(editando.horarioRefeicao));
      setObservacoes(editando.observacoes || '');
    } else {
      setNomePet('');
      setTipoAlimento('Ração');
      setQuantidade('');
      setHorarioRefeicao(formatDateTimeLocal(new Date()));
      setObservacoes('');
    }
  }, [editando]);

  function handleSubmit(e) {
    e.preventDefault();
    if (!nomePet.trim() || !quantidade.trim()) return;
    onSalvar({
      nomePet: nomePet.trim(),
      tipoAlimento,
      quantidade: Number(quantidade),
      horarioRefeicao: new Date(horarioRefeicao).toISOString(),
      observacoes: observacoes.trim()
    });
    if (!editando) {
      setNomePet('');
      setTipoAlimento('Ração');
      setQuantidade('');
      setHorarioRefeicao(formatDateTimeLocal(new Date()));
      setObservacoes('');
    }
  }

  return (
    <section className="card">
      <h2 className="card-title">{editando ? 'Editar Refeição' : 'Nova Refeição'}</h2>
      <form onSubmit={handleSubmit} className="form">
        <div className="form-group">
          <label htmlFor="nomePet">Nome do Pet</label>
          <input
            id="nomePet"
            type="text"
            value={nomePet}
            onChange={(e) => setNomePet(e.target.value)}
            placeholder="Ex: Thor"
            required
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="tipoAlimento">Tipo de Alimento</label>
            <select
              id="tipoAlimento"
              value={tipoAlimento}
              onChange={(e) => setTipoAlimento(e.target.value)}
              required
            >
              <option>Ração</option>
              <option>Humida</option>
              <option>Petisco</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="quantidade">Quantidade (g / ml)</label>
            <input
              id="quantidade"
              type="number"
              min="0"
              step="1"
              value={quantidade}
              onChange={(e) => setQuantidade(e.target.value)}
              placeholder="Ex: 150"
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="horarioRefeicao">Horário da Refeição</label>
          <input
            id="horarioRefeicao"
            type="datetime-local"
            value={horarioRefeicao}
            onChange={(e) => setHorarioRefeicao(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="observacoes">Observações</label>
          <textarea
            id="observacoes"
            rows="3"
            value={observacoes}
            onChange={(e) => setObservacoes(e.target.value)}
            placeholder="Ex: comeu tudo, recusou, etc."
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary">
            {editando ? 'Salvar Alterações' : 'Adicionar Refeição'}
          </button>
          {editando && (
            <button type="button" className="btn btn-secondary" onClick={onCancelar}>
              Cancelar Edição
            </button>
          )}
        </div>
      </form>
    </section>
  );
}

/* ---------- Dashboard ---------- */
function Dashboard({ registros }) {
  const hojeInicio = getStartOfDay();
  const hojeFim = getEndOfDay();

  const consumoHoje = useMemo(() => {
    const map = {};
    registros.forEach((r) => {
      const data = new Date(r.horarioRefeicao);
      if (data >= hojeInicio && data <= hojeFim) {
        if (!map[r.nomePet]) map[r.nomePet] = 0;
        map[r.nomePet] += r.quantidade;
      }
    });
    return map;
  }, [registros]);

  const totalHoje = useMemo(() => {
    return Object.values(consumoHoje).reduce((sum, v) => sum + v, 0);
  }, [consumoHoje]);

  const pets = Object.keys(consumoHoje);

  return (
    <section className="dashboard">
      <div className="dashboard-card total">
        <span className="dashboard-label">Consumo Total Hoje</span>
        <span className="dashboard-value">{totalHoje} g/ml</span>
      </div>
      {pets.map((pet) => (
        <div className="dashboard-card" key={pet}>
          <span className="dashboard-label">{pet}</span>
          <span className="dashboard-value">{consumoHoje[pet]} g/ml</span>
        </div>
      ))}
      {pets.length === 0 && (
        <div className="dashboard-card empty">
          <span className="dashboard-label">Nenhum registro hoje</span>
        </div>
      )}
    </section>
  );
}

/* ---------- Lista ---------- */
function ListaRegistros({ registros, onEditar, onExcluir }) {
  if (!registros.length) {
    return (
      <section className="card">
        <h2 className="card-title">Histórico</h2>
        <p className="empty-text">Nenhuma refeição registrada ainda.</p>
      </section>
    );
  }

  return (
    <section className="card">
      <h2 className="card-title">Histórico</h2>
      <div className="list">
        {registros.map((r) => (
          <div className="list-item" key={r._id}>
            <div className="list-info">
              <div className="list-header">
                <strong className="list-pet">{r.nomePet}</strong>
                <span className={`badge tipo-${r.tipoAlimento.toLowerCase()}`}>{r.tipoAlimento}</span>
              </div>
              <div className="list-meta">
                <span>{formatDisplayDate(r.horarioRefeicao)}</span>
                <span className="list-qtd">{r.quantidade} g/ml</span>
              </div>
              {r.observacoes && <p className="list-obs">{r.observacoes}</p>}
            </div>
            <div className="list-actions">
              <button className="btn btn-edit" onClick={() => onEditar(r)} title="Editar">
                ✏️ Editar
              </button>
              <button className="btn btn-delete" onClick={() => onExcluir(r._id)} title="Excluir">
                🗑️ Excluir
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ---------- App ---------- */
function App() {
  const [registros, setRegistros] = useState([]);
  const [editando, setEditando] = useState(null);
  const [mensagem, setMensagem] = useState('');
  const [carregando, setCarregando] = useState(true);

  async function carregarRegistros() {
    setCarregando(true);
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setRegistros(Array.isArray(data) ? data : []);
    } catch (err) {
      setMensagem('Erro ao carregar registros. Modo offline pode estar ativo.');
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregarRegistros();
  }, []);

  async function handleSalvar(dados) {
    try {
      const url = editando ? `${API_URL}/${editando._id}` : API_URL;
      const method = editando ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dados)
      });
      if (!res.ok) throw new Error('Falha na requisição');
      setMensagem(editando ? 'Registro atualizado com sucesso!' : 'Refeição registrada com sucesso!');
      setEditando(null);
      carregarRegistros();
    } catch (err) {
      setMensagem('Erro ao salvar. Tente novamente.');
    }
  }

  async function handleExcluir(id) {
    if (!confirm('Deseja excluir esta refeição?')) return;
    try {
      const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Falha na exclusão');
      setMensagem('Registro removido com sucesso!');
      if (editando && editando._id === id) setEditando(null);
      carregarRegistros();
    } catch (err) {
      setMensagem('Erro ao excluir. Tente novamente.');
    }
  }

  function handleEditar(registro) {
    setEditando(registro);
    setMensagem('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function handleCancelar() {
    setEditando(null);
    setMensagem('Edição cancelada.');
  }

  return (
    <div className="container">
      <header className="app-header">
        <h1>🐾 Diário de Alimentação Pet</h1>
        <p>Registre e acompanhe a alimentação dos seus pets</p>
      </header>

      {mensagem && (
        <div className="toast" role="alert">
          {mensagem}
          <button className="toast-close" onClick={() => setMensagem('')} aria-label="Fechar">
            ×
          </button>
        </div>
      )}

      <FormularioAlimentacao
        onSalvar={handleSalvar}
        editando={editando}
        onCancelar={handleCancelar}
      />

      <Dashboard registros={registros} />

      {carregando ? (
        <div className="card center">
          <p>Carregando histórico...</p>
        </div>
      ) : (
        <ListaRegistros
          registros={registros}
          onEditar={handleEditar}
          onExcluir={handleExcluir}
        />
      )}

      <footer className="app-footer">
        <p>Diário Pet • PWA Fullstack</p>
      </footer>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);

// Registro do Service Worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    try {
      await navigator.serviceWorker.register('./service-worker.js');
      console.log('Service Worker registrado.');
    } catch (err) {
      console.error('Erro ao registrar SW:', err);
    }
  });
}

