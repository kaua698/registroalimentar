// Chamadas ao back-end. Em produção o Express serve o front e a API no mesmo endereço.
const BASE = '/api';

async function pedir(caminho, opcoes = {}) {
  let res;
  try {
    res = await fetch(BASE + caminho, {
      headers: { 'Content-Type': 'application/json' },
      ...opcoes,
      body: opcoes.body ? JSON.stringify(opcoes.body) : undefined,
    });
  } catch {
    throw new Error('Sem conexão. Nada foi salvo; tente de novo quando a internet voltar.');
  }
  const dados = await res.json().catch(() => null);
  if (!res.ok) throw new Error(dados?.error || dados?.message || 'O servidor não respondeu como esperado.');
  return dados;
}

export const api = {
  registros: (desde) => pedir(`/registros${desde ? `?desde=${desde}` : ''}`),
  criarRegistro: (r) => pedir('/registros', { method: 'POST', body: r }),
  atualizarRegistro: (id, r) => pedir(`/registros/${id}`, { method: 'PUT', body: r }),
  excluirRegistro: (id) => pedir(`/registros/${id}`, { method: 'DELETE' }),
  pets: () => pedir('/pets'),
  criarPet: (p) => pedir('/pets', { method: 'POST', body: p }),
  atualizarPet: (id, p) => pedir(`/pets/${id}`, { method: 'PUT', body: p }),
  excluirPet: (id) => pedir(`/pets/${id}`, { method: 'DELETE' }),
};
