import {BE, propDefaults, propInfo} from 'be-enhanced/BE.js';
import {BEConfig} from 'be-enhanced/types';
import {XE} from 'xtal-element/XE.js';
import {Actions, AllProps, AP, PAP, ProPAP, POA, ProPOA, ITyper} from './types';

export class BeTyped extends BE<AP, Actions, HTMLLabelElement> implements Actions{
    #trigger: HTMLButtonElement | undefined;
    async addTypingBtn(self: this){
        if(this.#trigger === undefined){
            //the check above is unlikely to ever fail.
            const {triggerInsertPosition, enhancedElement} = self;
            const {findAdjacentElement} = await import('be-enhanced/findAdjacentElement.js');
            const trigger = findAdjacentElement(triggerInsertPosition!, enhancedElement, 'button.be-typed-trigger');
            if(trigger !== null) this.#trigger = trigger as HTMLButtonElement;
            let byob = true;
            if(this.#trigger === undefined){
                byob = false;
                this.#trigger = document.createElement('button');
                this.#trigger.type = 'button';
                this.#trigger.classList.add('be-typed-trigger');
                this.#trigger.ariaLabel = 'Configure input.';
                this.#trigger.title = 'Configure input.';
                enhancedElement.insertAdjacentElement(triggerInsertPosition!, this.#trigger);
            }
            return [{resolved: true, byob}, {beTyped: {on: 'click', of: this.#trigger}}] as POA
        }else{
            //can't think of a scenario where consumer would want to change the trigger position midstream, so not bothering to do anything here
        }
    }

    #typer: ITyper | undefined;
    async beTyped(self: this) {
        if(this.#typer === undefined){
            const {enhancedElement} = self;
            const {Typer} = await import('./Typer.js');
            this.#typer = new Typer(enhancedElement, self);
            
        }
        this.#typer.showDialog();
        
    }

    setBtnContent({buttonContent}: this): void{
        if(this.#trigger !== undefined){
            this.#trigger.innerHTML = buttonContent!;//TODO:  sanitize
        }
    }

    override detach(detachedElement: HTMLLabelElement): void {
        super.detach(detachedElement);
        this.#trigger = undefined;
        if(this.#typer !== undefined){
            this.#typer.dispose();
        }
    }
}

export interface BeTyped extends AllProps{}

export const tagName = 'be-typed';


const xe = new XE<AP, Actions>({
    config: {
        tagName,
        propDefaults:{
            ...propDefaults,
            byob: true,
            triggerInsertPosition: 'beforeend',
            labelTextContainer: 'span',
            buttonContent: '&#x2699;'
        },
        propInfo:{
            ...propInfo
        },
        actions: {
            addTypingBtn: 'triggerInsertPosition',
            setBtnContent: {
                ifAllOf: ['buttonContent'],
                ifNoneOf: ['byob'],
            }
        }
    },
    superclass: BeTyped
});
