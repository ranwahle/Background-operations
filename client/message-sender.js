function doSomeErrorHandling(e) {
    
}

export async function sendMessage(message) {
    try {
        await fetch('/api/message', {
            method: 'post', body: JSON.stringify(message),

            headers: {'content-type': 'application/json'}
        });

        return true;

    } catch (e) {
        doSomeErrorHandling(e)
    }
    
}
