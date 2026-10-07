import { useState } from 'react';

import { Icon } from '../components/Icon';
import { Avatar } from '../components/Ui';
import { corDoPet, fracaoDoDia, rotuloApetite, rotuloTipo, unidade } from '../lib/calculos';
import { diaCurto, hhmm, inicioDoDia, mesmoDia, nomeMes } from '../lib/datas';

const SEMANA = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];

function nivel(f) {
  if (f == null || f === 0) return '';
  if (f >= 0.9) return 'n3';
  if (f >= 0.5) return 'n2';
  return 'n1';
}

export function Historico({ pets, registros, onEditar }) {
  const hoje = inicioDoDia();
  const [mes, setMes] = useState(new Date(hoje.getFullYear(), hoje.getMonth(), 1));
  const [dia, setDia] = useState(hoje);

  const primeiroDiaSemana = mes.getDay();
  const diasNoMes = new Date(mes.getFullYear(), mes.getMonth() + 1, 0).getDate();
  const celulas = [
    ...Array.from({ length: primeiroDiaSemana }, () => null),
    ...Array.from({ length: diasNoMes }, (_, i) => new Date(mes.getFullYear(), mes.getMonth(), i + 1)),
  ];
  const doDia = registros
    .filter((r) => mesmoDia(new Date(r.horarioRefeicao), dia))
    .sort((a, b) => new Date(b.horarioRefeicao) - new Date(a.horarioRefeicao));
  const mudarMes = (n) => setMes(new Date(mes.getFullYear(), mes.getMonth() + n, 1));

  return (
    <>
      <header className="row between">
        <h1 className="h1">{nomeMes(mes)}</h1>
        <div className="row" style={{ gap: 6 }}>
          <button type="button" className="icon-btn" aria-label="Mês anterior" onClick={() => mudarMes(-1)}>
            <Icon name="voltar" />
          </button>
          <button type="button" className="icon-btn" aria-label="Próximo mês" onClick={() => mudarMes(1)} disabled={mes >= new Date(hoje.getFullYear(), hoje.getMonth(), 1)}>
            <Icon name="seta" />
          </button>
        </div>
      </header>

      <section className="card entrada">
        <div className="cal" aria-hidden="true">
          {SEMANA.map((l, i) => (
            <span key={i}>{l}</span>
          ))}
        </div>
        <div className="cal">
          {celulas.map((d, i) =>
            d ? (
              <button
                type="button"
                key={i}
                className={`dia ${d > hoje ? '' : nivel(fracaoDoDia(pets, registros, d))}${mesmoDia(d, dia) ? ' sel' : ''}`}
                onClick={() => setDia(d)}
                aria-label={d.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long' })}
                aria-pressed={mesmoDia(d, dia)}
              >
                {d.getDate()}
              </button>
            ) : (
              <span key={i} className="dia fora" />
            ),
          )}
        </div>
        <div className="row sm wrap" style={{ gap: 14 }}>
          <span className="row" style={{ gap: 6 }}>
            <i style={{ width: 10, height: 10, borderRadius: 3, background: 'var(--accent)' }} />
            meta batida
          </span>
          <span className="row" style={{ gap: 6 }}>
            <i style={{ width: 10, height: 10, borderRadius: 3, background: 'var(--soft)' }} />
            mais da metade
          </span>
          <span className="row" style={{ gap: 6 }}>
            <i style={{ width: 10, height: 10, borderRadius: 3, background: 'var(--soft2)' }} />
            abaixo
          </span>
        </div>
      </section>

      <div className="row between">
        <h2 className="h2">{mesmoDia(dia, hoje) ? `Hoje, ${diaCurto(dia)}` : diaCurto(dia)}</h2>
        <span className="sm">
          {doDia.length} {doDia.length === 1 ? 'registro' : 'registros'}
        </span>
      </div>

      <section className="card" style={{ gap: 0 }}>
        {doDia.length === 0 ? (
          <p className="vazio">Nenhuma refeição neste dia.</p>
        ) : (
          doDia.map((r, i) => (
            <div key={r._id}>
              {i > 0 ? <div className="sep" /> : null}
              <button
                type="button"
                className="row"
                style={{ width: '100%', background: 'none', border: 0, padding: '12px 0', textAlign: 'left' }}
                onClick={() => onEditar(r)}
              >
                <Avatar nome={r.nomePet} cor={corDoPet(pets, r.nomePet)} />
                <div className="grow">
                  <div className="tx">
                    {r.nomePet} · {rotuloTipo(r.tipoAlimento)} {r.quantidade} {unidade(r.tipoAlimento)}
                  </div>
                  <div className="sm">
                    {hhmm(new Date(r.horarioRefeicao))}
                    {r.tipoAlimento !== 'Água' ? ` · ${rotuloApetite(r.apetite).toLowerCase()}` : ''}
                    {r.observacoes ? ` · ${r.observacoes}` : ''}
                  </div>
                </div>
                <Icon name="seta" size={18} style={{ color: 'var(--muted)' }} />
              </button>
            </div>
          ))
        )}
      </section>
    </>
  );
}
