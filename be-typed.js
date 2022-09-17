import { register } from 'be-hive/register.js';
import { define } from 'be-decorated/be-decorated.js';
import { Typer, proxyPropDefaults } from './Typer.js';
export class BeTyped extends EventTarget {
    #typer;
    batonPass(proxy, target, beDecorProps, baton) {
        this.#typer = baton;
    }
    async onTriggerInsertPosition(self) {
        if (this.#typer === undefined) {
            this.#typer = new Typer(self.proxy, self.proxy);
        }
        this.#typer.addTypeButtonTrigger(self);
    }
    async onText(pp) {
        const { proxy } = pp;
        if (this.#typer === undefined) {
            this.#typer = new Typer(proxy, proxy);
        }
        await this.#typer.addTypeButtonTrigger(pp);
        proxy.resolved = true;
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
            virtualProps: ['triggerInsertPosition', 'text', 'beReformable', 'labelTextContainer'],
            proxyPropDefaults,
            batonPass: 'batonPass',
            finale: 'finale',
        },
        actions: {
            onTriggerInsertPosition: 'triggerInsertPosition',
            onText: 'text',
        }
    },
    complexPropDefaults: {
        controller: BeTyped
    }
});
register(ifWantsToBe, upgrade, tagName);
