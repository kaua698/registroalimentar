import '@fontsource-variable/bricolage-grotesque';
import '@fontsource-variable/dm-sans';
import './styles.css';

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { registerSW } from 'virtual:pwa-register';

import App from './App';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

// Atualiza o service worker sozinho quando sair uma versão nova
registerSW({ immediate: true });
