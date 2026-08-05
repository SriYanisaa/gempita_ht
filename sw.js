const CACHE_NAME = 'pesona-ht-cache-v3.2.0';
const urlsToCache = [
  '/gempita_ht/',
  '/gempita_ht/index.html',
  '/gempita_ht/manifest.json'
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
