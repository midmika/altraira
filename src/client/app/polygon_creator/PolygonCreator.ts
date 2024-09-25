import alt from 'alt-client';
import { sortVertices } from '@shared/utils/sortVertices';
import natives from 'natives';
import { raycast } from '@/utils/raycast';
import { debugPolygon } from '@/utils/debugPolygon';
import type { IVector2 } from 'alt-shared';
import { rotationToDirection } from '@/utils/rotationToDirection';
import { inject, injectable } from 'inversify';
import { Frontend } from '@/app/builtin/Frontend';
import { Server } from '@/app/builtin/Server';

@injectable()
export class PolygonCreator {
    private _isStarted: boolean = false;
    private _vertices: IVector2[] = [];
    private _lastPoint: alt.Vector3 = alt.Vector3.zero;
    private _renderTimer: number = -1;
    private boundOnWeaponShoot = this.onWeaponShoot.bind(this);
    private _id: string = 'debug_' + Date.now();

    constructor(
        @inject(Frontend) private readonly frontend: Frontend,
        @inject(Server) private readonly server: Server,
    ) {}

    start(): void {
        if (this._isStarted) return;
        alt.on('playerWeaponShoot', this.boundOnWeaponShoot);
        this._renderTimer = alt.everyTick(this.render.bind(this));
        this._id = 'polygon_' + Date.now();
        this._isStarted = true;
        alt.log('start', this._id);
    }

    stop(): void {
        if (!this._isStarted) return;
        alt.off('playerWeaponShoot', this.boundOnWeaponShoot);
        alt.clearEveryTick(this._renderTimer);
        this._renderTimer = -1;
        this._vertices = [];
        this._isStarted = false;
        alt.log('stop', this._id);
    }

    toggle(): void {
        if (this._isStarted) {
            this.stop();
        } else {
            this.start();
        }
    }

    private onWeaponShoot(): void {
        this._vertices = sortVertices([...this._vertices, this._lastPoint]);
        this.server.emit('debug:polygon', this._id, this._vertices);
    }

    private render(): void {
        const camCoord = natives.getFinalRenderedCamCoord();
        const camForward = rotationToDirection(natives.getFinalRenderedCamRot(2).toRadians());

        const r = raycast(camCoord, camForward.mul(1000).add(camCoord), -1, alt.Player.local.scriptID);
        const t = r[2];
        if (t.distanceTo(alt.Vector3.zero) !== 0) {
            this._lastPoint = r[2];
        }

        debugPolygon(
            this._vertices.map((i) => ({ x: i.x, y: i.y })),
            -50,
            300,
            255,
            255,
            0,
            255,
        );
    }
}
