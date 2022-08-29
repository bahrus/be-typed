import { register } from 'trans-render/lib/pluginMgr.js';
import { proxyPropDefaults, Typer } from './Typer.js';
import { passTheBaton } from 'be-decorated/relay.js';
export const trPlugin = {
    selector: 'beTypedAttribs',
    ready: true,
    processor: async ({ target, val, attrib, host }) => {
        let defaults = { ...proxyPropDefaults };
        if (val) {
            const params = JSON.parse(val);
            Object.assign(defaults, params);
        }
        const cloner = new Typer(target, defaults);
        cloner.addTypeButtonTrigger(defaults);
        passTheBaton('typed', target, cloner);
    }
};
register(trPlugin);
