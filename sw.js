const CACHE_NAME = 'smartmobi-v20-final';
const ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png',
  '/apple-touch-icon.png',
  '/screenshot-home.png',
  '/screenshot-wide.png'
];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    caches.match(event.request).then(cached => cached || fetch(event.request).then(response => {
      const copy = response.clone();
      caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy));
      return response;
    }).catch(() => caches.match('/index.html')))
  );
});

self.addEventListener('sync', event => {
  if (event.tag === 'smartmobi-v20-header-menu-fix') event.waitUntil(Promise.resolve());
});

self.addEventListener('push', event => {
  const data = event.data ? event.data.text() : 'SmartMobi';
  event.waitUntil(self.registration.showNotification('SmartMobi', {
    body: data,
    icon: '/icon-192.png',
    badge: '/icon-192.png'
  }));
});
