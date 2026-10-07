import { useState } from 'react';

import { Icon } from '../components/Icon';
import { Avatar, Barra, Sheet, Toggle } from '../components/Ui';
import { corDoPet, estoque, metaSugerida } from '../lib/calculos';

export function Pets({ pets, registros, onEditarPet, onNovoPet }) {
  return (
    <>
      <header className="row between">
        <h1 className="h1">Pets</h1>
        <button type="button" className="chip" onClick={onNovoPet}>
          <Icon name="mais" size={18} /> Novo pet
        </button>
      </header>
      {pets.length === 0 ? <p className="vazio">Nenhum pet cadastrado ainda.</p> : null}
      {pets.map((p) => {
        const e = estoque(p, registros);
        return (
          <button type="button" key={p._id} className="card entrada" style={{ textAlign: 'left', border: 0, gap: 12 }} onClick={() => onEditarPet(p)}>
            <div className="row">
              <Avatar nome={p.nome} cor={corDoPet(pets, p.nome)} />
              <div className="grow">
                <div className="h2">{p.nome}</div>
                <div className="sm">
                  {p.especie}
                  {p.peso ? ` · ${String(p.peso).replace('.', ',')} kg` : ''}
                </div>
              </div>
              <Icon name="seta" size={18} style={{ color: 'var(--muted)' }} />
            </div>
            <div className="grid2" style={{ gridTemplateColumns: 'repeat(3, minmax(0, 1fr))' }}>
              <div className="card2">
                <span className="sm">Meta</span>
                <span className="num">{p.metaDiaria ? `${p.metaDiaria} g` : '—'}</span>
              </div>
              <div className="card2">
                <span className="sm">Horários</span>
                <span className="num">{(p.horarios || []).filter((h) => h.ativo !== false).length || '—'}</span>
              </div>
              <div className="card2">
                <span className="sm">Ração</span>
                <span className="num">{e?.dias != null ? `${e.dias} d` : '—'}</span>
              </div>
            </div>
            {e ? <Barra fracao={e.fracao} /> : null}
          </button>
        );
      })}
    </>
  );
}

const VAZIO = { nome: '', especie: 'Cão', peso: '', metaDiaria: '', metaAgua: '', estoqueKg: '', horarios: [] };

