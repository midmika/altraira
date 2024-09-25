import type { ISpawnDto } from '@shared/app/spawn/AbstractSpawn';
import { AbstractSpawn } from '@shared/app/spawn/AbstractSpawn';
import type { EFaction } from '@shared/app/faction/Faction';
import type { IVector2, IVector3 } from 'alt-shared';
import type { PolygonColshape } from '@/app/colshape/PolygonColshape';
import type { Character } from '@/app/character/Character';
import alt from 'alt-server';

export class Spawn extends AbstractSpawn {
    protected declare _faction: EFaction;
    protected declare _pos: IVector3;
    protected declare _rot: IVector3;
    protected declare _polygon: IVector2[];

    constructor(dto: ISpawnDto, polygon: PolygonColshape) {
        super(dto, polygon);
    }

    to(char: Character): void {
        char.instance.spawn(this._pos);
        char.instance.rot = new alt.Vector3(this._rot);
    }
}
