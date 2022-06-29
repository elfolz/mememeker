self.addEventListener('install', event => {
	self.skipWaiting()
})

self.addEventListener('fetch', event => {
	event.respondWith(caches.open('mememeker').then(cache => {
		return cache.match(event.request)
		.then(cachedResponse => {
			if (cachedResponse) return cachedResponse
			return fetch(event.request)
			.then(fetchedResponse => {
				cache.put(event.request, fetchedResponse.clone())
				return fetchedResponse
			})
		})
	}))
})