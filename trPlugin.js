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
        const typer = new Typer(target, defaults);
        typer.addTypeButtonTrigger(defaults);
        passTheBaton('typed', target, typer);
    }
};
register(trPlugin);
