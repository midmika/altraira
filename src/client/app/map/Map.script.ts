import { inject, injectable } from 'inversify';
import { Frontend } from '@/app/builtin/Frontend';
import { KeyResolver } from '@/app/builtin/KeyResolver';
import { EKeyCode } from '@/types/EKeyCode';
import alt from 'alt-client';
import natives from 'natives';
import type { IVector3 } from 'alt-shared';

@injectable()
export class MapScript {
    private readonly boundOnTriggerHotKey = this.onTriggerHotKey.bind(this);
    private readonly boundSetWaypoint = this.setWaypoint.bind(this);

    private _isOpen: boolean = false;
    private _disableControlTimer: number = -1;

    constructor(
        @inject(Frontend) private readonly frontend: Frontend,
        @inject(KeyResolver) private readonly keyResolver: KeyResolver,
    ) {}

    start(): void {
        this.keyResolver.on(EKeyCode.KEY_M, this.boundOnTriggerHotKey, 'map');
        this.frontend.on('map:set_nav_point', this.boundSetWaypoint);
    }

    destroy(): void {
        this.keyResolver.off(EKeyCode.KEY_M, this.boundOnTriggerHotKey);
        this.frontend.off('map:set_nav_point', this.boundSetWaypoint);
        this.frontend.emit('map_state', false);
        alt.clearEveryTick(this._disableControlTimer);
    }

    private onTriggerHotKey(): void {
        this._isOpen = !this._isOpen;
        if (this._isOpen) {
            this.keyResolver.reserveInputGroup('map');
            this.frontend.focus();
        } else {
            this.keyResolver.freeInputGroup('map');
            this.frontend.blur();
        }

        this.frontend.emit('map_state', this._isOpen);
        alt.showCursor(this._isOpen);

        if (this._isOpen) {
            this._disableControlTimer = alt.everyTick(() => {
                natives.disableAllControlActions(0);
            });
        } else {
            alt.clearEveryTick(this._disableControlTimer);
        }
    }

    private setWaypoint(pos: IVector3): void {
        natives.setNewWaypoint(pos.x, pos.y);
    }
}
