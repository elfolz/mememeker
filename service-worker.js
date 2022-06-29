const assets = [
	'/',
	'script.js',
	'style.css',
	'favicon.ico',
	'image/copy.svg',
	'image/image.svg',
	'image/download.svg',
	'image/clipboard.svg',
	'android-chrome-192x192.png',
	'android-chrome-512x512.png',
	'android-chrome-maskable-192x192.png',
	'android-chrome-maskable-512x512.png'
]

self.addEventListener('install', event => {
	event.waitUntil(() => {
		caches.open('mememeker')
		.then(response => {
			response.addAll(assets)
		})
	})
	self.skipWaiting()
})