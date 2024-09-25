/*
 * Генерация apiSchema для клиента/сервера, чтобы он знал куда стучать: emitRpc или emitServer
 * Оно работает, и спасибо :)
 *  */

export const prepareController = (...args: any): { rpcList: string[]; eventList } => {
    const [prefix, Controller] = args[0] as [string, any];

    const rpcList: Array<string> = Reflect.getMetadata('rpcs', Controller) ?? [];
    const eventList: Array<string> = Reflect.getMetadata('events', Controller) ?? [];

    return { rpcList, eventList };
};
