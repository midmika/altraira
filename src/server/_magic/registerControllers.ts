import alt from 'alt-server';
import { serverApiList } from '@/_magic/apiList';
import injector from '@/_magic/inversify.config';
import type { Character } from '@/app/character/Character';
import { Exception } from '@/error/Error';
import { Logger, RequestLog } from '@/app/logger/Logger.service';

export const registerControllers = () => {
    const controllers = serverApiList();

    const logger: Logger = injector.get(Logger);

    console.log(`Registered Server Api`);

    Object.entries(controllers).forEach((_) => {
        const classConstructor: any = _[1];

        injector.bind(classConstructor).toSelf().inSingletonScope();
        const controllerInstance = injector.get(classConstructor);
        if (!controllerInstance) throw new Error(`${classConstructor} is not registered in injector`);

        const rpcList: Array<string> = Reflect.getMetadata('rpcs', classConstructor) ?? [];
        const eventList: Array<string> = Reflect.getMetadata('events', classConstructor) ?? [];
        const dont_check_character_methods_list: string =
            Reflect.getMetadata('dont_check_character', classConstructor) ?? [];

        const prefix: string = Reflect.getMetadata('prefix', classConstructor);

        console.log(`[${prefix}]`);

        rpcList.forEach((route: string) => {
            console.log(' > ' + route);
            const fullRoute = prefix + ':' + route;

            alt.onRpc(fullRoute, (player: alt.Player, ...args: unknown[]): any => {
                return new Promise((resolve) => {
                    const char: Character | undefined = player.$;
                    const requestLog = new RequestLog('fetch', char ?? player, route, args);

                    if (!dont_check_character_methods_list.includes(route) && !char) {
                        requestLog.abort('Not authorized');
                        resolve({
                            timestamp: performance.now(),
                            error: 'UNAUTHORIZED',
                        });
                        logger.request(requestLog);
                        return;
                    }

                    const startArgs = [];

                    if (!dont_check_character_methods_list.includes(route)) {
                        startArgs.push(char);
                    } else {
                        startArgs.push(player);
                    }

                    // @ts-ignore
                    if (controllerInstance[route].constructor.name == 'AsyncFunction') {
                        // @ts-ignore
                        controllerInstance[route](...startArgs, ...args)
                            .then((data: any) => {
                                resolve({
                                    timestamp: performance.now(),
                                    data,
                                });
                                requestLog.ok(data);
                                logger.request(requestLog);
                            })
                            .catch((error: any) => {
                                resolve({
                                    timestamp: performance.now(),
                                    error: error instanceof Exception ? error.message : 'something went wrong',
                                });
                                requestLog.abort(error, error instanceof Exception);
                                logger.request(requestLog);
                            });
                    } else {
                        try {
                            // @ts-ignore
                            const data = controllerInstance[route](...startArgs, ...args);
                            resolve({
                                timestamp: performance.now(),
                                data,
                            });
                            requestLog.ok(data);
                            logger.request(requestLog);
                        } catch (error) {
                            resolve({
                                timestamp: performance.now(),
                                error: error instanceof Exception ? error.message : 'something went wrong',
                            });
                            requestLog.abort(error, error instanceof Exception);
                            logger.request(requestLog);
                        }
                    }
                });
            });
        });

        eventList.forEach((route: string) => {
            console.log(' > ' + route);
            const fullRoute = prefix + ':' + route;

            alt.onClient(fullRoute, (player: alt.Player, ...args: unknown[]): any => {
                const char: Character | undefined = player.$;
                const requestLog = new RequestLog('call', char, route, args);

                if (!dont_check_character_methods_list.includes(route) && !char) {
                    requestLog.abort('Not authorized');
                    logger.request(requestLog);
                    return;
                }

                const startArgs = [];

                if (!dont_check_character_methods_list.includes(route)) {
                    startArgs.push(char);
                } else {
                    startArgs.push(player);
                }

                // @ts-ignore
                if (controllerInstance[route].constructor.name == 'AsyncFunction') {
                    // @ts-ignore
                    controllerInstance[route](...startArgs, ...args)
                        .then(() => {
                            requestLog.ok();
                        })
                        .catch((error: any) => {
                            requestLog.abort(error, error instanceof Exception);
                        });
                } else {
                    try {
                        // @ts-ignore
                        controllerInstance[route](...startArgs, ...args);
                        requestLog.ok();
                    } catch (error) {
                        requestLog.abort(error, error instanceof Exception);
                    }
                }

                logger.request(requestLog);
            });
        });
    });
};
