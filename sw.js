self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open('time-tracker-cache-v2').then(function(cache) {
      return cache.addAll([
        './',
        'index.html',
        'styles.css',
        'script.js',
        'manifest.json',
        'icon-192.png'
      ]);
    })
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request).then(function(response) {
      return response || fetch(event.request);
    })
  );
});

self.addEventListener('activate', function(event) {
  const cacheWhitelist = ['time-tracker-cache-v2'];
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (!cacheWhitelist.includes(cacheName)) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});