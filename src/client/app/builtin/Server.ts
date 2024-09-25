import type { EventParameters, IServerToClient } from '@shared/api/events.type';
import alt from 'alt-client';
import type { IApiResponse } from '@shared/api';
import { inject, injectable } from 'inversify';
import { EventLogger } from '@/app/builtin/EventLogger';
import { Logger } from '@/app/builtin/Logger';
import type { IAnyFunction } from '@shared/types';

type EventHandler<T extends unknown[]> = (...args: T) => void;

@injectable()
export class Server {
    private readonly events: Record<string, EventHandler<unknown[]>[]> = {};

    constructor(
        @inject(EventLogger) private readonly eventLogger: EventLogger,
        @inject(Logger) private readonly logger: Logger,
    ) {}

    public listen(): void {}

    call(event: string, ...args: any[]): void {
        try {
            alt.emitServer(event, ...args);
            this.eventLogger.emit({
                type: 'call',
                name: event,
                destination: 'client_to_server',
                payload: args,
            });
        } catch (error) {
            this.logger.error(`[Call] Unexpected error:`, error);
        }
    }

    async fetch<T>(event: string, ...args: any[]): Promise<T> {
        return new Promise((resolve, reject) => {
            const eventLoggerId: number = this.eventLogger.emit({
                type: 'reply',
                name: event,
                destination: 'client_to_server',
                payload: args,
            });

            const onFail = (error: Error): void => {
                reject(error);
                this.eventLogger.update(eventLoggerId, {
                    response: error?.message ?? error?.toString() ?? 'Unknown error',
                    status: 'failed',
                });
            };

            const onSuccess = (data: IApiResponse<T>): void => {
                if (data.error) {
                    reject(new Error(data.error));
                    this.eventLogger.update(eventLoggerId, {
                        response: data.error,
                        status: 'failed',
                    });
                } else {
                    resolve(data.data);
                    this.eventLogger.update(eventLoggerId, {
                        response: data,
                        status: 'success',
                    });
                }
            };

            alt.emitRpc(event, ...args)
                .then(onSuccess)
                .catch(onFail);
        });
    }

    emit(eventName: string, ...args: any[]): void {
        try {
            this.eventLogger.emit({
                type: 'call',
                name: eventName,
                destination: 'client_to_server',
                payload: args,
            });
            alt.emitServer(eventName, ...args);
        } catch (error: any) {
            this.logger.error(`onServer [${eventName}] handler error:`, error.message, error.stack);
        }
    }

    // on<K extends keyof IServerToClient>(
    //     eventName: K,
    //     listener: (...args: EventParameters<IServerToClient, K>) => void,
    // ): void {
    //     if (!this.events[eventName]) {
    //         this.events[eventName] = [];
    //     }
    //     // @ts-ignore
    //     this.events[eventName].push(listener);
    // }
    //
    // once<K extends keyof (IServerToClient | '__initial')>(
    //     eventName: K,
    //     listener: (...args: EventParameters<IServerToClient, K>) => void,
    // ): void {
    //     const onceListener = (...args: unknown[]) => {
    //         this.off(eventName, onceListener);
    //         // @ts-ignore
    //         listener(...args);
    //     };
    //     this.on(eventName, onceListener);
    // }
    //
    // off<K extends keyof IServerToClient>(
    //     eventName: K,
    //     listener: (...args: EventParameters<IServerToClient, K>) => void,
    // ): void {
    //     if (!this.events[eventName]) {
    //         return;
    //     }
    //     // @ts-ignore
    //     const index: number = this.events[eventName].indexOf(listener);
    //     if (index !== -1) {
    //         this.events[eventName].splice(index, 1);
    //     }
    // }

    private emitLocal(eventName: string, ...args: unknown[]): void {
        alt.log(eventName, ...args);
        if (!this.events[eventName]) {
            return;
        }
        this.events[eventName].forEach((listener: IAnyFunction): void => {
            try {
                void listener(...args);
            } catch (error: any) {
                this.logger.error(`onServer [${eventName}] handler error:`, error.message, error.stack);
            }
        });
    }
}
