import type { IZoneDto } from '@shared/app/zone/AbstractZone';
import { AbstractZone } from '@shared/app/zone/AbstractZone';
import type { IVector2 } from 'alt-shared';
import { injectable } from 'inversify';
import type { PolygonColshape } from '@/app/colshape/PolygonColshape';

@injectable()
export class Zone extends AbstractZone {
    protected declare _name: string;
    protected declare _hash: string;
    protected declare _polygon: IVector2[];
    protected declare _wrapperColshape: PolygonColshape;

    constructor(dto: IZoneDto, wrapperCs: PolygonColshape) {
        super(dto, wrapperCs);
    }

    destroy(): void {
        this._wrapperColshape.destroy();
    }
}
