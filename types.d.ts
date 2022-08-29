import {BeDecoratedProps, MinimalProxy} from 'be-decorated/types';

export interface BeTypedEndUserProps {
    triggerInsertPosition?: InsertPosition;
    labelTextContainer?: string;
    text?: string;
    beReformable?: boolean;
}

export interface BeTypedVirtualProps extends BeTypedEndUserProps, MinimalProxy{
}

export interface BeTypedProps extends BeTypedVirtualProps{
    proxy: HTMLLabelElement & BeTypedVirtualProps;
}

export interface BeTypedActions{
    batonPass(proxy: HTMLLabelElement & BeTypedVirtualProps, target: HTMLLabelElement, beDecorProps: BeDecoratedProps, baton: any): void;
    finale(proxy: HTMLLabelElement & BeTypedVirtualProps, target: HTMLLabelElement, beDecorProps: BeDecoratedProps): void;
    onTriggerInsertPosition(self: this): void;
    onText(self: this): void;
}