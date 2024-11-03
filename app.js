self.addEventListener('install', (e) => {
	e.waitUntil(
		caches.open('my-cache').then((cache) => {
			return cache.addAll([
				'/', 
			]);
		})
	);
});

self.addEventListener('fetch', (e) => {
	e.respondWith(
		caches.match(e.request).then((response) => {
			return response || fetch(e.request).then((networkResponse) => {
				return caches.open('my-cache').then((cache) => {
					cache.put(e.request, networkResponse.clone());
					return networkResponse;
				});
			});
		})
	);
});
