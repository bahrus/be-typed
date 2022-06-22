import {register} from 'be-hive/register.js';
import {define, BeDecoratedProps} from 'be-decorated/be-decorated.js';
import {BeTypedActions, BeTypedVirtualProps, BeTypedProps} from './types';
import {Typer, proxyPropDefaults} from './Typer.js';

export class BeTyped implements BeTypedActions{
    //#beDecorProps!: BeDecoratedProps;
    //#trigger: HTMLButtonElement | undefined;
    #typer!: Typer;
    intro(proxy: HTMLLabelElement & BeTypedVirtualProps, target: HTMLLabelElement, beDecorProps: BeDecoratedProps){
        //this.#beDecorProps = beDecorProps;
    }

    batonPass(proxy: HTMLLabelElement & BeTypedVirtualProps, target: HTMLLabelElement, beDecorProps: BeDecoratedProps<any, any>, baton: any): void {
        this.#typer = baton;
    }

    async onInsertPosition(self: this): Promise<void>{
        if(this.#typer === undefined){
            this.#typer = new Typer(self.proxy, self.proxy);
        }
        this.#typer.addTypeButtonTrigger(self);
    }

    onText(self: this): void {
        if(this.#typer === undefined){
            this.#typer = new Typer(self.proxy, self.proxy);
        }
        this.#typer.addTypeButtonTrigger(self);
    }

    finale(proxy: HTMLLabelElement & BeTypedVirtualProps, target: HTMLLabelElement, beDecorProps: BeDecoratedProps){
        if(this.#typer !== undefined){
            this.#typer.dispose();
        }
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
            virtualProps: ['insertPosition', 'text', 'then'],
            proxyPropDefaults,
            intro: 'intro',
            batonPass: 'batonPass',
            finale: 'finale'
        },
        actions:{
            onInsertPosition: 'insertPosition',
            onText: 'text',
        }
    },
    complexPropDefaults:{
        controller: BeTyped
    }
});
register(ifWantsToBe, upgrade, tagName);