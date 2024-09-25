export type IApiClientFetch = (evenName: string, ...args: any[]) => Promise<void>;

export type IApiEventOnCb = (...args: any[]) => unknown | Promise<unknown>;
export type IApiClientOn = (evenName: string, cb: IApiEventOnCb) => void;
export type IApiClientOff = (evenName: string, cb: IApiEventOnCb) => void;

export interface APIStart {
    start: APIStart;
}

export interface APIStart {
    hello(message: string): void;
    world(data: string): void;
}

type FunctionArguments<T> = T extends (...args: infer A) => any ? A : never;
type EventMap<T> = {
    [K in keyof T]: T[K] extends Function ? [`${string & K}`, ...FunctionArguments<T[K]>] : never;
}[keyof T];

type APIEvents<T> = {
    [K in keyof T]: EventMap<T[K]>;
}[keyof T] extends infer U
    ? { [K in U[0]]: U extends [K, ...infer A] ? A : never }
    : never;

type StartEvents = APIEvents<API>;
