import alt from 'alt-server';
import { AbstractPolygonColshape } from '@shared/app/colshape/AbstractPolygonColshape';
import type { IVector2, IVector3 } from 'alt-shared';
import type { Character } from '@/app/character/Character';
import { AbstractSphereColshape } from '@shared/app/colshape/AbstractSphereColshape';

export class SphereColshape extends AbstractSphereColshape<alt.ColshapeSphere> {
    constructor(pos: IVector3, radius: number) {
        const instance = new alt.ColshapeSphere(pos.x, pos.y, pos.z, radius);
        super(instance, pos, radius);
        instance.$ = this;
    }

    isEntityInside(entity: Character): boolean {
        return this._instance.isEntityIn(entity.instance);
    }
}
