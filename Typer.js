import { findAdjacentElement } from 'be-decorated/findAdjacentElement.js';
export class Typer {
    proxy;
    props;
    #trigger;
    #dialog;
    constructor(proxy, props) {
        this.proxy = proxy;
        this.props = props;
        if (props === undefined) {
            this.props = proxy;
        }
    }
    async addTypeButtonTrigger({ insertPosition, text, then }) {
        if (this.#trigger === undefined) {
            const trigger = findAdjacentElement(insertPosition, this.proxy, 'button.be-typed-trigger');
            if (trigger !== null)
                this.#trigger = trigger;
            if (this.#trigger === undefined) {
                this.#trigger = document.createElement('button');
                this.#trigger.ariaLabel = 'Configure input.';
                this.#trigger.title = 'Configure input.';
                this.#trigger.type = 'button';
                this.#trigger.classList.add('be-typed-trigger');
                this.proxy.insertAdjacentElement(insertPosition, this.#trigger);
            }
            this.setText(this.props);
            this.#trigger.addEventListener('click', this.loadDialog);
            if (then !== undefined) {
                const { doThen } = await import('be-decorated/doThen.js');
                doThen(this.proxy, then);
            }
        }
    }
    setText({ text }) {
        if (this.#trigger !== undefined) {
            this.#trigger.innerHTML = text; //TODO:  sanitize
        }
    }
    loadDialog = (e) => {
        if (this.#dialog === undefined) {
            const dialog = document.createElement('dialog');
            this.#dialog = dialog;
            dialog.innerHTML = String.raw `
<form method="dialog">
    <label style="display:block;">Name:
        <input type="text" name="name" />
    </label>
    <label style="display:block;">Type:
        <select>
            <option value="text">Text</option>
            <option value="number">Number</option>
            <option value="date">Date</option>
            <option value="time">Time</option>
            <option value="datetime-local">Datetime-local</option>
            <option value="email">Email</option>
            <option value="url">Url</option>
            <option value="password">Password</option>
            <option value="search">Search</option>
            <option value="tel">Tel</option>
            <option value="color">Color</option>
            <option value="file">File</option>
            <option value="range">Range</option>
            <option value="checkbox">Checkbox</option>
            <option value="radio">Radio</option>
        </select>
    </label>
    <label>
        Required:
        <input name=required type=checkbox>
    </label>
    </label>
    <label>
        Multiple:
        <input name=multiple type=checkbox>
    </label>
    <label>
        MaxLength:
        <input name=maxlength type=number>
    </label>
    <label>
        MinLength:
        <input name=minlength type=number>
    </label>
    <label>
        Max:
        <input name=max type=number>
    </label>
    <label>
        Min:
        <input name=min type=number>
    </label>
    <button value="cancel">Cancel</button>
    <button value="default">Apply</button>
</form>
            `;
            dialog.querySelector('[value="default"]').addEventListener('click', this.applyDialog);
            document.body.appendChild(dialog);
        }
        const input = this.proxy.querySelector('input');
        if (input !== null) {
            this.#dialog.querySelector('input[name="name"]').value = input.name;
            const currentType = input.type;
            this.#dialog.querySelector(`option[value="${currentType}"]`).selected = true;
        }
        this.#dialog.showModal();
    };
    applyDialog = (e) => {
        const dialog = e.target.closest('dialog');
        let inp = this.proxy.querySelector('input');
        if (inp === null) {
            inp = document.createElement('input');
            const btn = this.proxy.querySelector('button');
            btn.before(inp);
        }
        inp.type = dialog.querySelector('select').value;
        const name = dialog.querySelector('input[name="name"]').value;
        if (name !== '') {
            inp.name = name;
            const nodes = Array.from(this.proxy.childNodes).filter(x => x.nodeType === 3);
            for (const node of nodes) {
                node.remove();
            }
            this.proxy.prepend(document.createTextNode(name + ': '));
        }
    };
    dispose() {
        if (this.#trigger !== undefined) {
            this.#trigger.removeEventListener('click', this.loadDialog);
            this.#trigger.remove();
        }
    }
}
export const proxyPropDefaults = {
    insertPosition: 'beforeend',
    text: '&#x2699;'
};
