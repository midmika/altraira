import type { IClientApi } from '@shared/api';
import * as alt from 'alt-client';
import { clientApiList } from '@/apiList';
import injector from '@/_magic/inversify.config';

export const registerControllers = (): void => {
    const controllers: IClientApi = clientApiList();

    Object.entries(controllers).forEach((_) => {
        const classConstructor: any = _[1];

        injector.bind(classConstructor).toSelf().inSingletonScope();
        const controllerInstance = injector.get(classConstructor);
        if (!controllerInstance) throw new Error(`${classConstructor} is not registered in injector`);

        const rpcList: Array<string> = Reflect.getMetadata('rpcs', classConstructor) ?? [];
        const eventList: Array<string> = Reflect.getMetadata('events', classConstructor) ?? [];
        const prefix: string = Reflect.getMetadata('prefix', classConstructor);

        alt.log(`[${prefix}]`);

        rpcList.forEach((route: string) => {
            alt.log(' > ' + route);
            const fullRoute = prefix + ':' + route;

            alt.onRpc(fullRoute, (...args: unknown[]): any => {
                return new Promise((resolve) => {
                    // @ts-ignore
                    if (controllerInstance[route].constructor.name == 'AsyncFunction') {
                        // @ts-ignore
                        controllerInstance[route](...args)
                            .then((data: any) => {
                                resolve({
                                    timestamp: performance.now(),
                                    data,
                                });
                            })
                            .catch((error: any) => {
                                alt.logError(`Failed to execute [${route}]`, error);
                                resolve({
                                    timestamp: performance.now(),
                                    error: 'something went wrong',
                                });
                            });
                    } else {
                        try {
                            // @ts-ignore
                            controllerInstance[route](...args);
                        } catch (error) {
                            alt.logError(`Failed to execute [${route}]`, error);
                            resolve({
                                timestamp: performance.now(),
                                error: 'something went wrong',
                            });
                        }
                    }
                });
            });
        });

        eventList.forEach((route: string) => {
            alt.log(' > ' + route);
            const fullRoute = prefix + ':' + route;

            alt.onServer(fullRoute, (...args: unknown[]): any => {
                alt.log('args:', args);
                // @ts-ignore
                if (controllerInstance[route].constructor.name == 'AsyncFunction') {
                    // @ts-ignore
                    controllerInstance[route](...args).catch((error: any) => {
                        alt.logError(`Failed to execute [${route}]}`, error);
                    });
                } else {
                    try {
                        // @ts-ignore
                        controllerInstance[route](...args);
                    } catch (error) {
                        alt.logError(`Failed to execute [${route}]`, error);
                    }
                }
            });
        });
    });

    alt.log('Server API Events Registered');
};
