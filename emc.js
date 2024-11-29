// @ts-check
import { BeHive, seed } from 'be-hive/be-hive.js';
import { MountObserver } from 'mount-observer/MountObserver.js';
/** @import {EMC} from './ts-refs/trans-render/be/types' */
/** @import {Actions, PAP, AllProps, AP} from './ts-refs/be-typed/types' */;

/**
 * @type {EMC<any, AP>}
 */
export const emc = {
    enhancedElementMatches: 'label',
    base: 'be-typed',
    enhPropKey: 'beTyped',
    map: {

    },
    importEnh: async () => {
        const {BeTyped}  = 
        /** @type {{new(): IEnhancement<Element>}} */ 
        /** @type {any} */
        (await import('./be-typed.js'));
        return BeTyped;
    }
};