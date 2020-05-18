# Background operations demo

This repository is demonstrating serviceWorker background sservices and how to work with their API.
 
## Background Sync
Background sync is an event you may register to and it will be dispatched whenever network connection exists or responred.

 ### Main worker side
```javascript
const swRegistration = await navigator.serviceWorker.ready;
 swRegistration.active.postMessage(message)
 await swRegistration.sync.register('send-message');
```
### Service worker side
```javascript
addEventListener('sync', async function (evt) {
    if (evt.tag === 'send-message') {
        evt.waitUntil(sendEverything(evt))
    } 
}
```

## Periodic backgroudn sync 
This event is dispatched periodicly according to the user-agent decision, and it is permitted only on preinstalled PWAs.
It also run on a trusted network and with sites you are frequently engaged with.
 You may check (chrome://site-engagement), or (edge://site-engagement/) for that.


### Main worker side
```javascript
 const result = await swRegistration.periodicSync
                    .register('get-messages')

```

### Service worker site
```javascript
addEventListener('periodicsync', (event) => {
    if (event.tag === 'get-messages') {
         event.waitUntil(getMessages(event));
    }
});
```

## Background Fetch

Backgroudn fetch is a service that allow long network activity that when disrupted by poor or lack of network connection, it may resume from the point it stoped without any internevtion from the developer.
With backgroudn fetch you may download multiple resources, and serve them to the main worker from your cache.

The event is dispatched from the main worker, and you may handle its success or error on the srvice worker side.

### Main worker

```javascript
 const result = await registration.backgroundFetch.fetch('get-many-files',
        ['largeFiles/a-package-installer.dmg',
            'largeFiles/some-diveo.mov'], {
            title: 'Many files',
            icons: [{
                sizes: '192x192',
                src: 'images/icon-192.png',
                type: 'image/png',
            }],
            downloadTotal: 2 * 88061320
        });
// On progress
result.onprogress = progressEvent => {
        const { downloaded, downloadTotal } = progressEvent.target
        document.querySelector('#fetchProgress').value =  downloaded / downloadTotal * 100;


// If the fetch ends, there will be a result member for the event target
        if (progressEvent.target.result) {
            fetchButton.textContent = 'Fetch';
        }
    }

```
### Service worker side

```javascript
addEventListener('backgroundfetchsuccess', (event) => {
    event.waitUntill(async () => {
        // put all files on cahce
    const bgFetch = event.registration;
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

    }());
```
