import { register } from 'be-hive/register.js';
import { define } from 'be-decorated/be-decorated.js';
import { Typer, proxyPropDefaults } from './Typer.js';
export class BeTyped {
    //#beDecorProps!: BeDecoratedProps;
    //#trigger: HTMLButtonElement | undefined;
    #typer;
    intro(proxy, target, beDecorProps) {
        //this.#beDecorProps = beDecorProps;
    }
    batonPass(proxy, target, beDecorProps, baton) {
        this.#typer = baton;
    }
    async onInsertPosition(self) {
        if (this.#typer === undefined) {
            this.#typer = new Typer(self.proxy, self.proxy);
        }
        this.#typer.addTypeButtonTrigger(self);
    }
    onText(self) {
        if (this.#typer === undefined) {
            this.#typer = new Typer(self.proxy, self.proxy);
        }
        this.#typer.addTypeButtonTrigger(self);
    }
    finale(proxy, target, beDecorProps) {
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
            virtualProps: ['insertPosition', 'text', 'then'],
            proxyPropDefaults,
            intro: 'intro',
            batonPass: 'batonPass',
            finale: 'finale'
        },
        actions: {
            onInsertPosition: 'insertPosition',
            onText: 'text',
        }
    },
    complexPropDefaults: {
        controller: BeTyped
    }
});
register(ifWantsToBe, upgrade, tagName);
