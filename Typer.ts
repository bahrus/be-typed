import {VirtualProps, EndUserProps, ITyper} from './types';
import {findAdjacentElement} from 'be-decorated/findAdjacentElement.js';

export class Typer implements ITyper{
    #trigger: HTMLButtonElement | undefined;
    #dialog: HTMLDialogElement | undefined;

    constructor(public self: HTMLLabelElement, public props: EndUserProps){
        if(props === undefined){
            this.props = self as any as VirtualProps;
        }
    }
    

    #dialogAC: AbortController = new AbortController();
    showDialog(){
        if(this.#dialog === undefined) {
            const dialog = document.createElement('dialog');
            this.#dialog = dialog;
            let beReformableSettings = '';
            if(this.props.beReformable){
                beReformableSettings = String.raw `
<fieldset>
    <legend>beReformable Settings</legend>
    <label>
        Path index:
        <input type=number name=data-path-idx>
    </label>
    <label>
        Path lhs:
        <input type=text name=da-path-lhs>
    </label>
    <label>
        Path rhs:
        <input type=text name=da-path-rhs>
    </label>
</fieldset>
                `;
            }
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
    ${beReformableSettings}
    <button value="cancel">Cancel</button>
    <button value="default">Apply</button>
</form>
            `;
            dialog.querySelector('[value="default"]')!.addEventListener('click', e => {
                this.applyDialog(e);
            }, {signal: this.#dialogAC.signal});
            document.body.appendChild(dialog);
        }
        const input = this.self.querySelector('input');
        
        if(input !== null){
            (this.#dialog.querySelector('input[name="name"]') as HTMLInputElement).value = input.name;
            const currentType = input.type;
            (this.#dialog.querySelector(`option[value="${currentType}"]`) as HTMLOptionElement).selected = true;
        }
        
        this.#dialog.showModal();
    }


    transferAttribute(dialog: HTMLDialogElement, attr: string, inp: HTMLInputElement){
        const editingEl = dialog.querySelector(`input[name="${attr}"]`) as HTMLInputElement | null;
        if(editingEl === null) return;
        switch(editingEl.type){
            case 'number':
            {
                const val = editingEl.value;
                if(val === ''){
                    inp.removeAttribute(attr);
                }else{
                    inp.setAttribute(attr, val);
                }
                break;
            }
            case 'checkbox':
            {
                const val = editingEl.checked;
                if(val){
                    inp.setAttribute(attr, '');
                }else{
                    inp.removeAttribute(attr);
                }
            }
                

        }
        
    }


    applyDialog(e: Event){
        const dialog = (e.target as HTMLButtonElement).closest('dialog')!;
        let inp = this.self.querySelector('input');
        if(inp === null) {
            inp = document.createElement('input');
            const btn = this.self.querySelector('button')!;
            btn.before(inp);
        }
        inp.type = dialog.querySelector('select')!.value;
        const name = (dialog.querySelector('input[name="name"]') as HTMLInputElement).value;
        if(name !== '') {
            inp.name = name;
            const labelTextContainer = this.self.querySelector(this.props.labelTextContainer!);
            if(labelTextContainer === null) throw '404';
            labelTextContainer.textContent = name + ': '; 
        }
        ['required', 'max', 'min', 'maxlength', 'multiple', 'data-path-idx', 'data-path-lhs', 'data-path-rhs'].forEach(attr => {
            this.transferAttribute(dialog, attr, inp!);
        })
    }

    dispose(){
        if(this.#dialogAC !== undefined) this.#dialogAC.abort();
    }


}

