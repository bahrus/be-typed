import {BeDecoratedProps} from 'be-decorated/types';

export interface BeTypedVirtualProps {
    triggerInsertPosition?: InsertPosition;
    labelTextContainer?: string;
    text?: string;
    then?: string | any[] | any;
    beReformable?: boolean;
}

export interface BeTypedProps extends BeTypedVirtualProps{
    proxy: HTMLLabelElement & BeTypedVirtualProps;
}

export interface BeTypedActions{
    intro(proxy: HTMLLabelElement & BeTypedVirtualProps, target: HTMLLabelElement, beDecorProps: BeDecoratedProps): void;
    batonPass(proxy: HTMLLabelElement & BeTypedVirtualProps, target: HTMLLabelElement, beDecorProps: BeDecoratedProps, baton: any): void;
    finale(proxy: HTMLLabelElement & BeTypedVirtualProps, target: HTMLLabelElement, beDecorProps: BeDecoratedProps): void;
    onTriggerInsertPosition(self: this): void;
    onText(self: this): void;
}