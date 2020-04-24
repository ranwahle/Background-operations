export function tryParse(jsonString) {

    return new Promise((resolve, reject) => {
        try {
            const result = JSON.parse(jsonString)
            resolve(result);
        } catch (e) {
            if (typeof jsonString === 'string') {
                resolve({sender: 'server', content: jsonString});
                return;
            }
            reject(e);
        }
    });
}
