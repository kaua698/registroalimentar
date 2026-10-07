import { useState } from 'react';

import { Icon, ICONE_TIPO } from '../components/Icon';
import { Aneis, Avatar, Barra } from '../components/Ui';
import { consumoNoDia, corDoPet, estoque, proximaRefeicao, rotuloApetite, rotuloTipo, sequencia, unidade } from '../lib/calculos';
import { dataLonga, faltaPara, hhmm, mesmoDia, saudacao } from '../lib/datas';

export function Hoje({ pets, registros, clima, onRegistrar, onEditar, onNovoPet, irPara }) {
  const [filtro, setFiltro] = useState('todos');
  const agora = new Date();

  if (!pets.length) return <BoasVindas onNovoPet={onNovoPet} />;

  const visiveis = filtro === 'todos' ? pets : pets.filter((p) => p.nome === filtro);
  const resumo = visiveis.map((p) => {
    const comido = consumoNoDia(registros, p.nome, agora);
    return { ...p, comido, fracao: p.metaDiaria ? comido / p.metaDiaria : 0, cor: corDoPet(pets, p.nome) };
  });
  const proxima = proximaRefeicao(visiveis, agora);
  const deHoje = registros
    .filter((r) => mesmoDia(new Date(r.horarioRefeicao), agora) && (filtro === 'todos' || r.nomePet === filtro))
    .sort((a, b) => new Date(a.horarioRefeicao) - new Date(b.horarioRefeicao));
  const dias = sequencia(pets, registros, agora);
  const comAgua = visiveis.find((p) => p.metaAgua > 0);
  const comEstoque = visiveis.map((p) => ({ p, e: estoque(p, registros) })).find((x) => x.e);
  const faltas = resumo.filter((r) => r.metaDiaria && r.comido < r.metaDiaria);

  return (
    <>
      <header className="row between">
        <div>
          <p className="sm">{dataLonga(agora)}</p>
          <h1 className="h1">{saudacao(agora)}!</h1>
        </div>
        <button type="button" className="icon-btn" aria-label="Ajustes" onClick={() => irPara('ajustes')}>
          <Icon name="ajustes" />
        </button>
      </header>

      {pets.length > 1 ? (
        <div className="chips" role="group" aria-label="Filtrar por pet">
          <button type="button" className={`chip${filtro === 'todos' ? ' on' : ''}`} onClick={() => setFiltro('todos')}>
            Todos
          </button>
          {pets.map((p) => (
            <button type="button" key={p._id} className={`chip${filtro === p.nome ? ' on' : ''}`} onClick={() => setFiltro(p.nome)}>
              {p.nome}
            </button>
          ))}
        </div>
      ) : null}

      <section className="card entrada" style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }} aria-label="Meta de hoje">
        <Aneis itens={resumo} />
        <div className="stack grow" style={{ gap: 8 }}>
          {resumo.map((r) => (
            <div key={r._id} className="row" style={{ gap: 8 }}>
              <i style={{ width: 10, height: 10, borderRadius: '50%', background: r.cor, flex: 'none' }} />
              <span className="tx grow">{r.nome}</span>
              <b className="tx">
                {r.comido}
                {r.metaDiaria ? `/${r.metaDiaria}` : ''} g
              </b>
            </div>
          ))}
          <span className="sm">
            {faltas.length
              ? faltas.map((f) => `${f.metaDiaria - f.comido} g para ${f.nome}`).join(' e ').replace(/^/, 'Faltam ')
              : resumo.some((r) => r.metaDiaria)
                ? 'Meta do dia completa.'
                : 'Defina a meta diária no perfil do pet.'}
          </span>
        </div>
      </section>

      <div className="grid2">
        {proxima ? (
          <section className="card entrada" style={{ background: 'var(--accent)', color: 'var(--on-accent)' }}>
            <span style={{ fontSize: 13, fontWeight: 500 }}>Próxima refeição</span>
            <span className="big" style={{ fontSize: 30, color: 'inherit' }}>
              {proxima.hora}
            </span>
            <span style={{ fontSize: 13, fontWeight: 500 }}>
              {proxima.pet.nome} · {rotuloTipo(proxima.tipoAlimento)} {proxima.quantidade} g ·{' '}
              {proxima.amanha ? 'amanhã' : faltaPara(proxima.falta)}
            </span>
          </section>
        ) : (
          <button type="button" className="card entrada" style={{ border: '1px dashed var(--line)', textAlign: 'left' }} onClick={() => irPara('pets')}>
            <span className="sm">Próxima refeição</span>
            <span className="tx b">Defina os horários</span>
            <span className="sm">no perfil do pet</span>
          </button>
        )}

        {comAgua ? (
          <section className="card entrada">
            <span className="sm">Água {visiveis.length > 1 ? `· ${comAgua.nome}` : ''}</span>
            <span className="big" style={{ fontSize: 28 }}>
              {consumoNoDia(registros, comAgua.nome, agora, { agua: true })}
              <span className="sm"> /{comAgua.metaAgua} ml</span>
            </span>
            <Barra fracao={consumoNoDia(registros, comAgua.nome, agora, { agua: true }) / comAgua.metaAgua} cor="var(--accent2)" />
          </section>
        ) : null}

        {comEstoque ? (
          <section className="card entrada">
            <span className="sm">Ração {visiveis.length > 1 ? `· ${comEstoque.p.nome}` : ''}</span>
            <span className="num">
              {comEstoque.e.dias != null ? `acaba em ${comEstoque.e.dias} ${comEstoque.e.dias === 1 ? 'dia' : 'dias'}` : `${(comEstoque.e.restante / 1000).toFixed(1).replace('.', ',')} kg`}
            </span>
            <Barra fracao={comEstoque.e.fracao} cor={comEstoque.e.dias != null && comEstoque.e.dias <= 5 ? 'var(--danger)' : undefined} />
          </section>
        ) : null}

        <CardClima clima={clima} />
      </div>

      <section className="card entrada" style={{ gap: 10 }}>
        <div className="row between">
          <h2 className="h2">Hoje</h2>
          {dias > 1 ? <span className="pill">{dias} dias na meta</span> : null}
        </div>
        {deHoje.length === 0 ? (
          <p className="sm">Nada registrado ainda. Toque no + para anotar a primeira refeição.</p>
        ) : (
          deHoje.map((r) => (
            <button
              type="button"
              key={r._id}
              className="row"
              style={{ background: 'none', border: 0, padding: '4px 0', textAlign: 'left' }}
              onClick={() => onEditar(r)}
              aria-label={`Editar ${rotuloTipo(r.tipoAlimento)} de ${r.nomePet} às ${hhmm(new Date(r.horarioRefeicao))}`}
            >
              <span className="sm" style={{ width: 42 }}>
                {hhmm(new Date(r.horarioRefeicao))}
              </span>
              <Avatar nome={r.nomePet} cor={corDoPet(pets, r.nomePet)} small />
              <span className="tx grow">
                {rotuloTipo(r.tipoAlimento)} {r.quantidade} {unidade(r.tipoAlimento)}
              </span>
              <span className="sm">{r.tipoAlimento === 'Água' ? '' : rotuloApetite(r.apetite).toLowerCase()}</span>
            </button>
          ))
        )}
        <button type="button" className="ghost" onClick={() => onRegistrar()}>
          <span className="row" style={{ justifyContent: 'center', gap: 8 }}>
            <Icon name={ICONE_TIPO['Ração']} /> Registrar refeição
          </span>
        </button>
      </section>
    </>
  );
}

