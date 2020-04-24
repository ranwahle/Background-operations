export async function sendMessage(message) {
    await fetch('/api/message', {
        method: 'post', body: JSON.stringify(message),

        headers: {'content-type': 'application/json'}
    });
}
