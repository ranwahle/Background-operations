import './message-component.js';
import './messages-area-component.js';
import {tryParse} from "./jsonUtils.js";
import {sendMessage} from "./message-sender.js";


document.addEventListener('DOMContentLoaded', async () => {

        // Register your service worker:
        navigator.serviceWorker.register('./sw.js');

        const swRegistration = await navigator.serviceWorker.ready;



        const getFetchRegistration = async () => {
            const readyMadeRegistration = await swRegistration.backgroundFetch
           isBackgroundSyncGranted()      .get('my-fetch');

            if (readyMadeRegistration) {
                readyMadeRegistration.abort();
            }
                const bgFetch = await swRegistration.backgroundFetch.fetch('my-fetch',
                    [  '/images/202627.jpg'
                        // '/images.ep5-icon.png',
                        // 'https://developers.google.com/web/updates/2018/12/background-fetch'
                    ], {
                        title: '202627.jpg',
                        // icons: [{
                        //     sizes: '300x300',`
                        //     src: '/images/ep5-icon.png',
                        //     type: 'image/png',
                        // }],
                        downloadTotal: 17241,
                    });
                return bgFetch;


        }

    // document.querySelector('#btnFetch')
    //     .addEventListener('click', async() => {
    //
    //         const bgFetch = await getFetchRegistration();
    //            bgFetch.addEventListener('progress', () => {
    //             // If we didn't provide a total, we can't provide a %.
    //             if (!bgFetch.downloadTotal) return;
    //
    //             const percent = Math.round(bgFetch.downloaded / bgFetch.downloadTotal * 100);
    //             console.log(`Download progress: ${percent}% (${bgFetch.downloaded} / ${bgFetch.downloadTotal})`);
    //         });
    //
    //     });
    //
    //     document.querySelector('#btnAbort').addEventListener('click'
    //     , async () => {
    //             const readyMadeRegistration = await swRegistration.backgroundFetch
    //                 .get('my-fetch');
    //
    //             if (readyMadeRegistration) {
    //                 readyMadeRegistration.abort();
    //             }
    //         })


        const {protocol, hostname, port} = location;
        const sock = new SockJS(`${protocol}//${hostname}:${port}/echo`);

        const messagesArea = document.querySelector('messages-area-component');
        sock.onmessage = async function (e) {
            console.log('message', e.data);
            const messages = document.querySelector('messages-area-component').messages;
            const newMessage = await tryParse(e.data);
            messagesArea.messages =
                [...messages, newMessage]
        };

        sock.onclose = function () {
            console.log('close');
        };

        const isBackgroundSyncGranted = async () => {
            try {
                const result = await navigator.permissions.query({name: 'background-sync'});

                return result.state === 'granted';
            } catch { // Not supported
                return false;
            }

        }

        const txtSenderName = document.querySelector('#txtName');

        txtSenderName.onchange = () => {
            messagesArea.senderName = txtSenderName.value;
        }

        document.querySelector('message-component').addEventListener('send'
            , async evt => {

                const sender = txtSenderName.value;
                const message = {sender, content: evt.detail.message};

                // Send message to the ServiceWorker
                swRegistration.active.postMessage(message)
                // Register to the next sync
                await swRegistration.sync.register('send-message');

                // Request permission
                if (!(await isBackgroundSyncGranted())) {
                    console.error('Hey, give me background-sync permissions');
                    sendMessage(message);
                    return;
                }

                swRegistration.active.postMessage(message)
                await swRegistration.sync.register('send-message');


                // sock.send(JSON.stringify(message));
            });
    }
)
