import { inject, injectable } from 'inversify';
import { Frontend } from '../builtin/Frontend';
import type { IFHudState } from '@webstore/hudStore';
import alt from 'alt-client';
import natives from 'natives';
import native from 'natives';

@injectable()
export class HudScript {
    private _dollars: number = 0;
    private _time: string = '00:00';
    private _speed: number | null = null;
    private _debug: { x: number; y: number; z: number; h: number } | null = null;
    private _location: string | null = null;

    constructor(@inject(Frontend) private readonly frontend: Frontend) {}

    start(): void {
        alt.everyTick(() => {
            {
                // Speed
                if (alt.Player.local.vehicle) {
                    const speed = natives.getEntitySpeed(alt.Player.local.vehicle);
                    this.speed = speed * 3.6;
                } else {
                    this.speed = null;
                }
            }

            {
                // Debug Pos
                const pos = alt.Player.local.pos;
                const rot = alt.Player.local.rot;

                this.debug = {
                    x: pos.x,
                    y: pos.y,
                    z: native.getGroundZFor3dCoord(pos.x, pos.y, pos.z, pos.z, true, true)[1],
                    h: rot.z,
                };
            }
        });
    }

    set dollars(value: number) {
        this._dollars = value;
        this.updateStore();
    }

    get dollars(): number {
        return this._dollars;
    }

    set time(value: string) {
        this._time = value;
        this.updateStore();
    }

    set location(location: string) {
        this._location = location;
        this.updateStore();
    }

    private set speed(value: number) {
        this._speed = value;
        this.updateStore();
    }

    private set debug(value: { x: number; y: number; z: number; h: number }) {
        this._debug = value;
        this.updateStore();
    }

    private updateStore(): void {
        this.frontend.setStore<IFHudState>('hud', {
            dollars: this._dollars,
            time: this._time,
            speed: this._speed,
            debug: this._debug,
            location: this._location,
        });
    }
}
