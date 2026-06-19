// @ts-check
/** @import {Actions, PAP, ProPAP, AllProps, AP} from './types/be-typed/types' */;
/** @import {RoundaboutOptions} from './types/roundabout/types' */;
/** @import {ElementEnhancementGateway, SpawnContext} from './types/assign-gingerly/types' */;
/** @import {EMC} from './types/mount-observer/types' */;
/** @import {RAConfig} from './types/roundabout/types' */;
/** @import {ITyper} from './types/be-typed/types' */;

/**
 * @implements {Actions}
 */
class BeTyped {

    /**
     * @this {AllProps & Actions}
     * @param {Element & ElementEnhancementGateway} enhancedElement 
     * @param {SpawnContext} ctx 
     * @param {PAP} initVals 
     */
    constructor(enhancedElement, ctx, initVals){
        this.init(this, enhancedElement, ctx, initVals);
    }

    /**
     * @param {AllProps} self 
     * @param {Element & ElementEnhancementGateway} enhancedElement 
     * @param {SpawnContext} ctx 
     * @param {PAP} initVals 
     */
    async init(self, enhancedElement, ctx, initVals){
        const {customData} = /** @type {EMC<any, AllProps, Element, RAConfig<AllProps, Actions>>} */ (ctx.emc);
        /**
         * @type {RoundaboutOptions}
         */
        const raOptions = {
            ...customData,
            vm: self,
            initialPropVals: {
                enhancedElement,
                ...customData?.defaultPropVals,
                ...initVals
            }
        };
        (await import('roundabout-lib/roundabout.js')).roundabout(raOptions);
    }

    /**
     * @param {AP} self 
     * @returns {ProPAP}
     */
    async addTypeBtn(self){
        let byob = true;
        const {triggerInsertPosition, enhancedElement} = self;
        const {findAdjacentElement} = await import('be-hive/findAdjacentElement.js');
        let trigger = /** @type {HTMLButtonElement | null} */ (findAdjacentElement(triggerInsertPosition, enhancedElement, 'button.be-typed-trigger'));
        if(trigger === null){
            byob = false;
            trigger = document.createElement('button');
            trigger.type = 'button';
            trigger.classList.add('be-typed-trigger');
            trigger.ariaLabel = 'Configure input.';
            trigger.title = 'Configure input.';
            enhancedElement.insertAdjacentElement(triggerInsertPosition, trigger);
        }
        return /** @type {PAP} */ ({
            trigger: new WeakRef(trigger),
            byob
        });
    }

    /**
     * @param {AP} self 
     */
    setBtnContent(self){
        const {buttonContent, trigger} = self;
        const triggerEl = trigger.deref();
        if(triggerEl === undefined) return;
        triggerEl.textContent = buttonContent;
    }

    /**
     * @type {ITyper | undefined}
     */
    #typer;

    /**
     * @param {AP} self 
     */
    async openDialog(self){
        if(this.#typer === undefined){
            const {enhancedElement} = self;
            const {Typer} = await import('./Typer.js');
            this.#typer = new Typer(enhancedElement, self);
            
        }
        this.#typer.showDialog();
    }

}

export { BeTyped }
