// @ts-check
/** @import {Actions, PAP, AllProps, AP, BAP, ITyper} from './ts-refs/be-typed/types.d.ts' */;

export class Typer {
    /** @type {HTMLElement} */
    enhancedElement;
    /** @type {BAP} */
    props;
    /**
     * @type {HTMLDialogElement}
     */
    #dialog;
    /**
     * 
     * @param {HTMLElement} enhancedElement 
     * @param {BAP} props 
     */
    constructor(enhancedElement, props) {
        this.enhancedElement = enhancedElement;
        this.props = props;

    }
    #dialogAC = new AbortController();
    showDialog() {
        if (this.#dialog === undefined) {
            if (globalThis[guid] === undefined) {
                const dialog = document.createElement('dialog');
                dialog.id = guid;
                this.#dialog = dialog;
                dialog.innerHTML = String.raw `
    <form method="dialog">
        <label style="display:block;">Name:
            <input type="text" name="name" />
        </label>
        <label style="display:block;">Name attribute:
            <select name=name-attr>
                <option value="name" selected>Name</option>
                <option value=":">:Name</option>
            </select>
        </label>
        <label style="display:block;">Type:
            <select name=type>
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
        <details>
            <summary>Advanced Settings</summary>
        </details>
        <button value="cancel">Cancel</button>
        <button value="default">Apply</button>
    </form>
                `;
                dialog.querySelector('[value="default"]')?.addEventListener('click', e => {
                    this.applyDialog(e);
                }, { signal: this.#dialogAC.signal });
                document.body.appendChild(dialog);
            }
            else {
                this.#dialog = globalThis[guid];
            }
        }
        const input = this.enhancedElement.querySelector('input');
        if (input !== null) {
            this.#dialog.querySelector('input[name="name"]').value = input.name;
            const currentType = input.type;
            this.#dialog.querySelector(`select[name="type"]>option[value="${currentType}"]`).selected = true;
        }
        this.#dialog.showModal();
    }
    transferAttribute(dialog, attr, inp) {
        const editingEl = dialog.querySelector(`input[name="${attr}"]`);
        if (editingEl === null)
            return;
        switch (editingEl.type) {
            case 'number':
                {
                    const val = editingEl.value;
                    if (val === '') {
                        inp.removeAttribute(attr);
                    }
                    else {
                        inp.setAttribute(attr, val);
                    }
                    break;
                }
            case 'checkbox':
                {
                    const val = editingEl.checked;
                    if (val) {
                        inp.setAttribute(attr, '');
                    }
                    else {
                        inp.removeAttribute(attr);
                    }
                }
        }
    }
    applyDialog(e) {
        const dialog = e.target.closest('dialog');
        let inp = this.enhancedElement.querySelector('input');
        if (inp === null) {
            inp = document.createElement('input');
            const btn = this.enhancedElement.querySelector('button');
            btn?.before(inp);
        }
        inp.type = dialog.querySelector('select[name="type"]').value;
        const name = dialog.querySelector('input[name="name"]').value;
        if (name !== '') {
            inp.name = name;
            const labelTextContainer = this.enhancedElement.querySelector(this.props.labelTextContainer);
            if (labelTextContainer === null)
                throw '404';
            labelTextContainer.textContent = name + ': ';
        }
        ['required', 'max', 'min', 'maxlength', 'multiple', 'data-path-idx', 'data-path-lhs', 'data-path-rhs'].forEach(attr => {
            this.transferAttribute(dialog, attr, inp);
        });
    }
    dispose() {
        if (this.#dialogAC !== undefined)
            this.#dialogAC.abort();
    }
}
const guid = 'Frx+fxv4fEOZg2XfHY0DRw';
