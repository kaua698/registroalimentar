import { Icon } from '../components/Icon';
import { Toggle } from '../components/Ui';

const TEMAS = [
  { id: 'escuro', nome: 'Escuro', bg: '#0F1012', card: '#1A1B1F', accent: '#FF9B6A', text: '#F4F1EC' },
  { id: 'claro', nome: 'Claro', bg: '#F5F1EA', card: '#FFFFFF', accent: '#FF8F5A', text: '#1C1B19' },
];

export function Ajustes({ tema, setTema, clima, online }) {
  return (
    <>
      <h1 className="h1">Ajustes</h1>

      <section className="card" style={{ gap: 12 }}>
        <h2 className="tx b">Aparência</h2>
        <div className="grid2" role="radiogroup" aria-label="Tema">
          {TEMAS.map((t) => (
            <button
              type="button"
              key={t.id}
              role="radio"
              aria-checked={tema === t.id}
              onClick={() => setTema(t.id)}
              style={{
                borderRadius: 18,
                padding: 10,
                background: t.bg,
                border: `2px solid ${tema === t.id ? 'var(--accent)' : 'var(--line)'}`,
                display: 'flex',
                flexDirection: 'column',
                gap: 8,
                textAlign: 'left',
              }}
            >
              <span style={{ height: 56, borderRadius: 12, background: t.card, display: 'flex', alignItems: 'flex-end', padding: 8, gap: 6 }}>
                <i style={{ width: 22, height: 22, borderRadius: 8, background: t.accent }} />
                <i style={{ width: 40, height: 8, borderRadius: 4, background: t.text }} />
              </span>
              <span className="row" style={{ gap: 6, fontWeight: 700, fontSize: 14, color: t.text }}>
                <Icon name={t.id === 'escuro' ? 'lua' : 'sol'} size={16} />
                {t.nome}
              </span>
            </button>
          ))}
        </div>
      </section>

      <section className="card" style={{ gap: 0, padding: '6px 16px' }}>
        <div className="row" style={{ padding: '12px 0' }}>
          <Icon name="sol" style={{ color: 'var(--accent)' }} />
          <div className="grow">
            <div className="tx">Avisos de calor</div>
            <div className="sm">{clima.erro || 'Temperatura do dia pelo Open-Meteo, com sua localização'}</div>
          </div>
          <Toggle checked={clima.ativo} label="Avisos de calor" onChange={(v) => (v ? clima.ativar() : clima.desativar())} />
        </div>
        <div className="sep" />
        <div className="row" style={{ padding: '12px 0' }}>
          <Icon name="nuvem" style={{ color: online ? 'var(--accent2)' : 'var(--danger)' }} />
          <div className="grow">
            <div className="tx">{online ? 'Conectado' : 'Sem internet'}</div>
            <div className="sm">O app abre offline com o último histórico. Para salvar, precisa de conexão.</div>
          </div>
        </div>
      </section>

      <p className="sm" style={{ textAlign: 'center', padding: '10px 0' }}>
        Diário de Alimentação Pet · v2.0 · feito por Kauã
      </p>
    </>
  );
}
