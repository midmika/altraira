import { inject, injectable } from 'inversify';
import type { Zone } from '@/app/zone/Zone';
import { Server } from '@/app/builtin/Server';
import { EKeyCode } from '@/types/EKeyCode';
import { Frontend } from '@/app/builtin/Frontend';
import { KeyResolver } from '@/app/builtin/KeyResolver';
import * as alt from 'alt-client';
import natives from 'natives';
import { rotationToDirection } from '@/utils/rotationToDirection';
import { raycast } from '@/utils/raycast';
import type { IZoneDebugDto } from '@shared/app/zone/AbstractZone';
import type { IVector2 } from 'alt-shared';
import { ColshapeService } from '@/app/colspape/Colshape.service';
import { ZoneScript } from '@/app/zone/Zone.script';
import { drawText3d } from '@/utils/text';
import { sortVertices } from '@shared/utils/sortVertices';

@injectable()
export class ZoneEditorScript {
    private _isActivated: boolean = false;
    private _isInterfaceShow: boolean = false;

    private _highlightedId: number | null = null;
    private _lastHighlightedZone: Zone | null = null;
    private _highlightedApex: IVector2 | null = null;

    private _selectedId: number | null = null;
    private _lastSelectedZone: Zone | null = null;

    private _lastPoint: alt.IVector2 = { x: 0, y: 0 };

    private _renderTimer: number = -1;
    private _actionTimer: number = -1;

    private readonly bound_toggleFront = this.toggleFront.bind(this);
    private readonly bound_addItem = this.addItem.bind(this);
    private readonly bound_updateItem = this.updateItem.bind(this);
    private readonly bound_deleteItem = this.deleteItem.bind(this);
    private readonly bound_onSelect = this.onSelect.bind(this);
    private readonly bound_onHighlight = this.onHighlight.bind(this);
    private readonly bound_onHighlightApex = this.onHighlightApex.bind(this);
    private bound_onWeaponShoot = this.onWeaponShoot.bind(this);
    private bound_render = this.render.bind(this);

    constructor(
        @inject(Server) private readonly server: Server,
        @inject(Frontend) private readonly frontend: Frontend,
        @inject(KeyResolver) private readonly keyResolver: KeyResolver,
        @inject(ColshapeService) private readonly colshapeService: ColshapeService,
        @inject(ZoneScript) private readonly zoneScript: ZoneScript,
    ) {}

    private render(): void {
        const camCoord = natives.getFinalRenderedCamCoord();
        const camForward = rotationToDirection(natives.getFinalRenderedCamRot(2).toRadians());

        const r = raycast(camCoord, camForward.mul(1000).add(camCoord), -1, alt.Player.local.scriptID);
        const t = r[2];
        if (t.distanceTo(alt.Vector3.zero) !== 0) {
            this._lastPoint = { x: t.x, y: t.y };
        }

        if (this._highlightedApex) {
            const targetZone = this.zoneScript.list.find((i) =>
                i.serialize().polygon.find((b) => b.x === this._highlightedApex.x && b.y === this._highlightedApex.y),
            );
            if (targetZone) {
                drawText3d(
                    'x',
                    new alt.Vector3(this._highlightedApex.x, this._highlightedApex.y, targetZone.debug_height - 20),
                    1,
                    1,
                    [0, 255, 255, 255],
                );
            }
        }

        if (this._selectedId !== null) {
            const targetZone = this.zoneScript.list.find((i) => i.serialize().id === this._selectedId);
            if (targetZone) {
                if (targetZone !== this._lastSelectedZone && this._lastSelectedZone)
                    this._lastSelectedZone.overwriteDebugColor();
                targetZone.overwriteDebugColor([0, 255, 255, 255]);
                this._lastSelectedZone = targetZone;
            }
        } else if (this._lastSelectedZone) {
            this._lastSelectedZone.overwriteDebugColor();
            this._lastSelectedZone = null;
        }

        if (this._highlightedId !== null) {
            const targetZone = this.zoneScript.list.find((i) => i.serialize().id === this._highlightedId);
            if (targetZone) {
                if (targetZone !== this._lastHighlightedZone && this._lastHighlightedZone)
                    this._lastHighlightedZone.overwriteDebugColor();
                targetZone.overwriteDebugColor([255, 0, 255, 255]);
                this._lastHighlightedZone = targetZone;
            }
        } else if (this._lastHighlightedZone) {
            this._lastHighlightedZone.overwriteDebugColor();
            this._lastHighlightedZone = null;
        }
    }

