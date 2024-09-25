import { inject, injectable } from 'inversify';
import SpawnSources from '../../../sources/spawns.json';
import { Spawn } from '@/app/spawn/Spawn';
import type { ISpawnDto } from '@shared/app/spawn/AbstractSpawn';
import type { EFaction } from '@shared/app/faction/Faction';
import type { IAnyFunction } from '@shared/types';
import type { IAnyEntity } from '@/types';
import { Character } from '@/app/character/Character';
import { ColshapeScript } from '@/app/colshape/Colshape.script';
import type { PolygonColshape } from '@/app/colshape/PolygonColshape';

@injectable()
export class SpawnScript {
    private readonly _list: Map<EFaction /* faction */, Spawn> = new Map();
    private readonly _spawnCSCleanUp: Map<Spawn, IAnyFunction> = new Map();

    @inject(ColshapeScript)
    private readonly colshapeService: ColshapeScript;

    constructor() {}

    start(): void {
        this.loadSources();
    }

    create(dto: ISpawnDto) {
        const cs: PolygonColshape = this.colshapeService.createPolygon(dto.polygon, -10000, 10000);
        const spawn = new Spawn(dto, cs);
        this._list.set(spawn.faction, spawn);

        const onEnterWrapperCs = (entity: IAnyEntity) => {
            if (!(entity instanceof Character)) return;
            this.onEnter(entity, spawn);
        };

        const onLeaveWrapperCs = (entity: IAnyEntity) => {
            if (!(entity instanceof Character)) return;
            this.onLeave(entity, spawn);
        };

        const cleanUpCsListeners = () => {
            this.colshapeService.off('enter', cs, onEnterWrapperCs);
            this.colshapeService.off('leave', cs, onLeaveWrapperCs);
        };

        this._spawnCSCleanUp.set(spawn, cleanUpCsListeners);

        this.colshapeService.on('enter', cs, onEnterWrapperCs);
        this.colshapeService.on('leave', cs, onLeaveWrapperCs);
    }

    getByFaction(faction: EFaction): Spawn {
        return this._list.get(faction);
    }

    private loadSources(): void {
        SpawnSources.forEach((dto: ISpawnDto) => this.create(dto));
        const flat = [...this._list.keys()];
        console.log(`=== Loaded ${flat.length} spawns ===`);
        console.log(flat.join(', '));
        console.log(`=======================`);
    }

    private onEnter(char: Character, spawn: Spawn): void {
        console.log('Character:', char.id, 'enter spawn', '[' + spawn.faction + ']');
    }

    private onLeave(char: Character, spawn: Spawn): void {
        console.log('Character:', char.id, 'leave spawn', '[' + spawn.faction + ']');
    }
}
