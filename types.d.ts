import {BeDecoratedProps} from 'be-decorated/types';

export interface BeTypedVirtualProps {

}

export interface BeTypedProps extends BeTypedVirtualProps{
    proxy: HTMLLabelElement & BeTypedVirtualProps;
}

export interface BeTypedActions{
    intro(proxy: HTMLLabelElement & BeTypedVirtualProps, target: HTMLLabelElement, beDecorProps: BeDecoratedProps): void;
}