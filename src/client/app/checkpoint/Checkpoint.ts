import type { IVector3 } from 'alt-shared';
import type { IRGBA } from '@shared/types';
import alt from 'alt-client';
import { NativeWorldObject } from '@/app/builtin/NativeWorldObject';

export class Checkpoint extends NativeWorldObject<alt.Checkpoint> {
    private readonly _type: ICheckpointType;
    private readonly _pos: IVector3;
    private readonly _radius: number;
    private readonly _height: number;
    private readonly _streamingDistance: number;
    private readonly _color: IRGBA;
    protected declare _instance: alt.Checkpoint;

    constructor(dto: ICheckpointBaseDto) {
        super();
        this._type = dto.type;
        this._pos = dto.pos;
        this._radius = dto.radius;
        this._height = dto.height;
        this._color = dto.color;
        this._streamingDistance = dto.streamingDistance;
        this._instance = new alt.Checkpoint(
            this._type,
            new alt.Vector3(this._pos),
            new alt.Vector3(this._pos),
            this._radius,
            this._height,
            new alt.RGBA(this._color),
            new alt.RGBA(0, 0, 0, 0),
            this._streamingDistance,
        );
    }
}

export type ICheckpointType = alt.CheckpointType;

export interface ICheckpointBaseDto {
    type: ICheckpointType;
    pos: IVector3;
    radius: number;
    height: number;
    color: IRGBA;
    streamingDistance: number;
}
