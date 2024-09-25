import { inject, injectable } from 'inversify';
import * as alt from 'alt-client';
import type { EKeyCode } from '@/types/EKeyCode';
import type { IAnyFunction } from '@shared/types';
import { Logger } from '@/app/builtin/Logger';

interface IListener {
    cb: IAnyFunction;
    group?: string;
}

@injectable()
export class KeyResolver {
    private readonly pressedKeys: Set<EKeyCode> = new Set<EKeyCode>();
    private readonly onceListeners: Map<EKeyCode, IListener[]> = new Map<EKeyCode, IListener[]>();
    private readonly onListeners: Map<EKeyCode, IListener[]> = new Map<EKeyCode, IListener[]>();

    private _reservedInputGroup: string | void = void 0;

    constructor(@inject(Logger) private readonly logger: Logger) {
        alt.on('keydown', this.onKeyDown.bind(this));
        alt.on('keyup', this.onKeyUp.bind(this));
    }

    private onKeyDown(key: number): void {
        this.pressedKeys.add(key);

        const onceListeners: IListener[] = this.onceListeners.get(key) || [];
        onceListeners.forEach((listener: IListener) => {
            if (this._reservedInputGroup && listener.group !== this._reservedInputGroup) return;
            listener.cb();
        });
        this.onceListeners.delete(key);

        const onListeners: IListener[] = this.onListeners.get(key) || [];
        onListeners.forEach((listener: IListener) => {
            if (this._reservedInputGroup && listener.group !== this._reservedInputGroup) return;
            listener.cb();
        });
    }

    on(key: EKeyCode, listener: IAnyFunction, group?: string): void {
        if (!this.onListeners.has(key)) {
            this.onListeners.set(key, []);
        }
        this.onListeners.get(key)!.push({ cb: listener, group });
    }

    once(key: EKeyCode, listener: IAnyFunction, group?: string): void {
        if (!this.onceListeners.has(key)) this.onceListeners.set(key, []);
        this.onceListeners.get(key)!.push({ cb: listener, group });
    }

    off(key: EKeyCode, listener: IAnyFunction): void {
        const onceListeners: IListener[] = this.onceListeners.get(key) || [];
        this.onceListeners.set(
            key,
            onceListeners.filter((l: IListener) => l.cb !== listener),
        );

        const onListeners: IListener[] = this.onListeners.get(key) || [];
        this.onListeners.set(
            key,
            onListeners.filter((l: IListener): boolean => l.cb !== listener),
        );
    }

    reserveInputGroup(name: string): boolean {
        if (this._reservedInputGroup) return false;
        this._reservedInputGroup = name;
        this.logger.info(`[KeyResolver] Reserve group <${name}>`);
        return true;
    }

    freeInputGroup(name: string): boolean {
        if (this._reservedInputGroup && this._reservedInputGroup !== name) return false;
        this._reservedInputGroup = undefined;
        this.logger.info(`[KeyResolver] Free group <${name}>`);
        return true;
    }

    private onKeyUp(key: number): void {
        this.pressedKeys.delete(key);
    }
}
