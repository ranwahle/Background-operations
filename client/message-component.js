
export class MessageComponent extends HTMLElement {

    connectedCallback() {
        this.render();
        this.setEvents();
    }

    render() {
        this.innerHTML = `
       
        <input type="text" placeholder="Message" aria-label="message">
        <button>Send</button>
        `
    }

    setEvents() {
        this.querySelector('button').onclick = () => {
            this.dispatchEvent(new CustomEvent('send',
                {
                    detail: {
                        message: this.querySelector('input').value
                    }
                }));
        }
    }
}

customElements.define('message-component', MessageComponent);
