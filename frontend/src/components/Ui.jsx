import { useEffect } from 'react';

export function Avatar({ nome, cor, small }) {
  return (
    <span className={`av${small ? ' sm' : ''}`} style={{ background: cor }} aria-hidden="true">
      {nome?.[0]?.toUpperCase() ?? '?'}
    </span>
  );
}

export function Toggle({ checked, onChange, label }) {
  return (
    <button type="button" className="toggle" role="switch" aria-checked={checked} aria-label={label} onClick={() => onChange(!checked)}>
      <i />
    </button>
  );
}

export function Barra({ fracao, cor }) {
  const w = Math.max(0, Math.min(1, fracao || 0)) * 100;
  return (
    <div className="bar" role="presentation">
      <i style={{ width: `${w}%`, background: cor }} />
    </div>
  );
}

// Anéis concêntricos: um por pet (até 2), do mais externo para dentro
export function Aneis({ itens }) {
  const raios = [34, 22];
  const largura = [9, 7];
  return (
    <svg viewBox="0 0 80 80" width="92" height="92" aria-hidden="true" style={{ flex: 'none' }}>
      {itens.slice(0, 2).map((it, i) => {
        const r = raios[i];
        const c = 2 * Math.PI * r;
        const f = Math.max(0, Math.min(1, it.fracao));
        return (
          <g key={it.nome}>
            <circle cx="40" cy="40" r={r} fill="none" stroke="var(--card2)" strokeWidth={largura[i]} />
            {f > 0 ? <circle
              cx="40"
              cy="40"
              r={r}
              fill="none"
              stroke={it.cor}
              strokeWidth={largura[i]}
              strokeLinecap="round"
              strokeDasharray={`${f * c} ${c}`}
              transform="rotate(-90 40 40)"
              style={{ transition: 'stroke-dasharray .8s cubic-bezier(.2,.8,.2,1)' }}
            /> : null}
          </g>
        );
      })}
    </svg>
  );
}

// Folha que sobe de baixo; fecha com Esc ou tocando fora
export function Sheet({ titulo, onClose, children }) {
  useEffect(() => {
    const esc = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', esc);
    const antes = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', esc);
      document.body.style.overflow = antes;
    };
  }, [onClose]);
  return (
    <>
      <div className="backdrop" onClick={onClose} />
      <div className="sheet" role="dialog" aria-modal="true" aria-label={titulo}>
        <span className="grabber" />
        {children}
      </div>
    </>
  );
}

export function Toast({ aviso, onClose }) {
  useEffect(() => {
    if (!aviso) return;
    const t = setTimeout(onClose, aviso.erro ? 6000 : 3000);
    return () => clearTimeout(t);
  }, [aviso, onClose]);
  if (!aviso) return null;
  return (
    <div className={`toast${aviso.erro ? ' erro' : ''}`} role={aviso.erro ? 'alert' : 'status'}>
      <span className="grow">{aviso.texto}</span>
      <button type="button" className="link" style={{ color: 'inherit', padding: 0 }} onClick={onClose}>
        Fechar
      </button>
    </div>
  );
}
