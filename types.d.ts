import { ActionOnEventConfigs } from "trans-render/froop/types";
import {IBE} from 'be-enhanced/types';

export interface EndUserProps extends IBE<HTMLLabelElement> {
    triggerInsertPosition?: InsertPosition;
    labelTextContainer?: string;
    buttonContent?: string;
    beReformable?: boolean;
    nudge?: boolean;
}

export interface AllProps extends EndUserProps{
    byob?: boolean;
}

export type AP = AllProps;

export type PAP = Partial<AP>;

export type ProPAP = Promise<PAP>;

export type POA = [PAP | undefined, ActionOnEventConfigs<PAP, Actions>];

export type ProPOA = Promise<POA | undefined>;

export interface Actions{
    addTypingBtn(self: this): ProPOA;
    setBtnContent(self: this): void;
    beTyped(self: this): void;
    // finale(): void;
}

export interface ITyper{
    showDialog(): void;
    dispose(): void;
}