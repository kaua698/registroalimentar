// Ícones de traço, desenhados à mão (sem biblioteca)
const PATHS = {
  casa: 'M4 11l8-7 8 7v9h-5v-6h-6v6H4z',
  calendario: 'M4 6h16v14H4zM4 10h16M8 3v4M16 3v4',
  grafico: 'M5 20V11M12 20V5M19 20v-6',
  pata: 'M12 14c3 0 5 2 5 4a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2c0-2 2-4 5-4zM6 11a2 2 0 1 0 0-.01M10 7a2 2 0 1 0 0-.01M14 7a2 2 0 1 0 0-.01M18 11a2 2 0 1 0 0-.01',
  mais: 'M12 5v14M5 12h14',
  ajustes: 'M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6zM12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M5 19l2-2M17 7l2-2',
  tigela: 'M3 11h18a9 9 0 0 1-18 0z',
  lata: 'M5 7h14v13H5zM5 11h14',
  osso: 'M7 7a3 3 0 1 1 3 3l4 4a3 3 0 1 1 3 3',
  gota: 'M12 3s6 7 6 11a6 6 0 0 1-12 0c0-4 6-11 6-11z',
  relogio: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM12 7v5l3 2',
  check: 'M5 12l4 4 10-10',
  lua: 'M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z',
  sol: 'M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8zM12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5L19 19M5 19l1.5-1.5M17.5 6.5L19 5',
  lixo: 'M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13',
  seta: 'M9 6l6 6-6 6',
  voltar: 'M15 6l-6 6 6 6',
  baixar: 'M12 4v11M7 10l5 5 5-5M5 20h14',
  nuvem: 'M7 18a4 4 0 0 1-.5-8A6 6 0 0 1 18 9a4.5 4.5 0 0 1-.5 9z',
};

export function Icon({ name, size = 22, style }) {
  return (
    <svg className="ico" viewBox="0 0 24 24" width={size} height={size} style={style} aria-hidden="true">
      <path d={PATHS[name]} />
    </svg>
  );
}

export const ICONE_TIPO = { Ração: 'tigela', Humida: 'lata', Petisco: 'osso', Água: 'gota' };
