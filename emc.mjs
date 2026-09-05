//@ts-check

/** @import {EMC} from './types/mount-observer/types' */;
/** @import {AllProps, Actions} from './types/be-typed/types' */
/** @import {RAConfig} from './types/roundabout/types' */

/**
 * @type {EMC<any, AllProps, Element, RAConfig<AllProps, Actions> >}
 */
export const emc = {
    enhConfig: {
        enhKey: 'beTyped',
        spawn: 'be-typed/be-typed.js',
        withAttrs: {
            base: 'be-typed',
            triggerInsertPosition: '${base}-trigger-insert-position',
            labelTextContainer: '${base}-label-text-container',
            buttonContent: '${base}-button-content',
            _nudge: {
                instanceOf: 'Boolean'
            }
        }
    },
    customData: {
        weakRef: {
            properties: ['enhancedElement', 'trigger']
        },
        actions: {
            setBtnContent: {
                ifAllOf: ['buttonContent'],
                ifNoneOf: ['byob']
            }
        },
        handlers: {
            trigger_to_openDialog_on: 'click'
        },
        compacts: {
            when_triggerInsertPosition_changes_call_addTypeBtn: 0
        },
        defaultPropVals: {
            byob: true,
            triggerInsertPosition: 'beforeend',
            labelTextContainer: 'span',
            buttonContent: '⚙️'
        }
    }
}

export function render(){
    return JSON.stringify(emc, null, 4);
}

console.log(render());
