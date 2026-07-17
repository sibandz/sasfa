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
  // For API requests...
  if (event.request.url.includes('/api/')) {
    // ...that are NOT GET requests (e.g., POST to save data),
    // just try the network and do not fallback to cache.
    // This ensures that save errors are not hidden from the app.
    if (event.request.method !== 'GET') {
      event.respondWith(fetch(event.request));
      return;
    }

    // For GET requests, try the network first, then fallback to cache.
    event.respondWith(
      fetch(event.request).catch(() => caches.match(event.request))
    );
    return;
  }

  // For static assets (HTML, CSS, etc.), try the cache first, then the network.
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        return response || fetch(event.request);
      })
  );
});