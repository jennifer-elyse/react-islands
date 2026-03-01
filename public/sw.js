const CACHE_NAME = 'react-islands-v0.1.15';
const CORE = ['/', '/manifest.webmanifest', '/pwa-register.js', '/icons/icon.png'];

self.addEventListener('install', (event) => {
	event.waitUntil(
		(async () => {
			const cache = await caches.open(CACHE_NAME);
			await cache.addAll(CORE);
			self.skipWaiting();
		})(),
	);
});

self.addEventListener('activate', (event) => {
	event.waitUntil(
		(async () => {
			const keys = await caches.keys();
			await Promise.all(keys.map((k) => (k === CACHE_NAME ? null : caches.delete(k))));
			self.clients.claim();
		})(),
	);
});

self.addEventListener('fetch', (event) => {
	const req = event.request;
	if (req.method !== 'GET') return;

	const url = new URL(req.url);
	if (url.origin !== self.location.origin) return;

	if (req.headers.get('accept')?.includes('text/html')) {
		event.respondWith(
			(async () => {
				try {
					return await fetch(req);
				} catch {
					const cache = await caches.open(CACHE_NAME);
					const cached = await cache.match('/');
					return cached || new Response('Offline', { status: 503 });
				}
			})(),
		);
		return;
	}

	event.respondWith(
		(async () => {
			const cache = await caches.open(CACHE_NAME);
			const cached = await cache.match(req);
			if (cached) return cached;

			const res = await fetch(req);
			if (res && res.status === 200) cache.put(req, res.clone());
			return res;
		})(),
	);
});
