import {register} from 'be-hive/register.js';
import {define, BeDecoratedProps} from 'be-decorated/be-decorated.js';
import {BeTypedActions, BeTypedVirtualProps, BeTypedProps} from './types';

export class BeTyped implements BeTypedActions{
    intro(proxy: HTMLLabelElement & BeTypedVirtualProps, target: HTMLLabelElement, beDecorProps: BeDecoratedProps){
        const btn = document.createElement('button');
        btn.innerText = '⚙️';
        btn.addEventListener('click', this.loadDialog);
        target.appendChild(btn);
    }

    finale(proxy: HTMLLabelElement & BeTypedVirtualProps, target: HTMLLabelElement, beDecorProps: BeDecoratedProps){
        const btn = target.querySelector('button');
        if(btn !== null) {
            btn.removeEventListener('click', this.loadDialog);
            btn.remove();
        }
    }

    loadDialog = (e: Event) => {
        let dialog = (<any>self)['be-typed-dialog'];
        if(dialog === undefined) {
            dialog = document.createElement('dialog');
            (<any>self)['be-typed-dialog'] = dialog;
            dialog.id = 'be-typed-dialog';
            dialog.innerHTML = String.raw `
<form method="dialog">
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
    <button value="cancel">Cancel</button>
    <button value="default">Apply</button>
</form>
            `;
            dialog.querySelector('[value="default"]')!.addEventListener('click', this.applyDialog);
            document.body.appendChild(dialog);
        }
        dialog.showModal();
    }

    applyDialog = (e: Event) => {
        const dialog = (e.target as HTMLButtonElement).closest('dialog')!;
        let inp = this.proxy.querySelector('input');
        if(inp === null) {
            inp = document.createElement('input');
            this.proxy.appendChild(inp);
        }
        inp.type = dialog.querySelector('select')!.value;
    }
}

export interface BeTyped extends BeTypedProps{}

const tagName = 'be-typed';

const ifWantsToBe = 'typed';

const upgrade = 'label';

define<BeTypedProps & BeDecoratedProps<BeTypedProps, BeTypedActions>, BeTypedActions>({
    config:{
        tagName,
        propDefaults:{
            upgrade,
            ifWantsToBe,
            virtualProps: [],
            intro: 'intro',
            finale: 'finale'
        }
    },
    complexPropDefaults:{
        controller: BeTyped
    }
});
register(ifWantsToBe, upgrade, tagName);