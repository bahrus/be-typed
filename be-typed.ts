import {register} from 'be-hive/register.js';
import {define, BeDecoratedProps} from 'be-decorated/be-decorated.js';
import {Actions, VirtualProps, Proxy, PP} from './types';
import {Typer, proxyPropDefaults} from './Typer.js';

export class BeTyped extends EventTarget implements Actions{
    #typer!: Typer;

    batonPass(proxy: Proxy, target: HTMLLabelElement, beDecorProps: BeDecoratedProps<any, any>, baton: any): void {
        this.#typer = baton;
    }

    async onTriggerInsertPosition(self: PP){
        if(this.#typer === undefined){
            this.#typer = new Typer(self.proxy, self.proxy);
        }
        this.#typer.addTypeButtonTrigger(self);
    }

    async onText(pp: PP) {
        const {proxy} = pp
        if(this.#typer === undefined){
            this.#typer = new Typer(proxy, proxy);
        }
        await this.#typer.addTypeButtonTrigger(pp);
        proxy.resolved = true
    }

    finale(proxy: Proxy, target: HTMLLabelElement, beDecorProps: BeDecoratedProps){
        if(this.#typer !== undefined){
            this.#typer.dispose();
        }
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