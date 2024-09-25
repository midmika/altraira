import type { IVector3 } from 'alt-shared';


export abstract class AbstractParkingZone {

    protected readonly _pos: IVector3;
    protected readonly _rot: IVector3;
    protected readonly _type: IParkingZoneType;

    protected constructor(dto: IParkingZoneDto) {
        this._pos = dto.pos;
        this._rot = dto.rot;
        this._type = dto.type
    }

}

export type IParkingZoneType = 'normal' | 'trailer'

export interface IParkingZoneDto {
    pos: IVector3;
    rot: IVector3;
    type: IParkingZoneType
}