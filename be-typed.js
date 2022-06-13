import { register } from 'be-hive/register.js';
import { define } from 'be-decorated/be-decorated.js';
export class BeTyped {
    intro(proxy, target, beDecorProps) {
        const btn = document.createElement('button');
        btn.innerText = '⚙️';
        target.appendChild(btn);
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
            virtualProps: [],
            intro: 'intro'
        }
    },
    complexPropDefaults: {
        controller: BeTyped
    }
});
register(ifWantsToBe, upgrade, tagName);
