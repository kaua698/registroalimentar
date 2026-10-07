import { useCallback, useEffect, useState } from 'react';

// Temperatura máxima de hoje pelo Open-Meteo (gratuito, sem chave).
// A localização só é pedida quando a pessoa ativa o clima.
const CHAVE = 'diariopet:local';

function lerLocal() {
  try {
    return JSON.parse(localStorage.getItem(CHAVE) || 'null');
  } catch {
    return null;
  }
}

export function useClima() {
  const [local, setLocal] = useState(lerLocal);
  const [clima, setClima] = useState(null);
  const [erro, setErro] = useState('');

  useEffect(() => {
    if (!local) return;
    const ctrl = new AbortController();
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${local.lat}&longitude=${local.lon}&current=temperature_2m&daily=temperature_2m_max&timezone=auto&forecast_days=1`;
    fetch(url, { signal: ctrl.signal })
      .then((r) => r.json())
      .then((d) => setClima({ agora: d.current?.temperature_2m, maxima: d.daily?.temperature_2m_max?.[0] }))
      .catch(() => {});
    return () => ctrl.abort();
  }, [local]);

  const ativar = useCallback(() => {
    if (!navigator.geolocation) return setErro('Este navegador não informa a localização.');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const novo = { lat: pos.coords.latitude.toFixed(2), lon: pos.coords.longitude.toFixed(2) };
        try {
          localStorage.setItem(CHAVE, JSON.stringify(novo));
        } catch {
          /* segue sem salvar */
        }
        setErro('');
        setLocal(novo);
      },
      () => setErro('Localização negada. Dá para ativar depois nos Ajustes.'),
      { timeout: 10000, maximumAge: 3600000 },
    );
  }, []);

  const desativar = useCallback(() => {
    try {
      localStorage.removeItem(CHAVE);
    } catch {
      /* nada */
    }
    setLocal(null);
    setClima(null);
  }, []);

  return { ativo: Boolean(local), clima: local ? clima : null, erro, ativar, desativar };
}
