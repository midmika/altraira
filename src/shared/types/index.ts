import type { IVehicleDto } from '../app/vehicle/VirtualVehicle';
import type { ICharacterDto } from '../app/character/VirtualCharacter';

export interface IAttachmentInfo {
    bone: number;
    offset: { x: number; y: number; z: number };
    rot: { x: number; y: number; z: number };
    useSoftPinning: boolean;
    collision: boolean;
    fixedRot: boolean;
}

export enum ESlot {
    main,
    secondary,
    med,
    armor,
}

export interface Constructor<T> {
    new (...args: any[]): T;
}

export type IAnyFunction = (...args: any[]) => any | Promise<any>;

export const hi = () => {};

export enum EVehicleMeta {
    DOOR_STATE = 'VEHICLE_DOOR_STATE',
    OWNER_TYPE = 'OWNER_TYPE',
    HANDLING = 'HANDLING',
    TYPE = 'TYPE',
    DTO = 'DTO',
}

export interface IFrontendSafeZone {
    x: number;
    y: number;
    width: number;
    height: number;
}

type Enumerate<N extends number, Acc extends number[] = []> = Acc['length'] extends N
    ? Acc[number]
    : Enumerate<N, [...Acc, Acc['length']]>;

export type IIntRange<F extends number, T extends number> = Exclude<Enumerate<T>, Enumerate<F>>;

export type IRGBA = [number, number, number, number];

export interface IInitialClientData {
    character: ICharacterDto;
}

export type IFrontendState = 'loading' | 'login' | 'hud';
export type ConstructorParameters<T> = T extends new (...args: infer P) => any ? P : never;
