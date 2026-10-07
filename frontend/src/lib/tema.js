import { useEffect, useState } from 'react';

const CHAVE = 'diariopet:tema';

export function useTema() {
  const [tema, setTema] = useState(() => document.documentElement.dataset.theme || 'escuro');
  useEffect(() => {
    document.documentElement.dataset.theme = tema;
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', tema === 'claro' ? '#F5F1EA' : '#0F1012');
    try {
      localStorage.setItem(CHAVE, tema);
    } catch {
      // navegação privada: o tema só não fica salvo
    }
  }, [tema]);
  return [tema, setTema];
}
