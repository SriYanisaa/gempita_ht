const CACHE_NAME = 'pesona-geo-v4.7.0'; // Versi sudah dinaikkan untuk mereset cache
const urlsToCache = [
  '/gempita_ht/',
  '/gempita_ht/index.html',
  '/gempita_ht/manifest.json'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', event => {
  // Abaikan caching untuk link Apps Script dan Leaflet (peta) agar tidak error
  if (event.request.url.includes('script.google.com') || event.request.url.includes('unpkg.com') || event.request.url.includes('openstreetmap.org')) {
    return;
  }
  
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        return response || fetch(event.request);
      })
  );
});

self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
