// 服务工作线程文件
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open('static-voting-app-v1').then(function(cache) {
      return cache.addAll([
        '/',
        '/index.html',
        '/styles.css',
        '/app.js'
      ]);
    })
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request).then(function(response) {
      return response || fetch(event.request).then(function(response) {
        // 只缓存成功的响应
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }

        var responseToCache = response.clone();
        caches.open('static-voting-app-v1').then(function(cache) {
          cache.put(event.request, responseToCache);
        });

        return response;
      }).catch(function() {
        // 网络请求失败时返回离线页面
        if (event.request.mode === 'navigate') {
          return caches.match('/index.html');
        }
      });
    })
  );
});

// 清理旧缓存
self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.filter(function(cacheName) {
          return cacheName !== 'static-voting-app-v1';
        }).map(function(cacheName) {
          return caches.delete(cacheName);
        })
      );
    })
  );
});

// 推送通知支持
self.addEventListener('push', function(event) {
  const title = '参数投票系统';
  const options = {
    body: event.data.text(),
    icon: '/icon.png',
    badge: '/badge.png'
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

// 通知点击处理
self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  event.waitUntil(
    clients.openWindow('https://static-voting-app.netlify.app')
  );
});
