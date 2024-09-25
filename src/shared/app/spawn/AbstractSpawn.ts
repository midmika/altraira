import type { EFaction } from '../faction/Faction';
// @ts-ignore
import type { IVector2, IVector3 } from 'alt-shared';
import type { AbstractPolygonColshape } from '../colshape/AbstractPolygonColshape';

export abstract class AbstractSpawn {
    protected _faction: EFaction;
    protected _pos: IVector3;
    protected _rot: IVector3;
    protected _polygon: IVector2[];
    protected readonly _wrapperColshape: AbstractPolygonColshape<any>;

    protected constructor(dto: ISpawnDto, wrapperCs: AbstractPolygonColshape<any>) {
        this._faction = dto.faction;
        this._pos = dto.pos;
        this._rot = dto.rot;
        this._polygon = dto.polygon;
        this._wrapperColshape = wrapperCs;
    }

    get pos(): IVector3 {
        return this._pos;
    }

    get rot(): IVector3 {
        return this._rot;
    }

    get faction(): EFaction {
        return this._faction;
    }

    get polygon(): IVector2[] {
        return this._polygon;
    }
}

export interface ISpawnDto {
    faction: EFaction;
    polygon: IVector2[];
    pos: IVector3;
    rot: IVector3;
}
