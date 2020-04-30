import './message-bullet-component.js'

export class MessagesAreaComponent extends HTMLElement {

    constructor() {
        super();
    }

    connectedCallback() {
        this.render();
    }

    _senderName = '';

    get senderName() {
        return this._senderName;
    }
    set senderName(senderName) {
        this._senderName = senderName;
        this.render();
    }

    _messages = [];

    get messages() {
        return this._messages || [];
    }

    set messages(messages) {
        this._messages = messages.sort((x, y) => y.timeStamp - x.timeStamp);
        this.render();
    }

    render() {
        this.innerHTML = `<div>
        ${
            this.messages.map((message, index) => {
                const className = message.sender === this.senderName? 'right' : 'left'
                return `<message-bullet-component class="${className}">      
                                </message-bullet-component>`
            }).join('')
        }
        
        
</div>`
        this.querySelectorAll('message-bullet-component').forEach((element, index) =>
            element.message = this.messages[index]
        )
    }
}


customElements.define('messages-area-component', MessagesAreaComponent);
