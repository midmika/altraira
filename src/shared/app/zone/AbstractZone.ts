// @ts-ignore
import type { IVector2 } from 'alt-shared';
import type { AbstractPolygonColshape } from '../colshape/AbstractPolygonColshape';
import type { AbstractVehicle } from '../vehicle/AbstractVehicle';
import type { AbstractCharacter } from '../character/AbstractCharacter';

export abstract class AbstractZone {
    protected readonly _name: string;
    protected readonly _hash: string;
    protected readonly _polygon: IVector2[];
    protected readonly _wrapperColshape: AbstractPolygonColshape<any>;

    protected constructor(dto: IZoneDto, wrapperCs: AbstractPolygonColshape<any>) {
        this._polygon = dto.polygon;
        this._name = dto.name;
        this._hash = dto.hash;
        this._wrapperColshape = wrapperCs;
    }

    get name(): string {
        return this._name;
    }

    get hash(): string {
        return this._hash;
    }

    isEntityInside(entity: AbstractVehicle<any> | AbstractCharacter<any>): boolean {
        return this._wrapperColshape.isEntityInside(entity);
    }
}

export interface IZoneDto {
    id: number;
    polygon: IVector2[];
    name: string;
    hash: string;
    _debug_height: number;
}

export interface IZoneDebugDto extends IZoneDto {}
