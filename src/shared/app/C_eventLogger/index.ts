export type IEventLoggerLogDestination = 'server_to_client' | 'client_to_server'
export type IEventLoggerLogStatus = 'success' | 'failed' | 'inprogress'
export type IEventLoggerLogType = 'call' | 'reply'


export interface IEventLoggerLog {
    id: number,
    name: string,
    type: IEventLoggerLogType,
    destination: IEventLoggerLogDestination,
    status?: IEventLoggerLogStatus,
    start_time: number,
    end_time?: number,
    payload?: object | string | object[] | string[],
    response?: object | string | string[]
}
