self.messages = [];

addEventListener('sync', function (evt) {
    if (evt.tag === 'send-message') {
        evt.waitUntil(sendEverything(evt))
    }
});

self.addEventListener('activate', function(event) {
    event.waitUntil(
        caches.keys().then(function (cacheNames) {
            return Promise.all(
                cacheNames.filter(function (cacheName) {
                    // Return true if you want to remove this cache,
                    // but remember that caches are shared across
                    // the whole origin
                }).map(function (cacheName) {
                    return caches.delete(cacheName);
                })
            );
        })
    );
});

self.addEventListener("install", installEvent => {
    installEvent.waitUntil(
        caches.open('').then(function(cache) {
            return cache.addAll(
                [
                    '/',
                    'manifest.json',
                    'images/icon-192.png',
                    'images/favicon-32x32.png',
                    'images/512x512.ico',
                    'index.html',
                    'index.js',
                    'jsonUtils.js',
                    'message-bullet-component.js',
                    'message-component.js',
                    'message-sender.js',
                    'messages-area-component.js',
                    'style.css',
                    'sw.js',

                ]
            );
        })
    );
})

addEventListener('backgroundfetchsuccess', (event) => {
    const bgFetch = event.registration;

    event.waitUntil(async function()  {
        // Create/open a cache.
        const cache = await caches.open('downloads');
        // Get all the records.
        const records = await bgFetch.matchAll();
        // Copy each request/response across.
        const promises = records.map(async (record) => {
            const response = await record.responseReady;
            await cache.put(record.request, response);
        });

        // Wait for the copying to complete.
        await Promise.all(promises);

        // Update the progress notification.
        event.updateUI({ title: 'Episode 5 ready to listen!',
            icons: [{
                sizes: '300x300',
                src: '/images/ep5-icon.png',
                type: 'image/png',
            }]
        });
    }());
    console.log('fetch success');


});
addEventListener('backgroundfetchclick', (event) => {
    const bgFetch = event.registration;

    console.log('fetch event',event);

    if (bgFetch.result === 'success') {
        clients.openWindow('/latest-podcasts');
    } else {
        clients.openWindow('/download-progress');
    }
});

addEventListener('backgroundfetchfailure', (event) => {
    console.log('fail event', event);

    // event.updateUi({title: 'Fail fetching'})
})

addEventListener('backgroundfetchabort', (event) => {
    console.log('Aborted', event);

    // event.updateUi({title: 'Fail fetching'})
})
addEventListener('message', message => {
    self.messages.push(message.data);
})

async function sendEverything(evt) {
    console.log('sending...')
    const {messages} = self;
    self.messages = [];

    await messages.forEach(async message => {
        try {
          await  sendMessage(message);
        } catch {
            self.messages.push(message);
        }

    });
}

async function sendMessage(message) {
    await fetch('/api/message', {
        method: 'post', body: JSON.stringify(message),

        headers: {'content-type': 'application/json'}
    });
}
