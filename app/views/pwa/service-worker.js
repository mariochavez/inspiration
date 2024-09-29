// Add a service worker for processing Web Push notifications:
//
// self.addEventListener("push", async (event) => {
//   const { title, options } = await event.data.json()
//   event.waitUntil(self.registration.showNotification(title, options))
// })
// 
// self.addEventListener("notificationclick", function(event) {
//   event.notification.close()
//   event.waitUntil(
//     clients.matchAll({ type: "window" }).then((clientList) => {
//       for (let i = 0; i < clientList.length; i++) {
//         let client = clientList[i]
//         let clientPath = (new URL(client.url)).pathname
// 
//         if (clientPath == event.notification.data.path && "focus" in client) {
//           return client.focus()
//         }
//       }
// 
//       if (clients.openWindow) {
//         return clients.openWindow(event.notification.data.path)
//       }
//     })
//   )
// })
const CACHE_VERSION = 'v1';
const CACHE_NAME = `heroimage-${CACHE_VERSION}`;
const OFFLINE_PAGE = '/offline.html';

// Resources to precache
const PRECACHE_RESOURCES = [
  '/',
  '/about',
  '/offline.html',
  '/icon.svg',
  '/apple-touch-icon.png',
  '/favicon-32x32.png',
  '/favicon-16x16.png',
  '/safari-pinned-tab.svg'
];

// Regular expressions for dynamic asset filenames
const ASSET_REGEX = {
  CSS: /\/assets\/.*\.css$/,
  JS: /\/assets\/.*\.js$/,
  FONT: /\/assets\/.*\.(woff|woff2|eot|ttf|otf)$/,
  IMAGE: /\/assets\/.*\.(png|jpg|jpeg|gif|svg)$/
};

// Helper function to match request URL against regex patterns
const matchAssetRegex = (url) => {
  for (const [key, regex] of Object.entries(ASSET_REGEX)) {
    if (regex.test(url)) return key;
  }
  return null;
};

// Install event
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(PRECACHE_RESOURCES))
      .then(() => self.skipWaiting())
  );
});

// Activate event
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName.startsWith('heroimage-') && cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event
self.addEventListener('fetch', (event) => {
  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }

  // Handle Turbo Drive requests
  if (event.request.headers.get('Accept').includes('text/html-partial')) {
    event.respondWith(
      fetch(event.request)
        .catch(() => caches.match(OFFLINE_PAGE))
    );
    return;
  }

  // Network-first strategy for HTML requests, including the about page
  if (event.request.mode === 'navigate' ||
    (event.request.method === 'GET' && event.request.headers.get('accept').includes('text/html'))) {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          // Cache the about page after network request
          if (event.request.url.endsWith('/about')) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then(cache => {
              cache.put(event.request, responseClone);
            });
          }
          return response;
        })
        .catch(() => {
          return caches.match(event.request)
            .then(cachedResponse => {
              return cachedResponse || caches.match(OFFLINE_PAGE);
            });
        })
    );
  } else {
    // Cache-first strategy for assets, falling back to network
    const assetType = matchAssetRegex(event.request.url);
    if (assetType) {
      event.respondWith(
        caches.open(CACHE_NAME).then((cache) =>
          cache.match(event.request).then((response) => {
            if (response) {
              return response;
            }
            return fetch(event.request).then((networkResponse) => {
              cache.put(event.request, networkResponse.clone());
              return networkResponse;
            });
          })
        )
      );
    } else {
      // For non-asset requests, use network-first strategy
      event.respondWith(
        fetch(event.request)
          .catch(() => caches.match(event.request))
      );
    }
  }
});

// Sync event
self.addEventListener('sync', (event) => {
  if (event.tag === 'myBackgroundSync') {
    event.waitUntil(
      // Perform background sync operations here
      console.log('Background sync executed')
    );
  }
});
