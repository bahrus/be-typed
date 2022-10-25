import {register} from 'be-hive/register.js';
import {define, BeDecoratedProps} from 'be-decorated/DE.js';
import {Actions, PP, PPE, VirtualProps, Proxy, ProxyProps, ITyper} from './types';

export class BeTyped extends EventTarget implements Actions{
    #trigger: HTMLButtonElement | undefined;

    async addTypingBtn(pp: PP){
        if(this.#trigger === undefined){
            //the check above is unlikely to ever fail.
            const {triggerInsertPosition, self} = pp;
            const {findAdjacentElement} = await import('be-decorated/findAdjacentElement.js');
            const trigger = findAdjacentElement(triggerInsertPosition!, self, 'button.be-typed-trigger');
            if(trigger !== null) this.#trigger = trigger as HTMLButtonElement;
            let byob = true;
            if(this.#trigger === undefined){
                byob = false;
                this.#trigger = document.createElement('button');
                this.#trigger.type = 'button';
                this.#trigger.classList.add('be-typed-trigger');
                this.#trigger.ariaLabel = 'Configure input.';
                this.#trigger.title = 'Configure input.';
                self.insertAdjacentElement(triggerInsertPosition!, this.#trigger);
            }
            return [{resolved: true, byob}, {beTyped: {on: 'click', of: this.#trigger}}] as PPE
        }else{
            //can't think of a scenario where consumer would want to change the trigger position midstream, so not bothering to do anything here
        }
    }

    setBtnContent({buttonContent}: PP): void{
        if(this.#trigger !== undefined){
            this.#trigger.innerHTML = buttonContent!;//TODO:  sanitize
        }
    }

    #typer: ITyper | undefined;
    async beTyped(pp: PP) {
        if(this.#typer === undefined){
            const {self} = pp;
            const {Typer} = await import('./Typer.js');
            this.#typer = new Typer(self, pp);
            
        }
        this.#typer.showDialog();
        
    }

    finale(){
        this.#trigger = undefined;
    }
}

const tagName = 'be-typed';

const ifWantsToBe = 'typed';

const upgrade = 'label';

define<Proxy & BeDecoratedProps<Proxy, Actions>, Actions>({
    config:{
        tagName,
        propDefaults:{
            upgrade,
            ifWantsToBe,
            virtualProps: ['triggerInsertPosition', 'buttonContent', 'beReformable', 'labelTextContainer', 'byob'],
            proxyPropDefaults:{
                byob: true,
                triggerInsertPosition: 'beforeend',
                labelTextContainer:'span',
                buttonContent: '&#x2699;'
            },
            finale: 'finale',
            
        },
        actions:{
            addTypingBtn: 'triggerInsertPosition',
            setBtnContent: {
                ifAllOf: ['buttonContent'],
                ifNoneOf: ['byob'],
            }
        }
    },
    complexPropDefaults:{
        controller: BeTyped
    }
});
register(ifWantsToBe, upgrade, tagName);