// Cadastro e edição do pet: dados, meta (com sugestão pelo peso), horários do plano e estoque
export function PetForm({ pet, onSalvar, onExcluir, onClose }) {
  const [f, setF] = useState(() =>
    pet
      ? {
          nome: pet.nome,
          especie: pet.especie || 'Cão',
          peso: pet.peso != null ? String(pet.peso).replace('.', ',') : '',
          metaDiaria: pet.metaDiaria || '',
          metaAgua: pet.metaAgua || '',
          estoqueKg: pet.estoqueGramas ? String(pet.estoqueGramas / 1000) : '',
          horarios: (pet.horarios || []).map((h) => ({ ...h })),
        }
      : VAZIO,
  );
  const [salvando, setSalvando] = useState(false);
  const set = (campo) => (e) => setF({ ...f, [campo]: e.target.value });
  const sugestao = metaSugerida(f.especie, Number(String(f.peso).replace(',', '.')));
  const somaPlano = f.horarios.filter((h) => h.ativo !== false).reduce((s, h) => s + Number(h.quantidade || 0), 0);

  const mudarHorario = (i, campo, valor) =>
    setF({ ...f, horarios: f.horarios.map((h, j) => (j === i ? { ...h, [campo]: valor } : h)) });

  async function enviar(e) {
    e.preventDefault();
    if (!f.nome.trim()) return;
    setSalvando(true);
    const num = (v) => (v === '' || v == null ? undefined : Number(String(v).replace(',', '.')));
    const dados = {
      nome: f.nome.trim(),
      especie: f.especie,
      peso: num(f.peso),
      metaDiaria: num(f.metaDiaria) ?? 0,
      metaAgua: num(f.metaAgua) ?? 0,
      horarios: f.horarios
        .filter((h) => h.hora)
        .sort((a, b) => a.hora.localeCompare(b.hora))
        .map((h) => ({ ...h, quantidade: Number(h.quantidade || 0) })),
    };
    const kg = num(f.estoqueKg);
    const atual = pet?.estoqueGramas ? pet.estoqueGramas / 1000 : undefined;
    // Só manda o estoque quando ele foi mudado, para não zerar o consumo já descontado
    if (kg !== atual) dados.estoqueGramas = kg ? Math.round(kg * 1000) : 0;
    const ok = await onSalvar(dados);
    setSalvando(false);
    if (ok) onClose();
  }

  return (
    <Sheet titulo={pet ? `Editar ${pet.nome}` : 'Novo pet'} onClose={onClose}>
      <form className="stack" style={{ gap: 14 }} onSubmit={enviar}>
        <div className="row between">
          <h2 className="h1" style={{ fontSize: 26 }}>
            {pet ? pet.nome : 'Novo pet'}
          </h2>
          {pet ? (
            <button type="button" className="icon-btn" aria-label={`Excluir ${pet.nome}`} style={{ color: 'var(--danger)' }} onClick={() => onExcluir(pet)}>
              <Icon name="lixo" />
            </button>
          ) : null}
        </div>

        <div className="field">
          <label htmlFor="pet-nome">Nome</label>
          <input id="pet-nome" className="input" value={f.nome} onChange={set('nome')} required maxLength={40} placeholder="Ex.: Thor" />
        </div>
        <div className="grid2">
          <div className="field">
            <label htmlFor="pet-especie">Espécie</label>
            <select id="pet-especie" className="input" value={f.especie} onChange={set('especie')}>
              <option>Cão</option>
              <option>Gato</option>
              <option>Outro</option>
            </select>
          </div>
          <div className="field">
            <label htmlFor="pet-peso">Peso (kg)</label>
            <input id="pet-peso" className="input" inputMode="decimal" value={f.peso} onChange={set('peso')} placeholder="12,4" />
          </div>
        </div>

        <div className="card2" style={{ gap: 10 }}>
          <div className="grid2">
            <div className="field">
              <label htmlFor="pet-meta">Meta de comida (g/dia)</label>
              <input id="pet-meta" className="input" type="number" min="0" value={f.metaDiaria} onChange={set('metaDiaria')} style={{ background: 'var(--card)' }} />
            </div>
            <div className="field">
              <label htmlFor="pet-agua">Meta de água (ml/dia)</label>
              <input id="pet-agua" className="input" type="number" min="0" value={f.metaAgua} onChange={set('metaAgua')} style={{ background: 'var(--card)' }} />
            </div>
          </div>
          {sugestao && f.especie !== 'Outro' ? (
            <div className="row between wrap" style={{ gap: 8 }}>
              <span className="sm grow">
                Sugestão pelo peso: <b style={{ color: 'var(--text)' }}>{sugestao.gramas} g</b> de ração e {sugestao.agua} ml de água (ração com 3,6 kcal/g). Confirme com o veterinário.
              </span>
              <button type="button" className="chip" onClick={() => setF({ ...f, metaDiaria: sugestao.gramas, metaAgua: sugestao.agua })}>
                Usar
              </button>
            </div>
          ) : null}
        </div>

        <div className="stack">
          <div className="row between">
            <span className="tx b">Horários</span>
            <span className="sm">{somaPlano ? `soma ${somaPlano} g` : ''}</span>
          </div>
          {f.horarios.map((h, i) => (
            <div key={i} className="row" style={{ gap: 8 }}>
              <input className="input" type="time" aria-label="Hora" value={h.hora} onChange={(e) => mudarHorario(i, 'hora', e.target.value)} style={{ width: 120 }} />
              <input className="input" type="number" min="0" aria-label="Quantidade em gramas" value={h.quantidade} onChange={(e) => mudarHorario(i, 'quantidade', e.target.value)} />
              <span className="sm">g</span>
              <Toggle checked={h.ativo !== false} label="Horário ativo" onChange={(v) => mudarHorario(i, 'ativo', v)} />
              <button type="button" className="icon-btn" aria-label="Remover horário" onClick={() => setF({ ...f, horarios: f.horarios.filter((_, j) => j !== i) })}>
                <Icon name="lixo" size={18} />
              </button>
            </div>
          ))}
          <button type="button" className="ghost" onClick={() => setF({ ...f, horarios: [...f.horarios, { hora: '', quantidade: '', tipoAlimento: 'Ração', ativo: true }] })}>
            + Adicionar horário
          </button>
        </div>

        <div className="field">
          <label htmlFor="pet-estoque">Ração em casa agora (kg)</label>
          <input id="pet-estoque" className="input" inputMode="decimal" value={f.estoqueKg} onChange={set('estoqueKg')} placeholder="Ex.: 10" />
          <span className="sm">A cada refeição de ração registrada, o estoque baixa sozinho.</span>
        </div>

        <button type="submit" className="btn" disabled={salvando}>
          {salvando ? 'Salvando…' : pet ? 'Salvar' : 'Cadastrar pet'}
        </button>
      </form>
    </Sheet>
  );
}
