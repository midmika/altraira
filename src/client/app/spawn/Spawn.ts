import type { ISpawnDto } from '@shared/app/spawn/AbstractSpawn';
import { AbstractSpawn } from '@shared/app/spawn/AbstractSpawn';
import type { EFaction } from '@shared/app/faction/Faction';
import { FactionColor } from '@shared/app/faction/Faction';
import type { IVector2, IVector3 } from 'alt-shared';
import type { PolygonColshape } from '@/app/colspape/PolygonColshape';
import { drawText3d } from '@/utils/text';
import { calculateCentroid } from '@shared/utils/calculateCentroid';

export class Spawn extends AbstractSpawn {
    protected declare _faction: EFaction;
    protected declare _pos: IVector3;
    protected declare _rot: IVector3;
    protected declare _polygon: IVector2[];
    protected declare _wrapperColshape: PolygonColshape;
    private readonly __wrapperColshapeCentroid: IVector2;

    constructor(dto: ISpawnDto, wrapperColshape: PolygonColshape) {
        super(dto, wrapperColshape);

        this.__wrapperColshapeCentroid = calculateCentroid(dto.polygon);
    }

    debugThisFrame(): void {
        this._wrapperColshape.debugThisFrame({ color: [...FactionColor[this._faction], 255] });
        drawText3d(
            `Spawn <${this._faction}>`,
            { ...this.__wrapperColshapeCentroid, z: 100 },
            0.4,
            2,
            [...FactionColor[this._faction], 255],
            true,
            true,
        );
    }
}
