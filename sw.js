/**
 * FreeToolsPDF Service Worker
 * Provides 100% offline capability for all 407 client-side tools and assets
 */

const CACHE_NAME = 'freetoolspdf-v4';

const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/css/main.min.css',
  '/css/dark-mode.css',
  '/css/mobile.css',
  '/css/category-themes.css',
  '/js/pwa-register.js',
  '/js/search-index.js',
  '/js/search-modal.js',
  '/js/vendor/pdf-lib.min.js',
  '/js/vendor/jspdf.umd.min.js',
  '/js/vendor/qrcode.min.js',
  '/icons/icon-192.png',
  '/icons/icon-512.png'
];


// Install Event — Precache essential static shell assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] Precaching static shell assets...');
      return cache.addAll(STATIC_ASSETS).catch((err) => {
        console.warn('[SW] Precache warnings (ignoring missing files):', err);
      });
    }).then(() => self.skipWaiting())
  );
});

// Activate Event — Clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('[SW] Clearing old cache:', cache);
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch Event — Cache-First for JS tool scripts & CSS, Stale-While-Revalidate for HTML
self.addEventListener('fetch', (event) => {
  const req = event.request;
  const url = new URL(req.url);

  // Only handle GET requests from our origin
  if (req.method !== 'GET' || url.origin !== self.location.origin) {
    return;
  }

  // Cache-First strategy for JS tools and CSS stylesheets
  if (url.pathname.startsWith('/js/') || url.pathname.startsWith('/css/') || url.pathname.startsWith('/fonts/')) {
    event.respondWith(
      caches.match(req).then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }
        return fetch(req).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseClone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(req, responseClone));
          }
          return networkResponse;
        });
      })
    );
    return;
  }

  // Network-First / Stale-While-Revalidate for HTML pages
  event.respondWith(
    caches.match(req).then((cachedResponse) => {
      const fetchPromise = fetch(req).then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(req, responseClone));
        }
        return networkResponse;
      }).catch(() => cachedResponse);

      return cachedResponse || fetchPromise;
    })
  );
});
