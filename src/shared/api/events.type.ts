type Parameters<T extends (...args: any) => any> = T extends (...args: infer P) => any ? P : never;
export type EventParameters<
    IEventInterface extends Record<any, any>,
    IEventName extends keyof IEventInterface,
> = Parameters<IEventInterface[IEventName]>;

export interface IServerToClient {
    test(a: number, b: string): void
}

export interface IClientToServer {
    hiFromClient(a: number, b: string): void
}


//#region Static Declaration
export interface IServerEvents {
    on<K extends keyof IServerToClient>(eventName: K, listener: (...args: EventParameters<IServerToClient, K>) => void): void;
    once<K extends keyof IServerToClient>(eventName: K, listener: (...args: EventParameters<IServerToClient, K>) => void): void;
    off<K extends keyof IServerToClient>(eventName: K, listener: (...args: EventParameters<IServerToClient, K>) => void): void;
}
export interface IClientEvents {
    on<K extends keyof IClientToServer>(eventName: K, listener: (...args: EventParameters<IClientToServer, K>) => void): void;
    once<K extends keyof IClientToServer>(eventName: K, listener: (...args: EventParameters<IClientToServer, K>) => void): void;
    off<K extends keyof IClientToServer>(eventName: K, listener: (...args: EventParameters<IClientToServer, K>) => void): void;
}
//#endregion