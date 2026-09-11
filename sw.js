// Make Progress — Service Worker PWA
// Shell mínimo para manter a instalação móvel confiável.

const CACHE = 'makeprogress-shell-v2';
const SHELL = [
  './',
  './index.html',
  './install.html',
  './icon-192.jpg',
  './icon-512.jpg',
  './manifest.json'
];

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE)
      .then(function(cache) { return cache.addAll(SHELL).catch(function() {}); })
      .then(function() { return self.skipWaiting(); })
  );
});

self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(
        keys.filter(function(key) { return key !== CACHE; })
             .map(function(key) { return caches.delete(key); })
      );
    }).then(function() { return self.clients.claim(); })
  );
});

self.addEventListener('fetch', function(event) {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then(function(cached) {
      if (cached) return cached;
      return fetch(event.request).then(function(response) {
        return response;
      }).catch(function() {
        return caches.match('./index.html');
      });
    })
  );
});
