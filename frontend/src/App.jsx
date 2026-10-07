import { useCallback, useEffect, useState } from 'react';

import { Icon } from './components/Icon';
import { Toast } from './components/Ui';
import { api } from './lib/api';
import { useClima } from './lib/clima';
import { chaveDia, somarDias } from './lib/datas';
import { useTema } from './lib/tema';
import { Ajustes } from './screens/Ajustes';
import { Historico } from './screens/Historico';
import { Hoje } from './screens/Hoje';
import { PetForm, Pets } from './screens/Pets';
import { Registrar } from './screens/Registrar';
import { Relatorios } from './screens/Relatorios';

const ABAS = [
  { id: 'hoje', rotulo: 'Hoje', icone: 'casa' },
  { id: 'historico', rotulo: 'Histórico', icone: 'calendario' },
  { id: 'relatorios', rotulo: 'Relatórios', icone: 'grafico' },
  { id: 'pets', rotulo: 'Pets', icone: 'pata' },
];

export default function App() {
  const [tema, setTema] = useTema();
  const clima = useClima();
  const [aba, setAba] = useState('hoje');
  const [pets, setPets] = useState([]);
  const [registros, setRegistros] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [aviso, setAviso] = useState(null);
  const [online, setOnline] = useState(navigator.onLine);
  // folha aberta: { tipo: 'registro', editando? } ou { tipo: 'pet', pet? }
  const [folha, setFolha] = useState(null);

  const avisar = useCallback((texto, erro = false) => setAviso({ texto, erro, id: Date.now() }), []);
  const fecharAviso = useCallback(() => setAviso(null), []);

  const carregar = useCallback(async () => {
    try {
      // Os últimos 120 dias bastam para o calendário, os relatórios e o estoque
      const desde = chaveDia(somarDias(new Date(), -120));
      const [p, r] = await Promise.all([api.pets(), api.registros(desde)]);
      setPets(p);
      setRegistros(r);
    } catch (e) {
      avisar(e.message, true);
    } finally {
      setCarregando(false);
    }
  }, [avisar]);

  useEffect(() => {
    carregar();
  }, [carregar]);

  useEffect(() => {
    const on = () => setOnline(true);
    const off = () => setOnline(false);
    window.addEventListener('online', on);
    window.addEventListener('offline', off);
    return () => {
      window.removeEventListener('online', on);
      window.removeEventListener('offline', off);
    };
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [aba]);

  async function salvarRegistro(dados) {
    try {
      const editando = folha?.editando;
      if (editando) await api.atualizarRegistro(editando._id, dados);
      else await api.criarRegistro(dados);
      avisar(editando ? 'Refeição atualizada.' : `Anotado: ${dados.quantidade} ${dados.tipoAlimento === 'Água' ? 'ml' : 'g'} para ${dados.nomePet}.`);
      await carregar();
      return true;
    } catch (e) {
      avisar(e.message, true);
      return false;
    }
  }

  async function excluirRegistro(r) {
    if (!window.confirm('Excluir esta refeição?')) return;
    try {
      await api.excluirRegistro(r._id);
      setFolha(null);
      avisar('Refeição excluída.');
      await carregar();
    } catch (e) {
      avisar(e.message, true);
    }
  }

  async function salvarPet(dados) {
    try {
      const pet = folha?.pet;
      if (pet) await api.atualizarPet(pet._id, dados);
      else await api.criarPet(dados);
      avisar(pet ? `${dados.nome} atualizado.` : `${dados.nome} cadastrado.`);
      await carregar();
      return true;
    } catch (e) {
      avisar(e.message, true);
      return false;
    }
  }

  async function excluirPet(pet) {
    if (!window.confirm(`Excluir ${pet.nome}? O histórico de refeições continua guardado.`)) return;
    try {
      await api.excluirPet(pet._id);
      setFolha(null);
      avisar(`${pet.nome} excluído.`);
      await carregar();
    } catch (e) {
      avisar(e.message, true);
    }
  }

  const registrar = () => (pets.length ? setFolha({ tipo: 'registro' }) : setFolha({ tipo: 'pet' }));
  const comum = { pets, registros };

  return (
    <>
      <main className="app">
        {!online ? <div className="offline">Sem internet · mostrando os últimos dados salvos</div> : null}
        {carregando ? (
          <p className="vazio">Carregando…</p>
        ) : aba === 'hoje' ? (
          <Hoje
            {...comum}
            clima={clima}
            onRegistrar={registrar}
            onEditar={(r) => setFolha({ tipo: 'registro', editando: r })}
            onNovoPet={() => setFolha({ tipo: 'pet' })}
            irPara={setAba}
          />
        ) : aba === 'historico' ? (
          <Historico {...comum} onEditar={(r) => setFolha({ tipo: 'registro', editando: r })} />
        ) : aba === 'relatorios' ? (
          <Relatorios {...comum} />
        ) : aba === 'pets' ? (
          <Pets {...comum} onEditarPet={(p) => setFolha({ tipo: 'pet', pet: p })} onNovoPet={() => setFolha({ tipo: 'pet' })} />
        ) : (
          <Ajustes tema={tema} setTema={setTema} clima={clima} online={online} />
        )}
      </main>

      <nav className="tabbar" aria-label="Seções">
        {ABAS.slice(0, 2).map((a) => (
          <Aba key={a.id} aba={a} atual={aba} onClick={setAba} />
        ))}
        <button type="button" className="fab" aria-label="Registrar refeição" onClick={registrar}>
          <Icon name="mais" size={28} />
        </button>
        {ABAS.slice(2).map((a) => (
          <Aba key={a.id} aba={a} atual={aba} onClick={setAba} />
        ))}
      </nav>

      {folha?.tipo === 'registro' ? (
        <Registrar
          {...comum}
          editando={folha.editando}
          onSalvar={salvarRegistro}
          onExcluir={excluirRegistro}
          onClose={() => setFolha(null)}
        />
      ) : null}
      {folha?.tipo === 'pet' ? <PetForm pet={folha.pet} onSalvar={salvarPet} onExcluir={excluirPet} onClose={() => setFolha(null)} /> : null}

      <Toast key={aviso?.id} aviso={aviso} onClose={fecharAviso} />
    </>
  );
}

function Aba({ aba, atual, onClick }) {
  return (
    <button type="button" className="tab" aria-current={atual === aba.id ? 'page' : undefined} onClick={() => onClick(aba.id)}>
      <Icon name={aba.icone} />
      {aba.rotulo}
    </button>
  );
}
