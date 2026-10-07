export const inicioDoDia = (d = new Date()) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
export const mesmoDia = (a, b) =>
  a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
export const somarDias = (d, n) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);

const pad = (n) => String(n).padStart(2, '0');
export const hhmm = (d) => `${pad(d.getHours())}:${pad(d.getMinutes())}`;
export const chaveDia = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

// Valor para <input type="datetime-local"> no fuso do aparelho
export const paraInputLocal = (d) => `${chaveDia(d)}T${hhmm(d)}`;

export const dataLonga = (d) =>
  d.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' }).replace(/^./, (c) => c.toUpperCase());
export const diaCurto = (d) => d.toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' }).replace('.', '');
export const nomeMes = (d) =>
  d.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' }).replace(/^./, (c) => c.toUpperCase());
export const letraSemana = (d) => d.toLocaleDateString('pt-BR', { weekday: 'narrow' }).toUpperCase();

export function saudacao(d = new Date()) {
  const h = d.getHours();
  if (h < 12) return 'Bom dia';
  if (h < 18) return 'Boa tarde';
  return 'Boa noite';
}

// "em 2h15", "em 40 min"
export function faltaPara(minutos) {
  if (minutos < 60) return `em ${minutos} min`;
  const h = Math.floor(minutos / 60);
  const m = minutos % 60;
  return m ? `em ${h}h${pad(m)}` : `em ${h}h`;
}
