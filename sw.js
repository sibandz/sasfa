const CACHE_NAME = 'tournament-app-v1';
const urlsToCache = [
  '/',
  '/manifest.json'
  // Add other static assets like '/style.css', '/script.js' here if you have them
];

// Install the service worker and cache static assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

// Intercept network requests
self.addEventListener('fetch', event => {
  // For API requests, try the network first. If it fails (offline), return what's in the cache if available.
  if (event.request.url.includes('/api/')) {
    event.respondWith(
      fetch(event.request).catch(() => caches.match(event.request))
    );
    return;
  }

  // For static assets (HTML, CSS, JS, Images), try the cache first, then the network.
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        return fetch(event.request).then(networkResponse => {
          // Optionally cache new requests dynamically here
          return networkResponse;
        });
      })
  );
});