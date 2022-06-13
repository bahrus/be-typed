import { register } from 'be-hive/register.js';
import { define } from 'be-decorated/be-decorated.js';
export class BeTyped {
    intro(proxy, target, beDecorProps) {
        const btn = document.createElement('button');
        btn.innerText = '⚙️';
        btn.addEventListener('click', this.loadDialog);
        target.appendChild(btn);
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
            virtualProps: [],
            intro: 'intro',
            finale: 'finale'
        }
    },
    complexPropDefaults: {
        controller: BeTyped
    }
});
register(ifWantsToBe, upgrade, tagName);
