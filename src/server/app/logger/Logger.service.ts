import { injectable } from 'inversify';
import { pino } from 'pino';
import pinoLoki from 'pino-loki';
import pretty from 'pino-pretty';
import { Character } from '@/app/character/Character';
import alt from 'alt-server';

@injectable()
export class Logger {
    private readonly _logger: pino.Logger;

    constructor() {

        const prettyStream = pretty({
            colorize: true,
        });

        const level = process.env.ALTAIRA_MODE === 'dev' ? 'trace' : 'debug';

        const multiStream = [{ stream: prettyStream, level: 'debug' }]

        // const lokiStream = this.getLokiIfDefined()
        // if(lokiStream) multiStream.push({ stream: lokiStream, level })

        this._logger = pino(
            { level },
            pino.multistream(multiStream),
        );

        alt.on('resourceError', (err: Error, file: string, line: number, stackTrace: string) => {
            this._logger.error({ err, file, line, stackTrace }, 'Internal');
        });

        process.on('unhandledRejection', (err: Error) => {
            this._logger.error({ err }, 'Node UnhandledRejection');
        });

        process.on('uncaughtException', (err: Error) => {
            this._logger.error({ err }, 'Node UncaughtException');
        });
    }

    plain(message: string, meta: any): void {
        this._logger.info(message, meta);
    }

    charAction(character: Character, action: string, meta: any): void {
        this._logger.info({ character_id: character.id, action, meta });
    }

    info() {
        this._logger.info('Привет мир! ' + new Date().toString());
    }

    request(requestLog: RequestLog): void {
        this._logger.trace({ trace: requestLog.eject() }, `Request`);
    }

    private getLokiIfDefined(): null | any {
        if(!process.env.LOKI_HOST || !process.env.LOKI_PORT) return null

        return pinoLoki({
            host: `http://${process.env.LOKI_HOST}:${process.env.LOKI_PORT}`,
            labels: { job: 'altv-server-dev-server' },
            interval: 1,
        });
    }
}

export class RequestLog {
    private abort_reason: string | Error | null = null;
    private is_ok: boolean | null = null;

    private start_timestamp: number = Date.now();
    private stop_timestamp: number | null = null;

    private is_normal_exception: boolean | null = null;

    private fetch_response: unknown;

    constructor(
        private readonly type: 'call' | 'fetch',
        private readonly char: Character | alt.Player,
        private readonly route: string,
        private readonly args: unknown[],
    ) {}

    ok(fetchResponse?: unknown): void {
        this.is_ok = true;
        this.fetch_response = fetchResponse;
        this.stop_timestamp = Date.now();
    }

    abort(reason: string | Error, isNormalException?: boolean): void {
        this.is_ok = false;
        this.abort_reason = reason;
        this.stop_timestamp = Date.now();
        this.is_normal_exception = isNormalException ?? false;
    }

    eject(): ILogRequest {
        const status: number = this.is_ok ? 200 : this.is_normal_exception ? 400 : 500;
        const execution_time = (this.stop_timestamp as number) - this.start_timestamp;

        return {
            type: this.type,
            route: this.route,
            status,
            execution_time,
            error: this.abort_reason as Error | string,
            args: this.args,
            res: this.fetch_response,
            character_id: this.char instanceof Character ? this.char.id : null,
        };
    }
}

interface ILogRequest {
    type: 'fetch' | 'call';
    route: string;
    status: number;
    execution_time: number;
    error: string | Error;
    args: unknown[];
    res?: unknown;
    character_id: number | null;
}

export enum ELoggerTitle {
    connection = 'connection',
}
