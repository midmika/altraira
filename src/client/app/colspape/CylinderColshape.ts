import { AbstractColshape } from '@/app/colspape/AbstractColshape';
import * as alt from 'alt-client';
import type { IVector3 } from 'alt-shared';
import type { ICylinderColshapeDto } from '@shared/app/colshape/CylinderColshape';
import { drawText3d } from '@/utils/text';

export class CylinderColshape extends AbstractColshape {
    private readonly _pos: IVector3;
    private readonly _radius: number;
    private readonly _height: number;
    declare _instance: alt.Colshape;
    declare _debugMarker: alt.Marker | null;
    declare _debugTimer: number;

    constructor(dto: ICylinderColshapeDto) {
        super();
        this._radius = dto.radius;
        this._height = dto.height;
        this._pos = dto.pos;

        const instance: alt.ColshapeCylinder = new alt.ColshapeCylinder(
            this._pos.x,
            this._pos.y,
            this._pos.z,
            this._radius,
            this._height,
        );

        if (!instance.valid) throw new Error("CylinderColshape isn't valid");

        this._instance = instance;
    }

    debug(ownerDebugName: string): void {
        const marker: alt.Marker = new alt.Marker(28, new alt.Vector3(this._pos), new alt.RGBA(245, 40, 145, 51));
        marker.scale = new alt.Vector3(this._radius, this._radius, this._height);
        this._debugMarker = marker;
        this._debugTimer = alt.everyTick(() => {
            drawText3d(`${ownerDebugName}`, { ...this._pos, z: this._pos.z + 1.5 }, 0.4, 7, [255, 255, 255, 255]);
        });
    }

    destroy(): void {
        this._instance?.destroy();
        if (this._debugMarker && this._debugMarker.valid) this._debugMarker.destroy();
    }
}
