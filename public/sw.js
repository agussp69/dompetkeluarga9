const CACHE_NAME = 'dompet-keluarga-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/manifest.json',
  '/logo.png',
  '/pwa-192x192.png',
  '/pwa-512x512.png',
  '/pwa-512x512-maskable.png'
];

// Install Event
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[Service Worker] Caching App Shell');
      return cache.addAll(ASSETS_TO_CACHE);
    }).then(() => self.skipWaiting())
  );
});

// Activate Event (Cleanup Old Caches)
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('[Service Worker] Clearing Old Cache', cache);
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch Event
self.addEventListener('fetch', (event) => {
  // Only handle GET requests
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  // Skip Supabase database and auth calls so they go straight to the network
  if (url.hostname.includes('supabase.co')) {
    return;
  }

  // Handle caching strategies
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        // If it's a local static asset, trigger a background fetch to update the cache
        if (url.origin === self.location.origin) {
          fetch(event.request)
            .then((networkResponse) => {
              if (networkResponse.status === 200) {
                caches.open(CACHE_NAME).then((cache) => {
                  cache.put(event.request, networkResponse);
                });
              }
            })
            .catch(() => { /* Ignore background network error */ });
        }
        return cachedResponse;
      }

      // If not in cache, fetch from network
      return fetch(event.request)
        .then((networkResponse) => {
          // Cache new successful GET requests from the same origin (excluding API calls)
          if (
            networkResponse &&
            networkResponse.status === 200 &&
            url.origin === self.location.origin &&
            !url.pathname.startsWith('/api')
          ) {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseToCache);
            });
          }
          return networkResponse;
        })
        .catch(() => {
          // If network fails and it's a page navigation request, return index shell (landing page)
          if (event.request.mode === 'navigate') {
            return caches.match('/');
          }
        });
    })
  );
});
