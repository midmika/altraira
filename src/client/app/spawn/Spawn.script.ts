import { inject, injectable } from 'inversify';
import { Spawn } from '@/app/spawn/Spawn';
import { EFaction } from '@shared/app/faction/Faction';
import type { ISpawnDto } from '@shared/app/spawn/AbstractSpawn';
import type { PolygonColshape } from '@/app/colspape/PolygonColshape';
import { ColshapeService } from '@/app/colspape/Colshape.service';
import type { IAnyFunction } from '@shared/types';
import SpawnSources from '@sources/spawns.json';
import { HudScript } from '@/app/hud/Hud.script';

@injectable()
export class SpawnScript {
    @inject(ColshapeService)
    private readonly colshapeService: ColshapeService;

    @inject(HudScript)
    private readonly hudScript: HudScript;

    private readonly _list: Map<EFaction, Spawn> = new Map();
    private readonly _cleanUpList: Map<Spawn, IAnyFunction> = new Map();

    start(): void {
        this.loadSources();
    }

    create(dto: ISpawnDto): Spawn {
        const wrapperCs: PolygonColshape = this.colshapeService.createPolygon(dto.polygon);
        const spawn: Spawn = new Spawn(dto, wrapperCs);

        const onEnterWrapperCs = () => this.onLocalEnterSpawn(spawn);
        const onLeaveWrapperCs = () => this.onLocalLeaveSpawn(spawn);

        const cleanup = () => {
            this.colshapeService.off('enter', wrapperCs, onEnterWrapperCs);
            this.colshapeService.off('leave', wrapperCs, onLeaveWrapperCs);
        };

        this.colshapeService.on('enter', wrapperCs, onEnterWrapperCs);
        this.colshapeService.on('leave', wrapperCs, onLeaveWrapperCs);

        this._list.set(spawn.faction, spawn);
        this._cleanUpList.set(spawn, cleanup);
        return spawn;
    }

    get list(): Spawn[] {
        return [...this._list.values()];
    }

    private onLocalEnterSpawn(spawn: Spawn): void {
        this.hudScript.location = TempFactionNamesIntl[spawn.faction];
    }

    private onLocalLeaveSpawn(spawn: Spawn): void {
        this.hudScript.location = null;
    }

    private loadSources(): void {
        for (const dto of SpawnSources) {
            this.create(dto as ISpawnDto);
        }
        const flat = [...this._list.values()].map((i) => i.faction);
        console.log(`=== Loaded ${flat.length} spawns ===`);
        console.log(flat.join(', '));
        console.log(`=======================`);
    }
}

const TempFactionNamesIntl: Record<EFaction, string> = {
    [EFaction.alt]: 'Спавн Альтушек',
    [EFaction.ryodan]: 'Спавн ЧВК "Редан"',
    [EFaction.skuf]: 'Спавн Скуфов',
};
