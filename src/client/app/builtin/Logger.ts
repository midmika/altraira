import * as alt from 'alt-client';
import { inject, injectable } from 'inversify';
import { Frontend } from '@/app/builtin/Frontend';

@injectable()
export class Logger implements ILogger {
    constructor(@inject(Frontend) private readonly frontend: Frontend) {}

    privateToString(...args: unknown[]): string {
        return (
            args
                .reduce((acc: string[], item: unknown): string[] => {
                    if (typeof item === 'string') {
                        acc.push(item);
                    } else if (Array.isArray(item)) {
                        acc.push('[' + item.map((i) => this.privateToString(i)).join(', ') + ']');
                    } else if (typeof item === 'function') {
                        acc.push(`Function<${item.name}>`);
                    } else if (typeof item === 'object') {
                        acc.push(JSON.stringify(item, null, 1));
                    } else {
                        acc.push(String(item));
                    }

                    return acc;
                }, [] as string[])
                // @ts-ignore
                .join(' ')
        );
    }

    info(...args: unknown[]): void {
        // ty AltV :D
        alt.log(args[0], ...args.slice(1));
        this.frontend.emit('weblogger', this.privateToString(...args));
    }

    warn(...args: unknown[]): void {
        alt.logWarning(args[0], ...args.slice(1));
        this.frontend.emit('weblogger', this.privateToString(...args));
    }

    error(...args: unknown[]): void {
        alt.logError(args[0], ...args.slice(1));
        this.frontend.emit('weblogger', this.privateToString(...args));
    }
}

export interface ILogger {
    info(...args: unknown[]): void;
    warn(...args: unknown[]): void;
    error(...args: unknown[]): void;
}
