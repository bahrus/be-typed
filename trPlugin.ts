import {RenderContext, TransformPluginSettings} from 'trans-render/lib/types';
import {register} from 'trans-render/lib/pluginMgr.js';
import {BeTypedVirtualProps} from './types';
import {proxyPropDefaults, Typer} from './Typer.js';
import {passTheBaton} from 'be-decorated/relay.js';

export const trPlugin: TransformPluginSettings = {
    selector: 'beTypedAttribs',
    ready: true,
    processor:  async ({target, val, attrib, host}: RenderContext) => {
        let defaults = {...proxyPropDefaults};
        if(val){
            const params = JSON.parse(val) as BeTypedVirtualProps;
            Object.assign(defaults, params);
        }
        const cloner = new Typer(target! as HTMLLabelElement, defaults);
        cloner.addTypeButtonTrigger(defaults);
        passTheBaton('typed', target!, cloner);
    }
}

register(trPlugin);