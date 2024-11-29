// @ts-check
import { resolved, rejected, propInfo} from 'be-enhanced/cc.js';
import { BE } from 'be-enhanced/BE.js';
import {dispatchEvent as de} from 'trans-render/positractions/dispatchEvent.js';

/** @import {BEConfig, IEnhancement, BEAllProps} from './ts-refs/be-enhanced/types.d.ts' */
/** @import {Actions, PAP, AllProps, AP, BAP, ITyper} from './ts-refs/be-typed/types.d.ts' */;

/**
 * @implements {Actions}
 * @implements {EventListenerObject}
 * 
 */
class BeTyped extends BE {
    /**
     * @type {BEConfig<BAP, Actions & IEnhancement, any>}
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
        },
        positractions: [resolved, rejected],
        compacts:{
            when_triggerInsertPosition_changes_invoke_hydrate: 0
        },
        actions:{
            setBtnContent: {
                ifAllOf: ['buttonContent'],
                ifNoneOf: ['byob']
            }
        }
    }
    /**
     * @type {WeakRef<HTMLButtonElement> | undefined}
     */
    #triggerRef;
    de = de;
    /**
     * @type {AbortController | undefined}
     */
    #ac;
    /**
     * 
     * @param {BAP} self 
     * @returns 
     */
    async hydrate(self){
        let byob = true;
        if(this.#triggerRef?.deref() === undefined){
            //the check above is unlikely to ever fail.
            const {triggerInsertPosition, enhancedElement} = self;
            const {findAdjacentElement} = await import('trans-render/lib/findAdjacentElement.js');
            
            const trigger = /** @type {HTMLButtonElement}*/ (findAdjacentElement(triggerInsertPosition, enhancedElement, 'button.be-typed-trigger'));
            if(trigger !== null) this.#triggerRef = new WeakRef(trigger);
            if(this.#triggerRef === undefined){
                byob = false;
                const newTrigger = document.createElement('button');
                newTrigger.type = 'button';
                newTrigger.classList.add('be-typed-trigger');
                newTrigger.ariaLabel = 'Configure input.';
                newTrigger.title = 'Configure input.';
                enhancedElement.insertAdjacentElement(triggerInsertPosition, newTrigger);
                this.#triggerRef = new WeakRef(newTrigger);
            }
        }else{
            //can't think of a scenario where consumer would want to change the trigger position midstream, so not bothering to do anything here
        }
        if(this.#ac !== undefined){
            this.#ac.abort();
        }
        this.#ac = new AbortController();
        this.#triggerRef?.deref()?.addEventListener('click', this, {signal: this.#ac.signal});
        return /** @type {PAP} */ ({
            resolved: true,
            byob
        });
    }

    /**
     * 
     * @param {BAP} self 
     */
    setBtnContent(self){
        const {buttonContent} = self;
        const trigger = this.#triggerRef?.deref();
        if(trigger === undefined) return;
        //TODO: use trusted types
        trigger.textContent = buttonContent;
    }

    /**
     * @type {ITyper | undefined}
     */
    #typer;
    async handleEvent(){
        const self = /** @type {BAP} */ /** @type {any} */(this);
        if(this.#typer === undefined){
            const {enhancedElement} = self;
            const {Typer} = await import('./Typer.js');
            this.#typer = new Typer(enhancedElement, self);
            
        }
        this.#typer.showDialog();
    }

    async detach(el){
        if(this.#ac !== undefined){
            this.#ac.abort();
        }
        super.detach(el);
    }
}

await BeTyped.bootUp();
export { BeTyped }