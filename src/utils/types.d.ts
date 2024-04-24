import { UUID } from 'crypto';
import { ElementType } from './ElementType';
import {
    Battery,
    BusBar,
    DanglingLine,
    Generator,
    Hvdc,
    LCC,
    Line,
    Load,
    ShuntCompensator,
    Substation,
    SVC,
    ThreeWindingTransfo,
    TwoWindingTransfo,
    VoltageLevel,
    VSC,
} from '../components/filter/constants/equipment-types.ts';

export type Input = string | number;

export type ElementAttributes = {
    elementUuid: UUID;
    elementName: string;
    type: keyof typeof ElementType;
};

export type Equipment =
    | typeof Substation
    | typeof Line
    | typeof Generator
    | typeof Load
    | typeof Battery
    | typeof SVC
    | typeof DanglingLine
    | typeof LCC
    | typeof VSC
    | typeof Hvdc
    | typeof BusBar
    | typeof TwoWindingTransfo
    | typeof ThreeWindingTransfo
    | typeof ShuntCompensator
    | typeof VoltageLevel
    | typeof Substation;

export type EquipmentType = {
    [Type in Equipment['type']]: Type;
}[Equipment['type']];

export type Option =
    | {
          id: string;
          label: string;
      }
    | string;

export type PredefinedProperties = {
    [propertyName: string]: string[];
};
