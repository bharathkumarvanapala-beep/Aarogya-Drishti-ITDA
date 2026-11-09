// Never cache clinical responses or authenticated requests.
const CACHE_NAME = 'aarogya-drishti-cache-v2';
self.addEventListener('install', event => event.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(['/', '/index.html'])).then(() => self.skipWaiting())));
self.addEventListener('activate', event => event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k.startsWith('aarogya-drishti-cache-') && k !== CACHE_NAME).map(k => caches.delete(k)))).then(() => self.clients.claim())));
self.addEventListener('fetch', event => {
 const r = event.request, u = new URL(r.url);
 if (r.method !== 'GET' || u.origin !== self.location.origin || u.pathname.startsWith('/api/') || r.headers.has('Authorization')) return;
 if (r.mode === 'navigate') {
  event.respondWith((async () => { try { const response = await fetch(r); if(response.ok) await (await caches.open(CACHE_NAME)).put('/index.html', response.clone()); return response; } catch { return (await caches.match('/index.html')) || (await caches.match('/')) || new Response('Offline. Reconnect to load the app.', {status:503}); } })()); return;
 }
 if (!/\.(js|css|svg|png|jpg|jpeg|webp|woff2?)$/.test(u.pathname)) return;
 event.respondWith((async () => { const cached=await caches.match(r); if(cached) return cached; const response=await fetch(r); if(response.ok && response.type==='basic') await (await caches.open(CACHE_NAME)).put(r,response.clone()); return response; })());
});
