import type { IParkingZoneDto, IParkingZoneType } from '@shared/app/parking/AbstractParkingZone';
import { AbstractParkingZone } from '@shared/app/parking/AbstractParkingZone';
import alt from 'alt-client';
import type { IVector3 } from 'alt-shared';
import natives, { drawDebugText2d } from 'natives';
import { drawText3d } from '@/utils/text';

export class ParkingZone extends AbstractParkingZone {

    protected declare _pos: IVector3;
    protected declare _rot: IVector3;
    protected declare _type: IParkingZoneType;

    private _debugMarker: alt.Marker | null = null;
    private _debugTimer: number = -1

    constructor(dto: IParkingZoneDto) {
        super(dto);
    }

    private get scale(): alt.Vector3 {
        if(this._type === 'normal') {
            return new alt.Vector3(5, 1, 1);
        } else if(this._type === 'trailer') {
            return new alt.Vector3(5, 16, 3);
        }

        return new alt.Vector3(1, 1, 3);
    }

    debug(): void {
        const marker: alt.Marker = new alt.Marker(
            43,
            new alt.Vector3(this._pos),
            new alt.RGBA(245, 40, 145, 51)
        );
        marker.scale = this.scale
        marker.rot = new alt.Vector3(this._rot)
        this._debugMarker = marker

        this._debugTimer = alt.everyTick(() => {
            drawText3d(`Parking Zone [${this._type}]`, { ...this._pos, z: this._pos.z + 1.5 }, 0.4, 7, [255, 255, 255, 255])
        })
    }

}