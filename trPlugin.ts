import {RenderContext, TransformPluginSettings} from 'trans-render/lib/types';
import {register} from 'trans-render/lib/pluginMgr.js';
import {VirtualProps, EndUserProps, Proxy} from './types';
import {proxyPropDefaults, Typer} from './Typer.js';
import {passTheBaton} from 'be-decorated/relay.js';

export const trPlugin: TransformPluginSettings = {
    selector: 'beTypedAttribs',
    ready: true,
    processor:  async ({target, val, attrib, host}: RenderContext) => {
        let defaults = {...proxyPropDefaults} as EndUserProps;
        if(val){
            const params = JSON.parse(val) as VirtualProps;
            Object.assign(defaults, params);
        }
        const typer = new Typer(target! as HTMLLabelElement, defaults);
        typer.addTypeButtonTrigger(defaults);
        passTheBaton('typed', target!, typer);
    }
}

register(trPlugin);