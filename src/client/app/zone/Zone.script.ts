import { inject, injectable } from 'inversify';
import { Zone } from '@/app/zone/Zone';
import { ColshapeService } from '@/app/colspape/Colshape.service';
import { $global } from '@/_magic/inversify.tokens';
import type { IZoneDto } from '@shared/app/zone/AbstractZone';
import type { Character } from '@/app/character/Character';
import type { PolygonColshape } from '@/app/colspape/PolygonColshape';
import alt from 'alt-client';
import ZoneSources from '../../../sources/zones.json';
import type { IAnyFunction } from '@shared/types';
import { Frontend } from '@/app/builtin/Frontend';
import { HudScript } from '@/app/hud/Hud.script';

@injectable()
export class ZoneScript {
    @inject(ColshapeService)
    private readonly colshapeService: ColshapeService;

    @inject(Frontend)
    private readonly frontend: Frontend;

    @inject(HudScript)
    private readonly hudScript: HudScript;

    @inject($global.localCharacter)
    private readonly localCharacter: Character;

    private readonly _list: Map<number /* id */, Zone> = new Map();
    private readonly _cleanUpList: Map<Zone, IAnyFunction> = new Map();

    start(): void {
        this.loadSources();
    }

    private onLocalEnterZone(zone: Zone): void {
        this.hudScript.location = zone.name;
    }

    private onLocalLeaveZone(zone: Zone): void {
        this.hudScript.location = null;
    }

    add(dto: IZoneDto): Zone {
        const wrapperCs: PolygonColshape = this.colshapeService.createPolygon(dto.polygon);
        const zone: Zone = new Zone(dto, wrapperCs);

        const onEnterWrapperCs = () => this.onLocalEnterZone(zone);
        const onLeaveWrapperCs = () => this.onLocalLeaveZone(zone);

        const cleanup = () => {
            this.colshapeService.off('enter', wrapperCs, onEnterWrapperCs);
            this.colshapeService.off('leave', wrapperCs, onLeaveWrapperCs);
        };

        this.colshapeService.on('enter', wrapperCs, onEnterWrapperCs);
        this.colshapeService.on('leave', wrapperCs, onLeaveWrapperCs);

        this._list.set(zone.id, zone);
        this._cleanUpList.set(zone, cleanup);
        this.frontend.emit('map:add_zone', dto);
        return zone;
    }

    delete(zone: Zone): void {
        this._list.delete(zone.id);
        const item = this._cleanUpList.get(zone);
        item && item();
        zone.destroy();
        this.frontend.emit('map:remove_zone', zone.serialize());
        this._cleanUpList.delete(zone);
    }

    deleteByDto(dto: IZoneDto): void {
        const zone: Zone = this._list.get(dto.id);
        if (!zone) return;
        this.frontend.emit('map:remove_zone', dto);
        this.delete(zone);
    }

    updateByDto(dto: IZoneDto): void {
        const zone: Zone = this._list.get(dto.id);
        if (!zone) return;
        this.delete(zone);
        this.frontend.emit('map:update_zone', dto);
        this.add(dto);
    }

    private loadSources(): void {
        ZoneSources.forEach((dto: IZoneDto) => this.add(dto));
        const flat = [...this._list.values()].map((i) => i.hash);
        alt.log(`=== Loaded ${flat.length} zones ===`);
        alt.log(flat.join(', '));
        alt.log(`=======================`);
    }

    get list(): Zone[] {
        return [...this._list.values()];
    }
}
