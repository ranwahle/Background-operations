function padStart(stringToPad) {
    if (typeof stringToPad === 'number') {
        stringToPad  = stringToPad.toString();
    }
    return stringToPad.padStart(2,'0');
}

function formatDate(date) {
    const now = new Date();
    if (now.getDate() === date.getDate()) {
        return `${padStart(date.getHours())}:${padStart(date.getMinutes())}:${padStart(date.getSeconds())}`
    }
    return `${date.getDate()}:${date.getMonth()}:${date.getFullYear()}`

}

export class MessageBulletComponent extends HTMLElement {
    connectedCallback() {
        this.render();
    }

    _message = {};
    get message() {
        return this._message;
    }

    set message(value) {
        this._message = value;
        this.render();
    }

    render() {
        this.innerHTML = `<div>
        <div class="sender">${this.message.sender}</div>
        <div class="content">${this.message.content}</div>
        <div class="date">Sent ${formatDate(new Date(this.message.timeStamp))}</div>
</div>`
    }
}

customElements.define('message-bullet-component', MessageBulletComponent)
