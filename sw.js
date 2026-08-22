const CACHE_NAME = 'bday-site-v3';
const urlsToCache = [
  './',
  './index.html',
  './css/style.css',
  './lang.js',
  './jscp/settings.js',
  './jscp/timeline.js',
  './jscp/3d_cake.js',
  './jscp/minigame.js',
  './jscp/ui.js',
  './image/logo.png',
  './music/zahra.mp3'
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
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
});
