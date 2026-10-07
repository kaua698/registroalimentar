import { useState } from 'react';

import { Icon, ICONE_TIPO } from '../components/Icon';
import { Avatar, Sheet } from '../components/Ui';
import { APETITES, consumoNoDia, corDoPet, TIPOS, unidade } from '../lib/calculos';
import { paraInputLocal } from '../lib/datas';

// Registrar ou editar uma refeição. A quantidade já vem sugerida com o que falta para a meta.
export function Registrar({ pets, registros, editando, petInicial, onSalvar, onExcluir, onClose }) {
  const primeiro = editando?.nomePet ?? petInicial ?? pets[0]?.nome ?? '';
  const [nomePet, setNomePet] = useState(primeiro);
  const [tipo, setTipo] = useState(editando?.tipoAlimento ?? 'Ração');
  const [quantidade, setQuantidade] = useState(() => editando?.quantidade ?? sugestao(primeiro, 'Ração'));
  const [apetite, setApetite] = useState(editando?.apetite ?? 'tudo');
  const [horario, setHorario] = useState(paraInputLocal(editando ? new Date(editando.horarioRefeicao) : new Date()));
  const [obs, setObs] = useState(editando?.observacoes ?? '');
  const [salvando, setSalvando] = useState(false);

  function sugestao(nome, t) {
    const pet = pets.find((p) => p.nome === nome);
    if (!pet) return 50;
    if (t === 'Água') return 200;
    if (t === 'Petisco') return 10;
    const falta = (pet.metaDiaria || 0) - consumoNoDia(registros, nome, new Date());
    return falta > 0 ? falta : 50;
  }

  const pet = pets.find((p) => p.nome === nomePet);
  const falta = pet?.metaDiaria ? pet.metaDiaria - consumoNoDia(registros, nomePet, new Date()) : null;
  const un = unidade(tipo);
  const atalhos = tipo === 'Água' ? [100, 200, 300] : tipo === 'Petisco' ? [5, 10, 20] : [25, 50, 100];

  const trocarPet = (n) => {
    setNomePet(n);
    if (!editando) setQuantidade(sugestao(n, tipo));
  };
  const trocarTipo = (t) => {
    setTipo(t);
    if (!editando) setQuantidade(sugestao(nomePet, t));
  };

  async function enviar(e) {
    e.preventDefault();
    if (!nomePet || !(quantidade >= 0)) return;
    setSalvando(true);
    const ok = await onSalvar({
      nomePet,
      tipoAlimento: tipo,
      quantidade: Number(quantidade),
      apetite: tipo === 'Água' ? 'tudo' : apetite,
      horarioRefeicao: new Date(horario).toISOString(),
      observacoes: obs.trim(),
    });
    setSalvando(false);
    if (ok) onClose();
  }

  return (
    <Sheet titulo={editando ? 'Editar refeição' : 'Nova refeição'} onClose={onClose}>
      <form className="stack" style={{ gap: 14 }} onSubmit={enviar}>
        <div className="row between">
          <h2 className="h1" style={{ fontSize: 26 }}>
            {editando ? 'Editar refeição' : 'Nova refeição'}
          </h2>
          {editando ? (
            <button type="button" className="icon-btn" aria-label="Excluir refeição" onClick={() => onExcluir(editando)} style={{ color: 'var(--danger)' }}>
              <Icon name="lixo" />
            </button>
          ) : null}
        </div>

        <fieldset className="row wrap" style={{ border: 0, padding: 0, margin: 0, gap: 10 }}>
          <legend className="sr-only">Pet</legend>
          {pets.map((p) => (
            <button
              type="button"
              key={p._id}
              className={`select-card grow${nomePet === p.nome ? ' on' : ''}`}
              aria-pressed={nomePet === p.nome}
              onClick={() => trocarPet(p.nome)}
              style={{ minWidth: 130 }}
            >
              <Avatar nome={p.nome} cor={corDoPet(pets, p.nome)} small />
              <span className="tx">{p.nome}</span>
            </button>
          ))}
        </fieldset>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 8 }} role="group" aria-label="Tipo">
          {TIPOS.map((t) => (
            <button
              type="button"
              key={t.valor}
              className={`select-card vertical${tipo === t.valor ? ' on' : ''}`}
              aria-pressed={tipo === t.valor}
              onClick={() => trocarTipo(t.valor)}
              style={{ color: tipo === t.valor ? 'var(--text)' : 'var(--muted)' }}
            >
              <Icon name={ICONE_TIPO[t.valor]} />
              {t.rotulo}
            </button>
          ))}
        </div>

        <div className="stepper">
          <button type="button" aria-label="Diminuir" onClick={() => setQuantidade((q) => Math.max(0, Number(q) - 5))}>
            −
          </button>
          <div style={{ textAlign: 'center' }}>
            <label className="row" style={{ justifyContent: 'center', gap: 4 }}>
              <input
                type="number"
                inputMode="numeric"
                min="0"
                aria-label={`Quantidade em ${un}`}
                value={quantidade}
                onChange={(e) => setQuantidade(e.target.value === '' ? '' : Number(e.target.value))}
              />
              <span className="num" style={{ color: 'var(--muted)' }}>
                {un}
              </span>
            </label>
            <div className="sm">
              {tipo === 'Ração' || tipo === 'Humida'
                ? falta == null
                  ? 'sem meta definida'
                  : falta <= 0
                    ? 'meta de hoje já completa'
                    : Number(quantidade) >= falta
                      ? 'completa a meta de hoje'
                      : `faltam ${falta} g na meta`
                : ' '}
            </div>
          </div>
          <button type="button" aria-label="Aumentar" onClick={() => setQuantidade((q) => Number(q) + 5)}>
            +
          </button>
        </div>
        <div className="chips">
          {atalhos.map((v) => (
            <button type="button" key={v} className={`chip${Number(quantidade) === v ? ' on' : ''}`} onClick={() => setQuantidade(v)}>
              {v} {un}
            </button>
          ))}
        </div>

        {tipo !== 'Água' ? (
          <>
            <span className="tx b">Como foi?</span>
            <div className="chips" role="group" aria-label="Apetite">
              {APETITES.map((a) => (
                <button type="button" key={a.valor} className={`chip${apetite === a.valor ? ' on' : ''}`} aria-pressed={apetite === a.valor} onClick={() => setApetite(a.valor)}>
                  {a.rotulo}
                </button>
              ))}
            </div>
          </>
        ) : null}

        <div className="grid2">
          <div className="field">
            <label htmlFor="horario">Horário</label>
            <input id="horario" className="input" type="datetime-local" value={horario} onChange={(e) => setHorario(e.target.value)} required />
          </div>
          <div className="field">
            <label htmlFor="obs">Observação</label>
            <input id="obs" className="input" value={obs} onChange={(e) => setObs(e.target.value)} placeholder="opcional" maxLength={200} />
          </div>
        </div>

        <button type="submit" className="btn" disabled={salvando || !nomePet || quantidade === ''}>
          {salvando ? 'Salvando…' : editando ? 'Salvar alterações' : `Registrar ${quantidade || 0} ${un} para ${nomePet}`}
        </button>
      </form>
    </Sheet>
  );
}
