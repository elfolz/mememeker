const assets = [
	'/',
	'/mememeker/',
	'/mememeker/index.html',
	'/mememeker/script.js',
	'/mememeker/style.css',
	'/mememeker/favicon.ico',
	'/mememeker/image/copy.svg',
	'/mememeker/image/image.svg',
	'/mememeker/image/download.svg',
	'/mememeker/image/clipboard.svg',
	'/mememeker/android-chrome-192x192.png',
	'/mememeker/android-chrome-512x512.png',
	'/mememeker/android-chrome-maskable-192x192.png',
	'/mememeker/android-chrome-maskable-512x512.png'
]

self.addEventListener('install', event => {
	event.waitUntil(() => {
		caches.open('mememeker')
		.then(cache => {
			cache.addAll(assets)
		})
	})
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