// Made by the build (tools/installable.ts). Keeps the game playable with no connection.
const CACHE = 'lantern-lake-9b4485164929';
const FILES = ["./","apple-touch-icon.png","assets/index-Ddc9B2TH.js","assets/phaser-C831z-fk.js","icon-192.png","icon-512.png","index.html","manifest.webmanifest"];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(FILES)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((key) => key.startsWith('lantern-lake-') && key !== CACHE).map((key) => caches.delete(key))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET' || new URL(request.url).origin !== self.location.origin) return;
  event.respondWith(
    caches.open(CACHE).then(async (cache) => {
      const kept = (await cache.match(request, { ignoreSearch: true })) || (request.mode === 'navigate' ? await cache.match('./index.html') : undefined);
      return kept || fetch(request);
    }),
  );
});
