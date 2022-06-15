import { register } from 'be-hive/register.js';
import { define } from 'be-decorated/be-decorated.js';
export class BeTyped {
    #beDecorProps;
    #trigger;
    intro(proxy, target, beDecorProps) {
        this.#beDecorProps = beDecorProps;
    }
    async onInsertPosition({ text, insertPosition, then }) {
        if (this.#trigger === undefined) {
            switch (insertPosition) {
                case 'afterbegin':
                case 'beforeend':
                    {
                        const trigger = this.proxy.querySelector('button.be-typed-trigger');
                        if (trigger !== null) {
                            this.#trigger = trigger;
                        }
                    }
                    break;
                case 'beforebegin':
                    {
                        const trigger = this.proxy.previousElementSibling;
                        if (trigger !== null && trigger.matches('button.be-typed-trigger')) {
                            this.#trigger = trigger;
                        }
                    }
                    break;
                case 'afterend':
                    {
                        const trigger = this.proxy.nextElementSibling;
                        if (trigger !== null && trigger.matches('button.be-typed-trigger')) {
                            this.#trigger = trigger;
                        }
                    }
                    break;
            }
            if (this.#trigger === undefined) {
                this.#trigger = document.createElement('button');
                this.#trigger.title = 'Click to configure text box.';
                this.#trigger.classList.add('be-typed-trigger');
                this.proxy.insertAdjacentElement(insertPosition, this.#trigger);
            }
            this.onText(this);
            this.#trigger.addEventListener('click', this.loadDialog);
        }
        if (then !== undefined) {
            const { doThen } = await import('be-decorated/doThen.js');
            doThen(this.proxy, then);
        }
    }
    onText({ text }) {
        if (this.#trigger !== undefined) {
            this.#trigger.innerHTML = text; //TODO:  sanitize
        }
    }
    finale(proxy, target, beDecorProps) {
        const btn = target.querySelector('button');
        if (btn !== null) {
            btn.removeEventListener('click', this.loadDialog);
            btn.remove();
        }
    }
    loadDialog = (e) => {
        let dialog = self['be-typed-dialog'];
        if (dialog === undefined) {
            dialog = document.createElement('dialog');
            self['be-typed-dialog'] = dialog;
            dialog.id = 'be-typed-dialog';
            dialog.innerHTML = String.raw `
<form method="dialog">
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
    <label style="display:block;">Name:
        <input type="text" name="name" />
    </label>
    <button value="cancel">Cancel</button>
    <button value="default">Apply</button>
</form>
            `;
            dialog.querySelector('[value="default"]').addEventListener('click', this.applyDialog);
            document.body.appendChild(dialog);
        }
        dialog.showModal();
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
}
const tagName = 'be-typed';
const ifWantsToBe = 'typed';
const upgrade = 'label';
define({
    config: {
        tagName,
        propDefaults: {
            upgrade,
            ifWantsToBe,
            virtualProps: ['insertPosition', 'text', 'then'],
            proxyPropDefaults: {
                insertPosition: 'beforeend',
                text: '&#x2699;'
            },
            intro: 'intro',
            finale: 'finale'
        },
        actions: {
            onInsertPosition: 'insertPosition',
            onText: 'text',
        }
    },
    complexPropDefaults: {
        controller: BeTyped
    }
});
register(ifWantsToBe, upgrade, tagName);
