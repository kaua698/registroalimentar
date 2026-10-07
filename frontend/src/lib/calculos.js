import { inicioDoDia, mesmoDia, somarDias } from './datas';

export const TIPOS = [
  { valor: 'Ração', rotulo: 'Ração' },
  { valor: 'Humida', rotulo: 'Úmida' },
  { valor: 'Petisco', rotulo: 'Petisco' },
  { valor: 'Água', rotulo: 'Água' },
];
export const rotuloTipo = (v) => TIPOS.find((t) => t.valor === v)?.rotulo ?? v;
export const unidade = (tipo) => (tipo === 'Água' ? 'ml' : 'g');

export const APETITES = [
  { valor: 'tudo', rotulo: 'Comeu tudo' },
  { valor: 'pouco', rotulo: 'Deixou um pouco' },
  { valor: 'recusou', rotulo: 'Recusou' },
];
export const rotuloApetite = (v) => APETITES.find((a) => a.valor === v)?.rotulo ?? 'Comeu tudo';

// Cores dos pets, na ordem em que foram cadastrados
export const CORES = ['var(--accent)', 'var(--accent2)', 'var(--accent3)', 'var(--accent4)'];
export const corDoPet = (pets, nome) => {
  const i = pets.findIndex((p) => p.nome === nome);
  return CORES[(i < 0 ? pets.length : i) % CORES.length];
};

const ehComida = (r) => r.tipoAlimento !== 'Água';

export function consumoNoDia(registros, nome, dia, { agua = false } = {}) {
  return registros
    .filter((r) => r.nomePet === nome && mesmoDia(new Date(r.horarioRefeicao), dia) && (agua ? !ehComida(r) : ehComida(r)))
    .reduce((s, r) => s + Number(r.quantidade || 0), 0);
}

// Meta sugerida: energia de repouso (70 × peso^0,75) × fator, dividida pela energia da ração.
// É uma referência; o veterinário pode ajustar.
export function metaSugerida(especie, peso, kcalPorGrama = 3.6) {
  if (!peso || peso <= 0) return null;
  const repouso = 70 * Math.pow(peso, 0.75);
  const fator = especie === 'Gato' ? 1.2 : 1.6;
  return {
    kcal: Math.round(repouso * fator),
    gramas: Math.round((repouso * fator) / kcalPorGrama / 5) * 5,
    agua: Math.round((peso * 55) / 10) * 10,
  };
}

export function estoque(pet, registros) {
  if (!pet.estoqueGramas) return null;
  const desde = pet.estoqueDesde ? new Date(pet.estoqueDesde) : new Date(0);
  const usado = registros
    .filter((r) => r.nomePet === pet.nome && r.tipoAlimento === 'Ração' && new Date(r.horarioRefeicao) >= desde)
    .reduce((s, r) => s + Number(r.quantidade || 0), 0);
  const restante = Math.max(0, pet.estoqueGramas - usado);
  const dias = pet.metaDiaria > 0 ? Math.floor(restante / pet.metaDiaria) : null;
  return { restante, dias, fracao: restante / pet.estoqueGramas };
}

// Próximo horário do plano que ainda não passou (hoje ou amanhã)
export function proximaRefeicao(pets, agora = new Date()) {
  const minutosAgora = agora.getHours() * 60 + agora.getMinutes();
  const itens = pets.flatMap((p) =>
    (p.horarios || [])
      .filter((h) => h.ativo !== false)
      .map((h) => {
        const [hh, mm] = h.hora.split(':').map(Number);
        const min = hh * 60 + mm;
        const falta = min > minutosAgora ? min - minutosAgora : min + 1440 - minutosAgora;
        return { pet: p, ...h, falta, amanha: min <= minutosAgora };
      }),
  );
  return itens.sort((a, b) => a.falta - b.falta)[0] ?? null;
}

// Fração da meta de comida batida no dia (média entre os pets com meta)
export function fracaoDoDia(pets, registros, dia) {
  const comMeta = pets.filter((p) => p.metaDiaria > 0);
  if (!comMeta.length) return null;
  const soma = comMeta.reduce((s, p) => s + Math.min(1.2, consumoNoDia(registros, p.nome, dia) / p.metaDiaria), 0);
  return soma / comMeta.length;
}

// Dias seguidos em que todos os pets chegaram a 90% da meta. Hoje conta se já bateu.
export function sequencia(pets, registros, hoje = new Date()) {
  const comMeta = pets.filter((p) => p.metaDiaria > 0);
  if (!comMeta.length) return 0;
  const bateu = (dia) => comMeta.every((p) => consumoNoDia(registros, p.nome, dia) >= p.metaDiaria * 0.9);
  let dia = inicioDoDia(hoje);
  if (!bateu(dia)) dia = somarDias(dia, -1);
  let n = 0;
  while (n < 366 && bateu(dia)) {
    n += 1;
    dia = somarDias(dia, -1);
  }
  return n;
}
