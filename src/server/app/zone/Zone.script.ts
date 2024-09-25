import { inject, injectable } from 'inversify';
import { Zone } from '@/app/zone/Zone';
import ZoneSources from '@sources/zones.json';
import type { IZoneDto } from '@shared/app/zone/AbstractZone';
import type { PolygonColshape } from '@/app/colshape/PolygonColshape';
import { ColshapeScript } from '@/app/colshape/Colshape.script';
import type { IAnyEntity } from '@/types';
import { Character } from '@/app/character/Character';
import type { IAnyFunction } from '@shared/types';

@injectable()
export class ZoneScript {
    @inject(Zone)
    private readonly zoneConstructor: any;

    @inject(ColshapeScript)
    private readonly colshapeService: ColshapeScript;

    private readonly _list: Map<string /* hash */, Zone> = new Map();
    private readonly _zoneWrapperCSCleanUp: Map<Zone, IAnyFunction> = new Map();

    start(): void {
        this.loadSources();
    }

    isCharInsideZone(char: Character, zone: Zone): boolean {
        return zone.isEntityInside(char);
    }

    private create(dto: IZoneDto): Zone {
        const wrapperCs: PolygonColshape = this.colshapeService.createPolygon(dto.polygon);
        const zone: Zone = this.zoneConstructor(dto, wrapperCs);
        this._list.set(zone.hash, zone);

        const onEnterWrapperCs = (entity: IAnyEntity) => {
            if (!(entity instanceof Character)) return;
            this.onEnterZone(entity, zone);
        };

        const onLeaveWrapperCs = (entity: IAnyEntity) => {
            if (!(entity instanceof Character)) return;
            this.onLeaveZone(entity, zone);
        };

        this.colshapeService.on('enter', wrapperCs, onEnterWrapperCs);
        this.colshapeService.on('leave', wrapperCs, onLeaveWrapperCs);

        const cleanUpWrapperCsListeners = () => {
            this.colshapeService.off('enter', wrapperCs, onEnterWrapperCs);
            this.colshapeService.off('leave', wrapperCs, onLeaveWrapperCs);
        };

        this._zoneWrapperCSCleanUp.set(zone, cleanUpWrapperCsListeners);

        return zone;
    }

    private onEnterZone(char: Character, zone: Zone): void {
        console.log('Character:', char.id, 'enter zone', '[' + zone.hash + ']');
    }

    private onLeaveZone(char: Character, zone: Zone): void {
        console.log('Character:', char.id, 'leave zone', '[' + zone.hash + ']');
    }

    private loadSources(): void {
        ZoneSources.forEach((dto: IZoneDto) => this.create(dto));
        const flat = [...this._list.keys()];
        console.log(`=== Loaded ${flat.length} zones ===`);
        console.log(flat.join(', '));
        console.log(`=======================`);
    }
}
