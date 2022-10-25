import {BeDecoratedProps, MinimalProxy, EventConfigs} from 'be-decorated/types';

export interface EndUserProps {
    triggerInsertPosition?: InsertPosition;
    labelTextContainer?: string;
    buttonContent?: string;
    beReformable?: boolean;
}

export interface VirtualProps extends EndUserProps, MinimalProxy<HTMLLabelElement>{
    byob?: boolean;
}

export type Proxy = HTMLLabelElement & VirtualProps;

export interface ProxyProps extends VirtualProps{
    proxy: Proxy;
}

export type PP = ProxyProps;

export type PPP = Partial<ProxyProps>;

export type PPE = [Partial<PP>, EventConfigs<Proxy, Actions>];

export interface Actions{
    addTypingBtn(pp: PP): Promise<PPE | void>;
    setBtnContent(pp: PP): void;
    beTyped(pp: PP): void;
    finale(): void;
}

export interface ITyper{
    showDialog(): void;
    dispose(): void;
}