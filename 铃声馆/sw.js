const CACHE_NAME = 'ringtone-app-v1';

// 需要预缓存的文件列表（根据实际文件路径调整）
const PRECACHE_URLS = [
    './',
    './index.html',
    './manifest.json',
    // 图片和音频会自动在首次访问时缓存，这里可以列一些关键资源
    './img/xiaomi.png',
    './img/huawei.png',
    './img/apple.png',
    './img/oppo.png',
    './img/vivo.png',
    './audio/xiaomi.mp3',
    './audio/huawei.mp3',
    './audio/apple.mp3',
    './audio/oppo.mp3',
    './audio/vivo.mp3',
    // 如果你有 app 图标，也加进去
    './img/icon-192.png',
    './img/icon-512.png'
];

// 安装事件：预缓存关键资源
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(PRECACHE_URLS))
            .then(() => self.skipWaiting())
    );
});

// 激活事件：清理旧缓存
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(keys => {
            return Promise.all(
                keys.filter(key => key !== CACHE_NAME)
                    .map(key => caches.delete(key))
            );
        }).then(() => self.clients.claim())
    );
});

// 拦截请求：缓存优先，找不到时回退网络
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(cachedResponse => {
                if (cachedResponse) {
                    return cachedResponse;
                }
                // 网络请求并动态缓存
                return fetch(event.request).then(response => {
                    // 只缓存成功且同源的 GET 请求
                    if (!response || response.status !== 200 || response.type !== 'basic') {
                        return response;
                    }
                    const responseClone = response.clone();
                    caches.open(CACHE_NAME).then(cache => {
                        cache.put(event.request, responseClone);
                    });
                    return response;
                });
            })
    );
});