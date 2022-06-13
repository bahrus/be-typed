import {register} from 'be-hive/register.js';
import {define, BeDecoratedProps} from 'be-decorated/be-decorated.js';
import {BeTypedActions, BeTypedVirtualProps, BeTypedProps} from './types';

export class BeTyped implements BeTypedActions{
    intro(proxy: HTMLLabelElement & BeTypedVirtualProps, target: HTMLLabelElement, beDecorProps: BeDecoratedProps){
        const btn = document.createElement('button');
        btn.innerText = '⚙️';
        target.appendChild(btn);
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
            virtualProps: [],
            intro: 'intro'
        }
    },
    complexPropDefaults:{
        controller: BeTyped
    }
});
register(ifWantsToBe, upgrade, tagName);