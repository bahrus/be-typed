import { register } from 'trans-render/lib/pluginMgr.js';
export const trPlugin = {
    selector: 'beTypedAttribs',
    ready: true,
    processor: async ({ target, val, attrib, host }) => {
        if (customElements.get('be-typed') === undefined)
            return;
        const { attach } = await import('be-decorated/upgrade.js');
        const instance = document.createElement('be-typed');
        attach(target, 'typed', instance.attach.bind(instance));
    }
};
register(trPlugin);
