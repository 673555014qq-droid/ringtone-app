const CACHE_NAME = 'phone-brand-ringtone-pwa-v39-20260426';

const APP_SHELL = [
    './',
    './index.html',
    './manifest.json',
    './sw.js'
];

const BRAND_ASSETS = [
    './img/01_motorola.png',
    './img/02_lg.png',
    './img/03_oppo.png',
    './img/04_google_pixel.png',
    './img/05_xperia.png',
    './img/06_huawei.png',
    './img/07_blackberry.png',
    './img/08_alcatel.png',
    './img/09_xiaomi.png',
    './img/10_honor.png',
    './img/11_oneplus.png',
    './img/12_htc.png',
    './img/13_cubot.png',
    './img/14_asus.png',
    './img/15_aquos.png',
    './img/16_lenovo.png',
    './img/17_oukitel.png',
    './img/18_wiko.png',
    './img/19_blackview.png',
    './img/20_realme.png',
    './img/21_zte.png',
    './img/22_techno.png',
    './img/23_vivo.png',
    './img/24_coolpad.png',
    './img/25_cromax.png',
    './img/26_lava.png',
    './img/27_panasonic.png',
    './img/28_intex.png',
    './img/29_tcl.png',
    './img/30_gionee.png',
    './img/31_infinix.png',
    './img/32_nokia.png',
    './img/33_fairphone.png',
    './img/34_ulefone.png',
    './img/35_t_mobile.png',
    './img/36_meizu.png',
    './img/37_itel.png',
    './img/38_samsung.png',
    './img/39_iphone.png',

    './audio/01_motorola.mp3',
    './audio/02_lg.mp3',
    './audio/03_oppo.mp3',
    './audio/04_google_pixel.mp3',
    './audio/05_xperia.mp3',
    './audio/06_huawei.mp3',
    './audio/07_blackberry.mp3',
    './audio/08_alcatel.mp3',
    './audio/09_xiaomi.mp3',
    './audio/10_honor.mp3',
    './audio/11_oneplus.mp3',
    './audio/12_htc.mp3',
    './audio/13_cubot.mp3',
    './audio/14_asus.mp3',
    './audio/15_aquos.mp3',
    './audio/16_lenovo.mp3',
    './audio/17_oukitel.mp3',
    './audio/18_wiko.mp3',
    './audio/19_blackview.mp3',
    './audio/20_realme.mp3',
    './audio/21_zte.mp3',
    './audio/22_techno.mp3',
    './audio/23_vivo.mp3',
    './audio/24_coolpad.mp3',
    './audio/25_cromax.mp3',
    './audio/26_lava.mp3',
    './audio/27_panasonic.mp3',
    './audio/28_intex.mp3',
    './audio/29_tcl.mp3',
    './audio/30_gionee.mp3',
    './audio/31_infinix.mp3',
    './audio/32_nokia.mp3',
    './audio/33_fairphone.mp3',
    './audio/34_ulefone.mp3',
    './audio/35_t_mobile.mp3',
    './audio/36_meizu.mp3',
    './audio/37_itel.mp3',
    './audio/38_samsung.mp3',
    './audio/39_iphone.mp3',

    './img/icon-192.png',
    './img/icon-512.png'
];

const PRECACHE_URLS = [...APP_SHELL, ...BRAND_ASSETS];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => Promise.allSettled(PRECACHE_URLS.map(url => cache.add(url))))
            .then(() => self.skipWaiting())
    );
});

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys()
            .then(keys => Promise.all(
                keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
            ))
            .then(() => self.clients.claim())
    );
});

self.addEventListener('fetch', event => {
    const request = event.request;

    if (request.method !== 'GET') {
        return;
    }

    const requestUrl = new URL(request.url);

    if (requestUrl.origin !== self.location.origin) {
        return;
    }

    if (request.destination === 'audio') {
        event.respondWith(cacheFirst(request));
        return;
    }

    if (request.mode === 'navigate') {
        event.respondWith(
            fetch(request).catch(() => caches.match('./index.html'))
        );
        return;
    }

    event.respondWith(staleWhileRevalidate(request));
});

async function cacheFirst(request) {
    const cached = await caches.match(request);
    if (cached) return cached;

    const response = await fetch(request);
    if (response && response.ok) {
        const cache = await caches.open(CACHE_NAME);
        cache.put(request, response.clone());
    }
    return response;
}

async function staleWhileRevalidate(request) {
    const cache = await caches.open(CACHE_NAME);
    const cached = await cache.match(request);

    const fetchPromise = fetch(request).then(response => {
        if (response && response.ok) {
            cache.put(request, response.clone());
        }
        return response;
    }).catch(() => cached);

    return cached || fetchPromise;
}
