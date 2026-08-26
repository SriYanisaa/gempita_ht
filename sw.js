const CACHE_NAME = 'pandu-v21.1';
const MAP_CACHE_NAME = 'pandu-map-tiles-v1';

// File utama yang harus selalu ada di HP
const urlsToCache = [
  '/gempita_ht/index.html',
  '/gempita_ht/logo_transparent.png',
  '/gempita_ht/manifest_pandu.json'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener('fetch', event => {
  const requestUrl = new URL(event.request.url);

  // 1. ATURAN KHUSUS UNTUK PETA (OPENSTREETMAP)
  if (requestUrl.hostname.includes('tile.openstreetmap.org')) {
    event.respondWith(
      caches.match(event.request).then(cachedResponse => {
        // Jika peta sudah pernah dilihat dan tersimpan, gunakan yang offline!
        if (cachedResponse) {
          return cachedResponse; 
        }
        
        // Jika belum ada di memori, ambil dari internet, lalu SIMPAN untuk nanti
        return fetch(event.request).then(networkResponse => {
          return caches.open(MAP_CACHE_NAME).then(cache => {
            cache.put(event.request, networkResponse.clone());
            return networkResponse;
          });
        }).catch(() => {
          // Jika tidak ada sinyal dan peta belum pernah di-load, kembalikan gambar kosong agar tidak error crash
          return new Response('', { status: 404, statusText: 'Offline Map Not Cached' });
        });
      })
    );
  } 
  
  // 2. ATURAN UNTUK FILE LAIN (HTML, API DATABASE, DLL)
  else {
    event.respondWith(
      caches.match(event.request).then(response => {
        return response || fetch(event.request);
      })
    );
  }
});

// Menghapus cache versi lama agar HP petugas tidak kepenuhan memori
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME && cacheName !== MAP_CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