    private onWeaponShoot(): void {
        if (this._selectedId === null || !this._isActivated) return;
        const target = this.zoneScript.list.find((i) => i.serialize().id === this._selectedId);
        const newApex = this._lastPoint;
        if (target) {
            const dto = target.serialize();
            this.zoneScript.updateByDto({ ...dto, polygon: sortVertices([...dto.polygon, newApex]) });
            this.frontend.emit('zone_editor:add_apex', newApex);
        } else {
            this.frontend.emit('zone_editor:add_apex', newApex);
        }
    }

    start(): void {
        if (this._isActivated) return;

        this.keyResolver.on(EKeyCode.F5, this.bound_toggleFront, 'zone_editor');
        this._renderTimer = alt.everyTick(this.bound_render);
        alt.on('playerWeaponShoot', this.bound_onWeaponShoot);

        this._isActivated = true;
    }

    stop(): void {
        if (!this._isActivated) return;
        this.deactivate();

        this.keyResolver.off(EKeyCode.F5, this.bound_toggleFront);
        try {
            alt.clearEveryTick(this._renderTimer);
        } catch {
            /* empty */
        }

        alt.off('playerWeaponShoot', this.bound_onWeaponShoot);

        this._isActivated = false;

        this._selectedId = null;
        this._lastSelectedZone = null;

        this.server.call(
            'debug:update_zone_sources',
            this.zoneScript.list.map((i) => i.serialize()),
        );
    }

    toggle(): void {
        if (this._isActivated) {
            this.stop();
        } else {
            this.start();
        }
    }

    private async addItem(item: IZoneDebugDto): Promise<void> {
        if (item.polygon.length >= 3) this.zoneScript.add(item);
    }

    private async updateItem(item: IZoneDebugDto): Promise<void> {
        if (item.polygon.length >= 3) {
            const isExists = this.zoneScript.list.find((i) => i.id === item.id);
            if (isExists) {
                this.zoneScript.updateByDto(item);
            } else {
                this.zoneScript.add(item);
            }
        } else {
            this.zoneScript.deleteByDto(item);
        }
    }

    private async deleteItem(item: IZoneDebugDto): Promise<void> {
        this.zoneScript.deleteByDto(item);
    }

    private onHighlight(id: number | null): void {
        this._highlightedId = id;
    }

    private onHighlightApex(apex: IVector2): void {
        this._highlightedApex = apex;
    }

    private onSelect(id: number | null): void {
        this._selectedId = id;
        void this.server.call('debug:zone_editor_weapon', id !== null);
    }

    private toggleFront(): void {
        this._isInterfaceShow = !this._isInterfaceShow;

        this.frontend.emit(
            'zone_editor:toggle',
            this._isInterfaceShow,
            this.zoneScript.list.map((i) => i.serialize()),
        );

        if (this._isInterfaceShow) {
            this.activate();
        } else {
            this.deactivate();
        }
    }

    private activate(): void {
        this.frontend.on('zone_editor:add_item', this.bound_addItem);
        this.frontend.on('zone_editor:update_item', this.bound_updateItem);
        this.frontend.on('zone_editor:delete_item', this.bound_deleteItem);
        this.frontend.on('zone_editor:select', this.bound_onSelect);
        this.frontend.on('zone_editor:highlight', this.bound_onHighlight);
        this.frontend.on('zone_editor:highlight_apex', this.bound_onHighlightApex);
        this._actionTimer = alt.everyTick(() => {
            natives.disableAllControlActions(0);
            natives.disableAllControlActions(2);
        });

        this.keyResolver.reserveInputGroup('zone_editor');
        if (!alt.isCursorVisible()) alt.showCursor(true);
        this.frontend.focus();
    }

    private deactivate(): void {
        this.frontend.off('zone_editor:add_item', this.bound_addItem);
        this.frontend.off('zone_editor:update_item', this.bound_updateItem);
        this.frontend.off('zone_editor:delete_item', this.bound_deleteItem);
        this.frontend.off('zone_editor:select', this.bound_onSelect);
        this.frontend.off('zone_editor:highlight', this.bound_onHighlight);
        this.frontend.off('zone_editor:highlight_apex', this.bound_onHighlightApex);
        try {
            alt.clearEveryTick(this._actionTimer);
        } catch {
            /* empty */
        }

        this.keyResolver.freeInputGroup('zone_editor');
        if (alt.isCursorVisible()) alt.showCursor(false);
        this.frontend.blur();

        this._highlightedId = null;
        this._lastHighlightedZone = null;
        this._highlightedApex = null;
    }
}