function CardClima({ clima }) {
  if (!clima.ativo) {
    return (
      <button type="button" className="card entrada" style={{ border: '1px dashed var(--line)', textAlign: 'left' }} onClick={clima.ativar}>
        <span className="sm">Clima</span>
        <span className="tx b">Ativar avisos de calor</span>
        <span className="sm">{clima.erro || 'Usa sua localização'}</span>
      </button>
    );
  }
  const max = clima.clima?.maxima;
  const quente = max != null && max >= 30;
  return (
    <section className="card entrada" style={{ gap: 4 }}>
      <span className="sm">Clima hoje</span>
      <span className="num">{max != null ? `${Math.round(max)}° de máxima` : '…'}</span>
      <span className="sm">{max == null ? 'Carregando' : quente ? 'Dia quente: troque a água 2×' : 'Água fresca 1× ao dia'}</span>
    </section>
  );
}

function BoasVindas({ onNovoPet }) {
  return (
    <section className="stack entrada" style={{ gap: 18, paddingTop: 18 }}>
      <div style={{ height: 260, borderRadius: 32, background: 'var(--soft)', position: 'relative', overflow: 'hidden' }} aria-hidden="true">
        <div style={{ position: 'absolute', left: '9%', top: 36, width: 140, height: 140, borderRadius: '50%', background: 'var(--accent)' }} />
        <div style={{ position: 'absolute', right: '9%', top: 80, width: 112, height: 112, borderRadius: 38, background: 'var(--accent2)' }} />
        <span className="row" style={{ position: 'absolute', left: 18, bottom: 18, background: 'var(--bg)', padding: '8px 12px', borderRadius: 99, fontSize: 13, fontWeight: 700 }}>
          <Icon name="check" size={16} /> Thor comeu às 7:02
        </span>
      </div>
      <h1 className="h1" style={{ fontSize: 36 }}>
        Quem já comeu hoje? Agora você sabe.
      </h1>
      <p className="sm" style={{ fontSize: 16 }}>
        Registre refeições em um toque, acompanhe a meta de cada pet e nunca mais sirva duas vezes.
      </p>
      <button type="button" className="btn" onClick={onNovoPet}>
        Cadastrar meu pet
      </button>
    </section>
  );
}
