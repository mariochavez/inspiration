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
const cache_version = 'v1.1';
const cache_name = `heroimage-${cache_version}`;
const offline_page = '/offline.html';

// resources to precache
const precache_resources = [
  '/',
  '/about',
  '/offline.html',
  '/icon.svg',
  '/apple-touch-icon.png',
  '/favicon-32x32.png',
  '/favicon-16x16.png',
  '/safari-pinned-tab.svg'
];

// regular expressions for dynamic asset filenames
const asset_regex = {
  css: /\/assets\/.*\.css$/,
  js: /\/assets\/.*\.js$/,
  font: /\/assets\/.*\.(woff|woff2|eot|ttf|otf)$/,
  image: /\/assets\/.*\.(png|jpg|jpeg|gif|svg)$/
};

// helper function to match request url against regex patterns
const matchassetregex = (url) => {
  for (const [key, regex] of object.entries(asset_regex)) {
    if (regex.test(url)) return key;
  }
  return null;
};

// install event
self.addeventlistener('install', (event) => {
  event.waituntil(
    caches.open(cache_name)
      .then((cache) => cache.addall(precache_resources))
      .then(() => self.skipwaiting())
  );
});

// activate event
self.addeventlistener('activate', (event) => {
  event.waituntil(
    caches.keys().then((cachenames) => {
      return promise.all(
        cachenames.map((cachename) => {
          if (cachename.startswith('heroimage-') && cachename !== cache_name) {
            return caches.delete(cachename);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// fetch event
self.addeventlistener('fetch', (event) => {
  // skip cross-origin requests
  if (!event.request.url.startswith(self.location.origin)) {
    return;
  }

  // handle turbo drive requests
  if (event.request.headers.get('accept').includes('text/html-partial')) {
    event.respondwith(
      fetch(event.request)
        .catch(() => caches.match(offline_page))
    );
    return;
  }

  // network-first strategy for html requests, including the about page
  if (event.request.mode === 'navigate' ||
    (event.request.method === 'get' && event.request.headers.get('accept').includes('text/html'))) {
    event.respondwith(
      fetch(event.request)
        .then(response => {
          // cache the about page after network request
          if (event.request.url.endswith('/about')) {
            const responseclone = response.clone();
            caches.open(cache_name).then(cache => {
              cache.put(event.request, responseclone);
            });
          }
          return response;
        })
        .catch(() => {
          return caches.match(event.request)
            .then(cachedresponse => {
              return cachedresponse || caches.match(offline_page);
            });
        })
    );
  } else {
    // cache-first strategy for assets, falling back to network
    const assettype = matchassetregex(event.request.url);
    if (assettype) {
      event.respondwith(
        caches.open(cache_name).then((cache) =>
          cache.match(event.request).then((response) => {
            if (response) {
              return response;
            }
            return fetch(event.request).then((networkresponse) => {
              cache.put(event.request, networkresponse.clone());
              return networkresponse;
            });
          })
        )
      );
    } else {
      // for non-asset requests, use network-first strategy
      event.respondwith(
        fetch(event.request)
          .catch(() => caches.match(event.request))
      );
    }
  }
});

// sync event
self.addeventlistener('sync', (event) => {
  if (event.tag === 'mybackgroundsync') {
    event.waituntil(
      // perform background sync operations here
      console.log('background sync executed')
    );
  }
});
