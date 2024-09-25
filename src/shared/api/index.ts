import type { IVehicleColor } from '../app/vehicle/AbstractVehicle';
import type { Character as CharacterServer } from '../../server/app/character/Character';

export type IClientApi = {
    start: IClientApiStartEvents;
};

export type IClientApiStartEvents = {
    event(message: string): void;
};

export type IClientApiStartFetch = {
    rpc(message: string): number;
};

export type IApiRoot<T> = {
    [key in keyof T]: {
        rpc: { [rpckey in keyof T[key]]: any };
        event: { [rpckey in keyof T[key]]: any };
    };
};

//#region
export type IApiAdminCommand = {
    veh(model: string, primaryColor?: IVehicleColor, secondaryColor?: IVehicleColor): Promise<void>;
};

// #endregion

export type IApiResponse<T> = {
    timestamp: number;
    error?: string;
    data: T;
};

export type IServerController<T> = {
    [K in keyof T]: T[K] extends (...args: infer A) => infer R
        ? (player: CharacterServer, ...args: A) => R | Awaited<R>
        : T[K];
};

export type IClientController<T> = {
    [K in keyof T]: T[K] extends (...args: infer A) => infer R ? (...args: A) => R | Awaited<R> : T[K];
};

export type IServerApiDeclaration = {
    // @ts-ignore
    [P in keyof IServerApi]: typeof P;
};

export type IClientApiDeclaration = {
    // @ts-ignore
    [P in keyof IClientApi]: typeof P;
};
