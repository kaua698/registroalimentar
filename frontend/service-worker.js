const CACHE_STATIC = 'pet-alimentacao-static-v1';
const CACHE_DYNAMIC = 'pet-alimentacao-dynamic-v1';

const APP_FILES = [
  './',
  './index.html',
  './style.css',
  './app.js',
  './manifest.json',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './libs/react.production.min.js',
  './libs/react-dom.production.min.js',
  './libs/babel.min.js'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_STATIC).then((cache) => cache.addAll(APP_FILES))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys
          .filter((key) => key !== CACHE_STATIC && key !== CACHE_DYNAMIC)
          .map((key) => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Cache API calls: Network First, fallback to cache
  if (url.pathname.startsWith('/api/registros')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          return caches.open(CACHE_DYNAMIC).then((cache) => {
            cache.put(request, response.clone());
            return response;
          });
        })
        .catch(() => {
          return caches.match(request).then((cached) => {
            if (cached) return cached;
            // Return empty JSON array if nothing cached
            return new Response(JSON.stringify([]), {
              headers: { 'Content-Type': 'application/json' }
            });
          });
        })
    );
    return;
  }

  // Cache static assets: Cache First, fallback to network
  event.respondWith(
    caches.match(request).then((cached) => {
      return (
        cached ||
        fetch(request).then((response) => {
          if (request.method === 'GET' && url.origin === self.location.origin) {
            return caches.open(CACHE_DYNAMIC).then((cache) => {
              cache.put(request, response.clone());
              return response;
            });
          }
          return response;
        })
      );
    })
  );
});

