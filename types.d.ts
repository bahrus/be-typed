import {BeDecoratedProps, MinimalProxy} from 'be-decorated/types';

export interface EndUserProps {
    triggerInsertPosition?: InsertPosition;
    labelTextContainer?: string;
    text?: string;
    beReformable?: boolean;
}

export interface VirtualProps extends EndUserProps, MinimalProxy{
}

export type Proxy = HTMLLabelElement & VirtualProps;

export interface ProxyProps extends VirtualProps{
    proxy: Proxy;
}

export type PP = ProxyProps;

export interface Actions{
    batonPass(proxy: Proxy, target: HTMLLabelElement, beDecorProps: BeDecoratedProps, baton: any): void;
    finale(proxy: Proxy, target: HTMLLabelElement, beDecorProps: BeDecoratedProps): void;
    onTriggerInsertPosition(pp: PP): void;
    onText(pp: PP): void;
}