import {register} from 'be-hive/register.js';
import {define, BeDecoratedProps} from 'be-decorated/be-decorated.js';
import {BeTypedActions, BeTypedVirtualProps, BeTypedProps} from './types';
import {Typer, proxyPropDefaults} from './Typer.js';

export class BeTyped extends EventTarget implements BeTypedActions{
    //#beDecorProps!: BeDecoratedProps;
    //#trigger: HTMLButtonElement | undefined;
    #typer!: Typer;

    batonPass(proxy: HTMLLabelElement & BeTypedVirtualProps, target: HTMLLabelElement, beDecorProps: BeDecoratedProps<any, any>, baton: any): void {
        this.#typer = baton;
    }

    async onTriggerInsertPosition(self: this): Promise<void>{
        if(this.#typer === undefined){
            this.#typer = new Typer(self.proxy, self.proxy);
        }
        this.#typer.addTypeButtonTrigger(self);
    }

    async onText({proxy}: this) {
        if(this.#typer === undefined){
            this.#typer = new Typer(proxy, proxy);
        }
        await this.#typer.addTypeButtonTrigger(this);
        proxy.resolved = true
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
            virtualProps: ['triggerInsertPosition', 'text', 'beReformable', 'labelTextContainer'],
            proxyPropDefaults,
            batonPass: 'batonPass',
            finale: 'finale',
            
        },
        actions:{
            onTriggerInsertPosition: 'triggerInsertPosition',
            onText: 'text',
        }
    },
    complexPropDefaults:{
        controller: BeTyped
    }
});
register(ifWantsToBe, upgrade, tagName);