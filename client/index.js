import './message-component.js';
import './messages-area-component.js';
import {sendMessage} from "./message-sender.js";
import './status-component.js';


const fetchGoogleChrome = async () => {
    const fetchName = 'chrome-fetch';
    const fetchButton = document.querySelector('#btnBackgroundFetch');
    const registration = await navigator.serviceWorker.ready;
    const fetchRegistration = await registration.backgroundFetch.get(fetchName);
    if (fetchRegistration) {
        fetchRegistration.abort();
        fetchButton.textContent = 'Fetch';
        return;

    }

    const result = await registration.backgroundFetch.fetch(fetchName,
        ['largeFiles/googlechrome.dmg',
            'largeFiles/googlechrome-1.dmg'], {
            title: 'Google chrome',
            icons: [{
                sizes: '192x192',
                src: 'images/icon-192.png',
                type: 'image/png',
            }],
            downloadTotal: 2 * 88061320
        });

    result.onprogress = progressEvent => {
        const { downloaded, downloadTotal } = progressEvent.target
        document.querySelector('#fetchProgress').value =  downloaded / downloadTotal * 100;

        if (progressEvent.target.result) {
            fetchButton.textContent = 'Fetch';
        }
    }

    fetchButton.textContent = 'Abort Fetch';

    console.log('result', result);
}

document.addEventListener('DOMContentLoaded', async () => {

        // Register your service worker:
        navigator.serviceWorker.register('./sw.js');

        navigator.serviceWorker.addEventListener('message', message => {
            const {tag, success, type} = message.data;
            document.querySelector('status-element').eventData = {tag, success, type};
            if (type === 'sync') {
                messageComponent.disabled = false;
                loadMessages();
            }

        })

        const swRegistration = await navigator.serviceWorker.ready;


        document.querySelector('#btnBackgroundFetch').onclick = fetchGoogleChrome;


        const loadMessages = async () => {
            const response = await fetch('/api/messages');
            const messages = await response.json();
            messagesArea.messages = messages;
        }

        const messagesArea = document.querySelector('messages-area-component');

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
        const messageComponent = document.querySelector('message-component');

        messageComponent.addEventListener('send'
            , async evt => {

                const sender = txtSenderName.value;
                const message = {sender, content: evt.detail.message};

                // Request permission
                if (!(await isBackgroundSyncGranted())) {
                    console.error('Hey, give me background-sync permissions');
                    await sendMessage(message);
                    messageComponent.disabled = false;
                    return;
                }

                swRegistration.active.postMessage(message)
                await swRegistration.sync.register('send-message');
                loadMessages();


                // sock.send(JSON.stringify(message));
            });

        document.querySelector('#btnStartPeriodicSync')
            .addEventListener('click', async () => {
                const result = await swRegistration.periodicSync
                    .register('get-messages',
                        {minInterval: 10})
                console.log('We have registered a periodic sync event', result);
            });

        document.querySelector('#btnGetCachedMessages').onclick = loadMessages;

        loadMessages();
    }
)
