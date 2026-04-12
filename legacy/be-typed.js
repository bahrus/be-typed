// @ts-check
import { resolved, rejected, propInfo} from 'be-enhanced/cc.js';
import { BE } from 'be-enhanced/BE.js';
import {dispatchEvent as de} from 'trans-render/positractions/dispatchEvent.js';

/** @import {BEConfig, IEnhancement, BEAllProps} from './ts-refs/be-enhanced/types.d.ts' */
/** @import {Actions, PAP, AllProps, AP, BAP, ITyper} from './ts-refs/be-typed/types.d.ts' */;

/**
 * @implements {Actions}
 * 
 */
class BeTyped extends BE {
    /**
     * @type {BEConfig<BAP, Actions & IEnhancement>}
     */
    static config = {
        propDefaults:{
            byob: true,
            triggerInsertPosition: 'beforeend',
            labelTextContainer: 'span',
            buttonContent: '⚙️'
        },
        propInfo:{
            ...propInfo,
            trigger: {
                ro: true,
            }
        },
        positractions: [resolved, rejected],
        compacts:{
            when_triggerInsertPosition_changes_call_addTypeBtn: 0
        },
        actions:{
            setBtnContent: {
                ifAllOf: ['buttonContent'],
                ifNoneOf: ['byob']
            }
        },
        handlers:{
            trigger_to_openDialog_on: 'click'
        }
    }

    de = de;

    /**
     * 
     * @param {BAP} self 
     * @returns 
     */
    async addTypeBtn(self){
        let byob = true;
        const {triggerInsertPosition, enhancedElement} = self;
        const {findAdjacentElement} = await import('trans-render/lib/findAdjacentElement.js');
        let trigger = /** @type {HTMLButtonElement | null} */ (findAdjacentElement(triggerInsertPosition, enhancedElement, 'button.be-clonable-trigger'));
        if(trigger === null){
            byob = false;
            trigger = document.createElement('button');
            trigger.type = 'button';
            trigger.classList.add('be-typed-trigger');
            trigger.ariaLabel = 'Configure input.';
            trigger.title = 'Configure input.';
            enhancedElement.insertAdjacentElement(triggerInsertPosition, trigger);
        }
        return /** @type {PAP} */ ({
            trigger: new WeakRef(trigger),
            resolved: true,
            byob
        });
    }

    /**
     * 
     * @param {BAP} self 
     */
    setBtnContent(self){
        const {buttonContent, trigger} = self;
        const triggerEl = trigger.deref();
        if(triggerEl === undefined) return;
        //TODO: use trusted types
        triggerEl.textContent = buttonContent;
    }

    /**
     * @type {ITyper | undefined}
     */
    #typer;

    /**
     * 
     * @param {BAP} self 
     */
    async openDialog(self){
        if(this.#typer === undefined){
            const {enhancedElement} = self;
            const {Typer} = await import('./Typer.js');
            this.#typer = new Typer(enhancedElement, self);
            
        }
        this.#typer.showDialog();
    }

}

await BeTyped.bootUp();
export { BeTyped }