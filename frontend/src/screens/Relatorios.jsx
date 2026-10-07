import { useState } from 'react';

import { Icon } from '../components/Icon';
import { consumoNoDia, corDoPet } from '../lib/calculos';
import { chaveDia, inicioDoDia, letraSemana, somarDias } from '../lib/datas';

const PERIODOS = [7, 14, 30];

export function Relatorios({ pets, registros }) {
  const [nome, setNome] = useState(pets[0]?.nome ?? '');
  const [periodo, setPeriodo] = useState(7);
  const pet = pets.find((p) => p.nome === nome) ?? pets[0];

  if (!pet) return <p className="vazio">Cadastre um pet para ver os relatórios.</p>;

  const hoje = inicioDoDia();
  const dias = Array.from({ length: periodo }, (_, i) => somarDias(hoje, i - periodo + 1));
  const valores = dias.map((d) => consumoNoDia(registros, pet.nome, d));
  // A média ignora o dia de hoje, que ainda não acabou
  const fechados = valores.slice(0, -1);
  const media = fechados.length ? Math.round(fechados.reduce((s, v) => s + v, 0) / fechados.length) : 0;
  const meta = pet.metaDiaria || 0;
  const maximo = Math.max(meta * 1.15, ...valores, 1);
  const noPeriodo = registros.filter(
    (r) => r.nomePet === pet.nome && r.tipoAlimento !== 'Água' && new Date(r.horarioRefeicao) >= dias[0],
  );
  const contagem = (a) => noPeriodo.filter((r) => (r.apetite || 'tudo') === a).length;
  const cor = corDoPet(pets, pet.nome);

  const W = 320;
  const H = 150;
  const largura = W / periodo;
  const yMeta = H - (meta / maximo) * (H - 10);

  function exportar() {
    const linhas = [['data', 'pet', 'tipo', 'quantidade', 'apetite', 'observacoes']];
    registros
      .filter((r) => r.nomePet === pet.nome && new Date(r.horarioRefeicao) >= dias[0])
      .forEach((r) =>
        linhas.push([new Date(r.horarioRefeicao).toLocaleString('pt-BR'), r.nomePet, r.tipoAlimento, r.quantidade, r.apetite || '', r.observacoes || '']),
      );
    const csv = linhas.map((l) => l.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(';')).join('\n');
    const url = URL.createObjectURL(new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = `diario-${pet.nome.toLowerCase()}-${chaveDia(hoje)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <>
      <h1 className="h1">Relatório {pets.length > 1 ? '' : `do ${pet.nome}`}</h1>
      {pets.length > 1 ? (
        <div className="chips" role="group" aria-label="Pet">
          {pets.map((p) => (
            <button type="button" key={p._id} className={`chip${p.nome === pet.nome ? ' on' : ''}`} onClick={() => setNome(p.nome)}>
              {p.nome}
            </button>
          ))}
        </div>
      ) : null}
      <div className="chips" role="group" aria-label="Período">
        {PERIODOS.map((n) => (
          <button type="button" key={n} className={`chip${periodo === n ? ' on' : ''}`} onClick={() => setPeriodo(n)}>
            {n} dias
          </button>
        ))}
      </div>

      <section className="card entrada">
        <div className="row between" style={{ alignItems: 'flex-end' }}>
          <div>
            <div className="sm">Média por dia</div>
            <div className="big">{media} g</div>
          </div>
          {meta ? <span className="pill">{Math.round((media / meta) * 100)}% da meta</span> : <span className="sm">sem meta</span>}
        </div>
        <svg viewBox={`0 0 ${W} ${H + 18}`} width="100%" role="img" aria-label={`Consumo diário de ${pet.nome} nos últimos ${periodo} dias`}>
          {meta ? <line x1="0" x2={W} y1={yMeta} y2={yMeta} stroke="var(--muted)" strokeDasharray="4 5" /> : null}
          {valores.map((v, i) => {
            const h = (v / maximo) * (H - 10);
            const hojeBar = i === valores.length - 1;
            const bateu = meta && v >= meta * 0.9;
            return (
              <g key={i}>
                <rect
                  x={i * largura + largura * 0.18}
                  y={H - Math.max(h, 3)}
                  width={largura * 0.64}
                  height={Math.max(h, 3)}
                  rx={Math.min(10, largura * 0.3)}
                  fill={hojeBar ? 'var(--card2)' : bateu ? cor : 'var(--soft)'}
                  stroke={hojeBar ? cor : 'none'}
                  strokeDasharray={hojeBar ? '4 4' : undefined}
                >
                  <title>{`${dias[i].toLocaleDateString('pt-BR')}: ${v} g`}</title>
                </rect>
                {periodo <= 14 ? (
                  <text x={i * largura + largura / 2} y={H + 14} textAnchor="middle" fontSize="11" fill="var(--muted)">
                    {letraSemana(dias[i])}
                  </text>
                ) : null}
              </g>
            );
          })}
        </svg>
        <span className="sm">Linha tracejada: meta de {meta || '—'} g. A última barra é hoje, ainda em andamento.</span>
      </section>

      <div className="grid2">
        <div className="card2">
          <span className="sm">Comeu tudo</span>
          <span className="num">
            {contagem('tudo')} de {noPeriodo.length}
          </span>
        </div>
        <div className="card2">
          <span className="sm">Sobrou ou recusou</span>
          <span className="num">{contagem('pouco') + contagem('recusou')}</span>
        </div>
      </div>

      <button type="button" className="btn inverse" onClick={exportar}>
        <Icon name="baixar" /> Baixar planilha (CSV)
      </button>
    </>
  );
}
