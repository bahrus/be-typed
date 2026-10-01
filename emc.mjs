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
            // An action rather than a `when_triggerInsertPosition_changes_call_addTypeBtn` compact:
            // a compact only fires on a change, so it never fired when triggerInsertPosition was
            // assigned programmatically before roundabout finished initializing.
            addTypeBtn: {
                ifAllOf: ['triggerInsertPosition', 'enhancedElement']
            },
            setBtnContent: {
                ifAllOf: ['buttonContent', 'trigger'],
                ifNoneOf: ['byob']
            }
        },
        handlers: {
            trigger_to_openDialog_on: 'click'
        },
        // labelTextContainer is only read by the dialog (Typer.js), so no action references it.
        // It must be monitored explicitly, or a value set right after programmatic attachment
        // is overwritten by its default.
        propagate: ['labelTextContainer'],
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
