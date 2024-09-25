
export type IVolosLogDestination = 'server_to_client' | 'client_to_server'
export type IVolosLogStatus = 'success' | 'failed' | 'inprogress'
export type IVolosLogType = 'call' | 'reply'


export interface IVolosLog {
    id: number,
    name: string,
    type: IVolosLogType,
    destination: IVolosLogDestination,
    status?: IVolosLogStatus,
    start_time: number,
    end_time?: number,
    payload?: object | string | object[] | string[],
    response?: object | string | string[]
}
