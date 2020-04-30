export class StatusComponent extends HTMLElement {
    connectedCallback() {
        this.render();
    }

    _eventData;

    get eventData() {
        return this._eventData;
    }

    set eventData(data) {
        this._eventData = data;
        this.render();
    }

    render() {
        if (!this.eventData) {
            return `No event yet`;
        }
        const data = this.eventData;
        this.innerHTML = `<div class="status-div">
    Last background event
            type: ${data.type},
           tag ${data.tag},
           success: ${data.success}
</div>`
    }
}

customElements.define('status-element', StatusComponent)
