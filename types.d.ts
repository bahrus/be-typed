import {BeDecoratedProps} from 'be-decorated/types';

export interface BeTypedVirtualProps {
    insertPosition?: InsertPosition;
    text?: string;
    then?: string | any[] | any;
}

export interface BeTypedProps extends BeTypedVirtualProps{
    proxy: HTMLLabelElement & BeTypedVirtualProps;
}

export interface BeTypedActions{
    intro(proxy: HTMLLabelElement & BeTypedVirtualProps, target: HTMLLabelElement, beDecorProps: BeDecoratedProps): void;
    batonPass(proxy: HTMLLabelElement & BeTypedVirtualProps, target: HTMLLabelElement, beDecorProps: BeDecoratedProps, baton: any): void;
    finale(proxy: HTMLLabelElement & BeTypedVirtualProps, target: HTMLLabelElement, beDecorProps: BeDecoratedProps): void;
    onInsertPosition(self: this): void;
    onText(self: this): void;
}