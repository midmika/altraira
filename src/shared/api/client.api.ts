import type { IServerApiRoot } from './server.api';

export interface IApiClientRoot {
    start: IApiClientStart;
    test: IApiClientTest;
}

export interface IApiClientStart {
    hello(message: string): void;
    world(data: string): string;
}

export interface IApiClientTest {
    hello(message: string): void;
    world(data: string): string;
}

export type KeyOf<T> = T extends object ? keyof T : never;
export type IClientApiNonVoidEvent<K extends KeyOf<IServerApiRoot>, M extends KeyOf<IServerApiRoot[K]>> =
    ReturnType<IServerApiRoot[K][M]> extends void ? never : `${K}.${M}`;

export type IClientApiVoidEvent<K extends KeyOf<IServerApiRoot>, M extends KeyOf<IServerApiRoot[K]>> =
    ReturnType<IServerApiRoot[K][M]> extends void ? `${K}.${M}` : never;
/*
    Root
 */
