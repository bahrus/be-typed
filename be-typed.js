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
<form>
    <label>Type:
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
</form>
            `;
            document.body.appendChild(dialog);
        }
        dialog.showModal();
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
