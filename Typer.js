// @ts-check
/** @import {Actions, PAP, AllProps, AP, ITyper} from './types/be-typed/types' */;

export class Typer {
    /** @type {Element} */
    enhancedElement;
    /** @type {AP} */
    props;
    /**
     * @type {HTMLDialogElement}
     */
    #dialog;
    /**
     * 
     * @param {Element} enhancedElement 
     * @param {AP} props 
     */
    constructor(enhancedElement, props) {
        this.enhancedElement = enhancedElement;
        this.props = props;

    }
    #dialogAC = new AbortController();
    showDialog() {
        if (this.#dialog === undefined) {
            if (globalThis[guid] === undefined) {
                ensureStyle();
                const dialog = document.createElement('dialog');
                dialog.id = guid;
                this.#dialog = dialog;
                dialog.innerHTML = String.raw `
    <button type="button" class="be-typed-close" aria-label="Close" title="Close">&#x2715;</button>
    <form method="dialog">
        <label>Name:
            <input type="text" name="name" />
        </label>
        <label>Type:
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
            <label style="display:block;">Name attribute:
            <select name=name-attr>
                <option value="name" selected>name</option>
                <option value=":">:[name]</option>
            </select>
        </label>
        </details>
        <div class="be-typed-actions">
            <button value="cancel">Cancel</button>
            <button value="default">Apply</button>
        </div>
    </form>
                `;
                dialog.querySelector('[value="default"]')?.addEventListener('click', e => {
                    this.applyDialog(e);
                }, { signal: this.#dialogAC.signal });
                dialog.querySelector('.be-typed-close')?.addEventListener('click', () => {
                    this.#dialog.close('cancel');
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
    /**
     * 
     * @param {Event} e 
     */
    applyDialog(e) {
        const target = e.target;
        if(!(target instanceof HTMLButtonElement )) return;
        const dialog = target.closest('dialog');
        if(dialog === null) throw 404;
        let inp = this.enhancedElement.querySelector('input');
        if (inp === null) {
            inp = document.createElement('input');
            const btn = this.enhancedElement.querySelector('button');
            btn?.before(inp);
        }
        const typeSelector = /** @type {HTMLSelectElement | null} */ (dialog.querySelector('select[name="type"]'));
        if(typeSelector === null) throw 404;
        inp.type = typeSelector.value;
        const nameNamer = /** @type {HTMLInputElement | null} */ (dialog.querySelector('input[name="name"]'));
        if(nameNamer === null) throw 404;
        const name = nameNamer.value;
        if (name !== '') {
            const nameAttrEl = /** @type {HTMLSelectElement | null} */ (dialog.querySelector('select[name="name-attr"]'));
            if(nameAttrEl === null) throw 404;
            const nameAttr = nameAttrEl.value;
            if(nameAttr === 'name'){
                inp.name = name;
            }else{
                inp.setAttribute(`:${name}`, '');
            }
            
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
const styleId = guid + '-style';

/**
 * Inject the dialog's default look exactly once.
 *
 * Everything lives inside `@layer be-typed`, so any *unlayered* rule the page
 * author writes wins over it regardless of specificity or source order - the
 * whole dialog, its fields and its buttons stay fully styleable / removable
 * with plain selectors and no `!important`. The muted "material" palette is
 * driven by `--be-typed-*` custom properties on the dialog, so the common
 * case is a one-line token override rather than re-declaring rules.
 */
function ensureStyle() {
    if (document.getElementById(styleId) !== null) return;
    // The dialog id contains "+" and "/", so it must be escaped before it can
    // appear in a selector.
    const d = 'dialog#' + CSS.escape(guid);
    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = String.raw `
@layer be-typed {
    ${d} {
        --be-typed-surface: light-dark(#fdfcff, #1b1b1f);
        --be-typed-ink: light-dark(#1b1b1f, #e5e1e6);
        --be-typed-muted: light-dark(#5c5b62, #a9a7ae);
        --be-typed-accent: light-dark(#565992, #c3c4ef);
        --be-typed-on-accent: light-dark(#ffffff, #1b1b1f);
        --be-typed-line: light-dark(#c7c5d0, #48464f);
        --be-typed-radius: 14px;
        --be-typed-field-radius: 8px;
        --be-typed-gap: 0.85rem;

        color-scheme: light dark;
        position: relative;
        box-sizing: border-box;
        inline-size: min(30rem, 92vw);
        padding: 1.5rem;
        border: none;
        border-radius: var(--be-typed-radius);
        background: var(--be-typed-surface);
        color: var(--be-typed-ink);
        box-shadow: 0 8px 24px -8px light-dark(rgb(0 0 0 / 0.28), rgb(0 0 0 / 0.6));
        font: 400 0.95rem/1.4 system-ui, sans-serif;
    }
    ${d}::backdrop { background: rgb(0 0 0 / 0.32); }

    ${d} form { display: flex; flex-direction: column; gap: var(--be-typed-gap); margin: 0; }
    ${d} label { display: flex; flex-direction: column; gap: 0.3rem; font-size: 0.8rem; color: var(--be-typed-muted); }
    ${d} label:has(> input[type="checkbox"]) { flex-direction: row; align-items: center; gap: 0.5rem; }

    ${d} :is(input, select) {
        box-sizing: border-box;
        inline-size: 100%;
        margin: 0;
        padding: 0.5rem 0.6rem;
        font: inherit;
        color: var(--be-typed-ink);
        background: var(--be-typed-surface);
        border: 1px solid var(--be-typed-line);
        border-radius: var(--be-typed-field-radius);
        transition: border-color 0.15s, box-shadow 0.15s;
    }
    ${d} :is(input, select):focus-visible {
        outline: none;
        border-color: var(--be-typed-accent);
        box-shadow: 0 0 0 3px color-mix(in srgb, var(--be-typed-accent) 30%, transparent);
    }
    ${d} input[type="checkbox"] {
        inline-size: 1.1rem;
        block-size: 1.1rem;
        padding: 0;
        accent-color: var(--be-typed-accent);
    }

    ${d} details { font-size: 0.8rem; color: var(--be-typed-muted); }
    ${d} summary { cursor: pointer; padding-block: 0.25rem; }

    ${d} .be-typed-actions { display: flex; justify-content: flex-end; gap: 0.5rem; margin-block-start: 0.5rem; }
    ${d} .be-typed-actions button {
        font: inherit;
        padding: 0.5rem 1.15rem;
        border: none;
        border-radius: 999px;
        color: var(--be-typed-accent);
        background: none;
        cursor: pointer;
    }
    ${d} .be-typed-actions button:hover { background: color-mix(in srgb, var(--be-typed-accent) 12%, transparent); }
    ${d} .be-typed-actions button[value="default"] { color: var(--be-typed-on-accent); background: var(--be-typed-accent); }
    ${d} .be-typed-actions button[value="default"]:hover { background: color-mix(in srgb, var(--be-typed-accent) 88%, black); }

    ${d} .be-typed-close {
        position: absolute;
        inset-block-start: 0.5rem;
        inset-inline-end: 0.5rem;
        inline-size: 1.75rem;
        block-size: 1.75rem;
        padding: 0;
        font: inherit;
        line-height: 1;
        color: var(--be-typed-muted);
        background: none;
        border: none;
        border-radius: 0.25rem;
        cursor: pointer;
    }
    ${d} .be-typed-close:hover { background: color-mix(in srgb, var(--be-typed-ink) 10%, transparent); }
}`;
    document.head.appendChild(style);
}
