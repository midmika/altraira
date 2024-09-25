import alt from 'alt-server';
import { AbstractPolygonColshape } from '@shared/app/colshape/AbstractPolygonColshape';
import type { IVector2 } from 'alt-shared';
import type { Character } from '@/app/character/Character';

export class PolygonColshape extends AbstractPolygonColshape<alt.ColshapePolygon> {
    constructor(polygons: IVector2[], minZ: number = -1000, maxZ: number = 1000) {
        const instance = new alt.ColshapePolygon(minZ, maxZ, polygons);
        super(instance, polygons);
        instance.$ = this;
    }

    isEntityInside(entity: Character): boolean {
        return this._instance.isEntityIn(entity.instance);
    }
}
