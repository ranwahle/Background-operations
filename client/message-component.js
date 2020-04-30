
export class MessageComponent extends HTMLElement {

    connectedCallback() {
        this.render();
        this.setEvents();
    }

    _disabled = false;
    get disabled() {
        return this._disabled || '';
    }
    set disabled(value) {
        if (value !== this._disabled) {
            this._disabled = value;
            this.render();
            this.setEvents();
        }
    }

    render() {
        this.innerHTML = `
       
        <input type="text" placeholder="Message" aria-label="message">
        <button ${this.disabled && 'disabled'} >Send</button>
        `
    }

    sendButtonClick = () => {
        this.dispatchEvent(new CustomEvent('send',
            {
                detail: {
                    message: this.querySelector('input').value
                }
            }));

        this.disabled = true;
    }

    setEvents() {
        this.querySelector('button').onclick = this.sendButtonClick;
    }
}

customElements.define('message-component', MessageComponent);
