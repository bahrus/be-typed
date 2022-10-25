import { register } from 'be-hive/register.js';
import { define } from 'be-decorated/DE.js';
export class BeTyped extends EventTarget {
    #trigger;
    async addTypingBtn(pp) {
        if (this.#trigger === undefined) {
            //the check above is unlikely to ever fail.
            const { triggerInsertPosition, self } = pp;
            const { findAdjacentElement } = await import('be-decorated/findAdjacentElement.js');
            const trigger = findAdjacentElement(triggerInsertPosition, self, 'button.be-typed-trigger');
            if (trigger !== null)
                this.#trigger = trigger;
            let byob = true;
            if (this.#trigger === undefined) {
                byob = false;
                this.#trigger = document.createElement('button');
                this.#trigger.type = 'button';
                this.#trigger.classList.add('be-typed-trigger');
                this.#trigger.ariaLabel = 'Configure input.';
                this.#trigger.title = 'Configure input.';
                self.insertAdjacentElement(triggerInsertPosition, this.#trigger);
            }
            return [{ resolved: true, byob }, { beTyped: { on: 'click', of: this.#trigger } }];
        }
        else {
            //can't think of a scenario where consumer would want to change the trigger position midstream, so not bothering to do anything here
        }
    }
    setBtnContent({ buttonContent }) {
        if (this.#trigger !== undefined) {
            this.#trigger.innerHTML = buttonContent; //TODO:  sanitize
        }
    }
    #typer;
    async beTyped(pp) {
        if (this.#typer === undefined) {
            const { self } = pp;
            const { Typer } = await import('./Typer.js');
            this.#typer = new Typer(self, pp);
        }
        this.#typer.showDialog();
    }
    finale() {
        this.#trigger = undefined;
        if (this.#typer !== undefined) {
            this.#typer.dispose();
        }
    }
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
            virtualProps: ['triggerInsertPosition', 'buttonContent', 'beReformable', 'labelTextContainer', 'byob'],
            proxyPropDefaults: {
                byob: true,
                triggerInsertPosition: 'beforeend',
                labelTextContainer: 'span',
                buttonContent: '&#x2699;'
            },
            finale: 'finale',
        },
        actions: {
            addTypingBtn: 'triggerInsertPosition',
            setBtnContent: {
                ifAllOf: ['buttonContent'],
                ifNoneOf: ['byob'],
            }
        }
    },
    complexPropDefaults: {
        controller: BeTyped
    }
});
register(ifWantsToBe, upgrade, tagName);
