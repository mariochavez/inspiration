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
const OFFLINE_PAGE = `/offline.html?v=${CACHE_VERSION}`;

// resources to precache
const PRECACHE_RESOURCES = [
  '/',
  '/about',
  '/offline.html',
  '/icon.svg',
  '/android-chrome-192x192.png',
  '/android-chrome-512x512.png',
  '/safari-pinned-tab.svg',
  '/favicon-16x16.png',
  '/favicon-32x32.png'
];

// Regular expressions for dynamic asset filenames
const ASSET_REGEX = {
  CSS: /\/assets\/.*\.css$/,
  JS: /\/assets\/.*\.js$/,
  FONT: /\/assets\/.*\.(woff|woff2|eot|ttf|otf)$/,
  IMAGE: /\/assets\/.*\.(png|jpg|jpeg|gif|svg)$/
};

const PRECACHE_RESOURCES_WITH_VERSIONS = PRECACHE_RESOURCES.map(
  path => {
    return `${path}?v=${CACHE_VERSION}`;
  });

const matchAssetRegex = (url) => {
  for (const [key, regex] of Object.entries(ASSET_REGEX)) {
    if (regex.test(url)) return key;
  }
  return null;
}

// install event and cache resources
self.addEventListener('install', (event) => {
  self.skipWaiting();

  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    cache.addAll(PRECACHE_RESOURCES_WITH_VERSIONS);
  })());
});

// activate event and delete old caches
self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const cacheNames = await caches.keys();
    await Promise.all(cacheNames.map(cacheName => {
      if (cacheName.startsWith('heroimage-') && cacheName !== CACHE_NAME) {
        return caches.delete(cacheName);
      }
    }));
    self.clients.claim();
  })());
});

self.addEventListener('fetch', (event) => {
  // skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }

  // handle turbo drive requests
  if (event.request.headers.get('accept').includes('text/html-partial')) {
    event.respondWith(
      fetch(event.request)
        .catch(() => caches.match(OFFLINE_PAGE))
    );
    return;
  }

  // network-first strategy for html requests, including the about page
  if (event.request.mode === 'navigate' ||
    (event.request.method === 'get' && event.request.headers.get('accept').includes('text/html'))) {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          // Ensure a valid response is returned
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return caches.match(OFFLINE_PAGE);
          }

          // cache the about page after network request
          if (event.request.url.endsWith('/about')) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then(cache => {
              cache.put(event.request, responseClone);
            });
          }
          return response;
        })
        .catch(() => {
          // Ensure a valid response is returned from the cache or fallback to offline page
          return caches.match(event.request).then(cachedResponse => {
            return cachedResponse || caches.match(OFFLINE_PAGE);
          });
        })
    );
    return;
  } else {
    // cache-first strategy for assets, falling back to network
    const assetType = matchAssetRegex(event.request.url);
    if (assetType) {
      event.respondWith(
        caches.open(CACHE_NAME).then((cache) =>
          cache.match(event.request).then((response) => {
            if (response) {
              return response;
            }
            return fetch(event.request).then((networkResponse) => {
              // Ensure a valid response is returned
              if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
                return caches.match(OFFLINE_PAGE);
              }
              cache.put(event.request, networkResponse.clone());
              return networkResponse;
            }).catch(() => caches.match(OFFLINE_PAGE)); // In case of network failure, return offline page
          })
        )
      );
    } else {
      // for non-asset requests, use network-first strategy
      event.respondWith(
        fetch(event.request)
          .catch(() => caches.match(event.request).then(cachedResponse => {
            return cachedResponse || caches.match(OFFLINE_PAGE); // Fallback to offline page
          }))
      );
    }
  }
});

// sync event
// self.addEventListener('sync', (event) => {
//   if (event.tag === 'mybackgroundsync') {
//     event.waituntil(
//       // perform background sync operations here
//       console.log('background sync executed')
//     );
//   }
// });
