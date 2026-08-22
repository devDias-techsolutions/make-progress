// Service Worker mínimo — Âncoras PWA
// Apenas garante que o Chrome considere o site instalável como app nativo
// O conteúdo real roda no GAS, não precisa de cache offline aqui

var CACHE = 'makeprogress-shell-v1';
var SHELL = ['/', '/index.html', '/icon-192.png', '/icon-512.png', '/manifest.json'];

self.addEventListener('install', function(e) {
  e.waitUntil(
    caches.open(CACHE).then(function(cache) {
      // Tenta cachear o shell — ignora erros silenciosamente
      return cache.addAll(SHELL).catch(function() {});
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', function(e) {
  e.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(
        keys.filter(function(k) { return k !== CACHE; })
            .map(function(k) { return caches.delete(k); })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', function(e) {
  // Serve do cache se disponível, senão vai à rede
  e.respondWith(
    caches.match(e.request).then(function(cached) {
      return cached || fetch(e.request).catch(function() { return cached; });
    })
  );
});
