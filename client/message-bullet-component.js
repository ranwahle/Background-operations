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
</div>`
    }
}

customElements.define('message-bullet-component', MessageBulletComponent)
