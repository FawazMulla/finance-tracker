self.addEventListener("install", e =>
  e.waitUntil(
    caches.open("finance-pwa-v1").then(c =>
      c.addAll([
        "/",
        "/index.html",
        "/history.html",
        "/stats.html",
        "/debug.html",
        "/style.css",
        "/app.js",
        "/db.js",
        "/summary.js",
        "/manifest.json"
      ])
    )
  )
);

self.addEventListener("fetch", e => {
  // Only cache GET requests
  if (e.request.method !== 'GET') return;
  
  e.respondWith(
    caches.match(e.request).then(response => {
      // Return cached version or fetch from network
      return response || fetch(e.request);
    })
  );
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== "finance-pwa-v1") {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
