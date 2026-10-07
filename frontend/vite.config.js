import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icons/icon-192.png', 'icons/icon-512.png'],
      manifest: {
        name: 'Diário de Alimentação Pet',
        short_name: 'Diário Pet',
        description: 'Registre as refeições dos seus pets e acompanhe a meta de cada um.',
        lang: 'pt-BR',
        start_url: '/',
        display: 'standalone',
        background_color: '#0F1012',
        theme_color: '#0F1012',
        icons: [
          { src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,png,svg,woff2}'],
        navigateFallbackDenylist: [/^\/api/],
        runtimeCaching: [
          {
            // Leituras da API: tenta a rede e, sem internet, usa a última resposta.
            // Gravações (POST, PUT, DELETE) não passam por aqui e falham de verdade quando offline.
            urlPattern: ({ url, request }) => url.pathname.startsWith('/api/') && request.method === 'GET',
            handler: 'NetworkFirst',
            options: { cacheName: 'api', networkTimeoutSeconds: 6, expiration: { maxEntries: 20 } },
          },
          {
            urlPattern: ({ url }) => url.hostname === 'api.open-meteo.com',
            handler: 'NetworkFirst',
            options: { cacheName: 'clima', networkTimeoutSeconds: 6, expiration: { maxEntries: 4 } },
          },
        ],
      },
    }),
  ],
  // Em desenvolvimento o Vite repassa /api para o back-end na porta 3000
  server: { port: 5173, proxy: { '/api': 'http://localhost:3000' } },
});
