// sw.js (Service Worker)

const CACHE_NAME = 'plane-tycoon-v1';
const urlsToCache = [
    './index.html',
    './manifest.json',
    './icon.png' // İkon dosyasını yüklemeyi unutma!
];

// 1. Kurulum: Dosyaları hafızaya al
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(urlsToCache))
    );
});

// 2. Çevrimdışı Erişim: İnternet yoksa hafızadaki dosyaları göster
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => response || fetch(event.request))
    );
});
