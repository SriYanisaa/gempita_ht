const CACHE_NAME = 'pesona-ht-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json'
];

// Menginstall cache saat aplikasi pertama kali dibuka
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
});

// Menyediakan cache saat tidak ada internet
self.addEventListener('fetch', event => {
  // Biarkan request POST (pengiriman data) berjalan normal, tidak dicache
  if (event.request.method === 'POST') return;
  
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response; // Mengembalikan file dari memori HP
        }
        return fetch(event.request);
      })
  );
});
