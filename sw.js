const CACHE_NAME = 'verifit-v5';
const ASSETS = [
    'index.html',
    'css/style.css',
    'js/app.js',
    'js/meals.js',
    'js/workouts.js',
    'js/preferences.js',
    'data/foods.json.js',
    'data/exercises.json.js',
    'manifest.json',
    'icons/verifit-logo.png'
];

// התקנה - שמירת קבצים בcache
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(ASSETS))
            .then(() => self.skipWaiting())
    );
});

// הפעלה - ניקוי cache ישן
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(keys =>
            Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
        ).then(() => self.clients.claim())
    );
});

// fetch - cache first
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(cached => cached || fetch(event.request))
    );
});
